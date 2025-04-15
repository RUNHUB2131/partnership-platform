import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/lib/supabase';
import { ClipboardList, Trophy, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RunClubStats {
  totalApplications: number;
  acceptedApplications: number;
  upcomingEvents: number;
}

export function RunClubStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RunClubStats>({
    totalApplications: 0,
    acceptedApplications: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // Get run club ID using maybeSingle() to handle no results gracefully
        const { data: runClub, error: clubError } = await supabase
          .from('run_clubs')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (clubError) {
          throw clubError;
        }

        // If no run club found, return early with default stats
        if (!runClub) {
          setStats({
            totalApplications: 0,
            acceptedApplications: 0,
            upcomingEvents: 0,
          });
          setLoading(false);
          return;
        }

        // Fetch applications stats
        const { data: applications, error: appsError } = await supabase
          .from('applications')
          .select('status, opportunity:opportunities(event_date)')
          .eq('club_id', runClub.id);

        if (appsError) {
          throw appsError;
        }

        // Calculate stats from applications
        const total = applications?.length || 0;
        const accepted = applications?.filter(app => app.status === 'accepted').length || 0;
        const upcoming = applications?.filter(
          app => 
            app.status === 'accepted' && 
            app.opportunity?.event_date && 
            new Date(app.opportunity.event_date) > new Date()
        ).length || 0;

        setStats({
          totalApplications: total,
          acceptedApplications: accepted,
          upcomingEvents: upcoming,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  const stats_items = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: ClipboardList,
      color: 'text-blue-600',
    },
    {
      title: 'Accepted Applications',
      value: stats.acceptedApplications,
      icon: Trophy,
      color: 'text-green-600',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats_items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className={cn('w-5 h-5', item.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}