import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let authListener: ReturnType<typeof supabase.auth.onAuthStateChange>;

    async function getProfile(userId: string) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    }

    async function initialize() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          if (mounted && profile) {
            setUser(profile);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError(error instanceof Error ? error : new Error('Authentication failed'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    authListener = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        try {
          const profile = await getProfile(session.user.id);
          if (mounted && profile) {
            setUser(profile);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          if (mounted) {
            setError(error instanceof Error ? error : new Error('Authentication failed'));
          }
        }
      } else {
        if (mounted) {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}