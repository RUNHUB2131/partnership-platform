import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { RunhubLogo } from '@/components/ui/runhub-logo';
import { signOut } from '@/lib/auth';
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  LogOut,
  MessageSquare,
  Bell,
  Settings,
  PlusCircle,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const brandMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard/brand',
    },
    {
      icon: UserCircle,
      label: 'My Profile',
      href: '/dashboard/brand/profile',
    },
    {
      icon: PlusCircle,
      label: 'Create Opportunity',
      href: '/dashboard/brand/opportunities/new',
    },
    {
      icon: ClipboardList,
      label: 'My Opportunities',
      href: '/dashboard/brand/opportunities',
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      href: '/dashboard/brand/messages',
    },
  ];

  const clubMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard/club',
    },
    {
      icon: UserCircle,
      label: 'My Profile',
      href: '/dashboard/club/profile',
    },
    {
      icon: Search,
      label: 'Browse Opportunities',
      href: '/dashboard/club/opportunities',
    },
    {
      icon: ClipboardList,
      label: 'My Applications',
      href: '/dashboard/club/applications',
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      href: '/dashboard/club/messages',
    },
  ];

  const menuItems = user?.role === 'brand' ? brandMenuItems : clubMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <RunhubLogo variant="small" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/dashboard/${user?.role}/profile`)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/dashboard/${user?.role}/settings`)}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 pt-16">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-2 text-sm rounded-lg transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="pl-64 pt-16">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}