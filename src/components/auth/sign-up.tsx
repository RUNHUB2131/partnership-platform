import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RunhubLogo } from '@/components/ui/runhub-logo';
import { SunIcon as RunIcon, HeartHandshakeIcon, Eye, EyeOff } from 'lucide-react';
import { signUp, signIn } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('type') as UserRole || 'brand';
  const [loading, setLoading] = useState(false);
  const [role] = useState<UserRole>(defaultRole);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: SignUpValues) {
    try {
      setLoading(true);
      setError(null);
      
      // First sign up the user
      const { error: signUpError } = await signUp(data.email, data.password, role);
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.');
          return;
        }
        throw signUpError;
      }

      // Wait a moment for the profile to be created
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Then sign them in
      const { data: signInData, error: signInError } = await signIn(data.email, data.password);
      
      if (signInError) {
        throw signInError;
      }

      if (!signInData?.profile?.role) {
        throw new Error('Failed to retrieve user profile');
      }

      toast.success('Account created successfully! Redirecting to dashboard...');
      
      // Navigate to the appropriate dashboard
      navigate(`/dashboard/${signInData.profile.role}`);
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Link to="/" className="mb-8">
        <RunhubLogo className="mx-auto" />
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            {role === 'club' ? (
              <RunIcon className="h-12 w-12 text-brand" />
            ) : (
              <HeartHandshakeIcon className="h-12 w-12 text-brand" />
            )}
          </div>
          <CardTitle className="text-2xl text-center">
            Create {role === 'club' ? 'Run Club' : 'Brand'} Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error}
                {error.includes('already registered') && (
                  <Button variant="link" className="p-0 ml-2" asChild>
                    <Link to="/signin">Sign in here</Link>
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register('email')}
                disabled={loading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register('password')}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register('confirmPassword')}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" className="p-0" asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}