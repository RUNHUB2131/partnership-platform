import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import type { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Add timeout for loading state
  useEffect(() => {
    console.log('[ProtectedRoute] Current state:', { loading, user, error });
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('[ProtectedRoute] Loading timeout reached');
        toast.error('Loading is taking longer than expected. Please sign in again.');
        navigate('/signin');
      }
    }, 5000); // 5 seconds timeout

    return () => {
      console.log('[ProtectedRoute] Cleaning up timeout');
      clearTimeout(timeout);
    };
  }, [loading, navigate]);

  // Show loading state
  if (loading) {
    console.log('[ProtectedRoute] Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  // Handle authentication errors
  if (error) {
    console.log('[ProtectedRoute] Auth error, redirecting to signin');
    toast.error('Authentication error. Please sign in again.');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to signin');
    toast.error('Please sign in to access this page.');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (user.role !== allowedRole) {
    console.log('[ProtectedRoute] Invalid role, redirecting to appropriate dashboard');
    toast.error(`Access denied. This page is for ${allowedRole}s only.`);
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Render protected content
  console.log('[ProtectedRoute] Rendering protected content');
  return <>{children}</>;
}