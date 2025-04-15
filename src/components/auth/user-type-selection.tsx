import { Link } from 'react-router-dom';
import { SunIcon as RunIcon, BriefcaseIcon, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RunhubLogo } from '@/components/ui/runhub-logo';
import { cn } from '@/lib/utils';

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: typeof RunIcon | typeof BriefcaseIcon;
  href: string;
  className?: string;
}

function UserTypeCard({ title, description, icon: Icon, href, className }: UserTypeCardProps) {
  return (
    <Link to={href}>
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        "border-2 hover:border-brand-600",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-brand-100">
              <Icon className="w-8 h-8 text-brand-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface UserTypeSelectionProps {
  type: 'signup' | 'signin';
}

export function UserTypeSelection({ type }: UserTypeSelectionProps) {
  const isSignUp = type === 'signup';
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <Link to="/" className="inline-block">
            <RunhubLogo className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSignUp ? 'Who are you joining as?' : 'Sign in as'}
          </h1>
          {isSignUp && (
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose your account type to get started with RUNHUB. You can't change this later, so please select carefully.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-slide-in" style={{ '--delay': '0.2s' } as React.CSSProperties}>
          <UserTypeCard
            title="Run Club"
            description={isSignUp 
              ? "For running clubs looking to connect with brands and find sponsorship opportunities"
              : "Access your run club dashboard and manage opportunities"
            }
            icon={RunIcon}
            href={`/${type}?type=club`}
          />
          <UserTypeCard
            title="Brand"
            description={isSignUp
              ? "For brands looking to partner with running clubs and create sponsorship opportunities"
              : "Access your brand dashboard and manage campaigns"
            }
            icon={BriefcaseIcon}
            href={`/${type}?type=brand`}
          />
        </div>

        <div className="text-center animate-slide-in" style={{ '--delay': '0.3s' } as React.CSSProperties}>
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}