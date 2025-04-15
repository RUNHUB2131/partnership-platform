import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { RunhubLogo } from '@/components/ui/runhub-logo';
import { Container } from '@/components/ui/container';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <RunhubLogo variant="small" />
            </Link>
            <nav className="hidden md:flex ml-8 space-x-8">
              <Link to="/pricing" className="nav-link text-sm font-medium">
                Pricing
              </Link>
              <a href="#how-it-works" className="nav-link text-sm font-medium">
                How it Works
              </a>
              <a href="#testimonials" className="nav-link text-sm font-medium">
                Testimonials
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Button asChild>
                <Link to={`/dashboard/${user.role}`}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/select-type">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/get-started">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}