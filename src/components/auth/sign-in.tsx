import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Loader } from '@/components/ui/loader';
import { RunhubLogo } from '@/components/ui/runhub-logo';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/auth';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInValues) {
    try {
      setLoading(true);
      setError(null);

      // Increment attempt counter
      setAttempts(prev => prev + 1);

      // Add artificial delay to prevent brute force
      if (attempts > 3) {
        await new Promise(resolve => setTimeout(resolve, attempts * 1000));
      }

      const { data: authData, error } = await signIn(data.email, data.password);
      
      if (error) {
        if (error.code === 'NOT_FOUND') {
          setError('Account not found. Please sign up first.');
          return;
        }
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
          return;
        }
        throw error;
      }
      
      if (!authData?.profile?.role) {
        throw new Error('User role not found');
      }

      // Reset attempts on successful login
      setAttempts(0);
      
      toast.success('Successfully signed in!');
      
      // Navigate to dashboard in same tab
      navigate(`/dashboard/${authData.profile.role}`);
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to sign in. Please check your credentials and try again.');
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
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error}
                {error.includes('sign up first') && (
                  <Button variant="link" className="p-0 ml-2" asChild>
                    <Link to="/get-started">Sign up here</Link>
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
                autoComplete="email"
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
                  autoComplete="current-password"
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

            <Button type="submit" className="w-full relative" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="p-0" asChild>
                <Link to="/get-started">Create account</Link>
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}