import { useEffect } from 'react';
import { supabase } from './supabase';
import { useAuthStore } from './auth-store';
import { toast } from 'sonner';
import type { User, UserRole } from './types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const PROFILE_CREATE_DELAY = 2000;

interface AuthError extends Error {
  code?: string;
  details?: string;
}

class AuthenticationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

async function validateUserProfile(userId: string, retryCount = 0): Promise<User | null> {
  try {
    console.log(`[validateUserProfile] Attempting to validate profile for user ${userId} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[validateUserProfile] Error fetching profile:', error);
      throw new AuthenticationError('Failed to fetch user profile', error.code);
    }
    
    if (!profile) {
      console.log('[validateUserProfile] Profile not found, will retry:', { retryCount });
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return validateUserProfile(userId, retryCount + 1);
      }
      console.log('[validateUserProfile] Max retries reached, returning null');
      return null;
    }

    if (!['brand', 'club'].includes(profile.role)) {
      console.error('[validateUserProfile] Invalid role:', profile.role);
      throw new AuthenticationError('Invalid user role');
    }

    console.log('[validateUserProfile] Profile validated successfully');
    return profile;
  } catch (error) {
    console.error('[validateUserProfile] Validation error:', error);
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return validateUserProfile(userId, retryCount + 1);
    }
    return null;
  }
}

async function createUserProfile(userId: string, email: string, role: UserRole): Promise<boolean> {
  try {
    console.log('[createUserProfile] Starting profile creation');
    
    // Wait for auth session to be fully established
    await new Promise(resolve => setTimeout(resolve, PROFILE_CREATE_DELAY));

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (existingProfile) {
      console.log('[createUserProfile] Profile already exists');
      return true;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        role,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (profileError) {
      console.error('[createUserProfile] Profile creation error:', profileError);
      throw profileError;
    }

    console.log('[createUserProfile] Profile created successfully');
    return true;
  } catch (error) {
    console.error('[createUserProfile] Error:', error);
    return false;
  }
}

export async function signUp(email: string, password: string, role: UserRole) {
  try {
    console.log('[signUp] Starting signup process');

    if (!email || !password || !role) {
      throw new Error('Missing required fields');
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (signUpError) throw signUpError;
    if (!data.user) throw new AuthenticationError('User creation failed');

    console.log('[signUp] User created, creating profile');

    const profileCreated = await createUserProfile(data.user.id, email, role);
    if (!profileCreated) {
      console.error('[signUp] Profile creation failed');
      throw new Error('Failed to create user profile');
    }

    console.log('[signUp] Signup completed successfully');
    return { data, error: null };
  } catch (error) {
    console.error('[signUp] Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to sign up'),
    };
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('[signIn] Starting signin process');

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await signOut();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new AuthenticationError('Authentication failed');

    console.log('[signIn] Auth successful, validating profile');

    const profile = await validateUserProfile(authData.user.id);
    if (!profile) {
      throw new AuthenticationError('User profile not found');
    }

    await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', authData.user.id);

    console.log('[signIn] Signin completed successfully');
    return {
      data: {
        session: authData.session,
        profile,
      },
      error: null,
    };
  } catch (error) {
    console.error('[signIn] Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to sign in'),
    };
  }
}

export async function signOut() {
  try {
    console.log('[signOut] Starting signout process');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    localStorage.clear();
    useAuthStore.getState().reset();
    console.log('[signOut] Signout completed successfully');
  } catch (error) {
    console.error('[signOut] Error:', error);
    localStorage.clear();
    useAuthStore.getState().reset();
  }
}

export function useAuth() {
  const { user, loading, error, setUser, setLoading, setError } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        if (!mounted) return;
        
        setLoading(true);
        setError(null);

        console.log('[checkAuth] Checking current session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log('[checkAuth] Session found, validating profile');
          const profile = await validateUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
            throw new Error('User profile not found');
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('[checkAuth] Error:', error);
        setError(error instanceof Error ? error : new Error('Authentication failed'));
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('[onAuthStateChange] Auth state changed:', event);
      setLoading(true);
      setError(null);

      try {
        if (session?.user) {
          if (event === 'SIGNED_UP') {
            console.log('[onAuthStateChange] New signup detected, waiting for profile creation');
            await new Promise(resolve => setTimeout(resolve, PROFILE_CREATE_DELAY));
          }
          
          const profile = await validateUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
            throw new Error('User profile not found');
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('[onAuthStateChange] Error:', error);
        setError(error instanceof Error ? error : new Error('Authentication failed'));
        setUser(null);
        signOut();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, setError]);

  return { user, loading, error };
}