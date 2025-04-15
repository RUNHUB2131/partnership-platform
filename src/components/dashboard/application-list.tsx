import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

interface Application {
  id: string;
  opportunity: {
    title: string;
    brand: {
      name: string;
    };
  };
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export function ApplicationList() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            created_at,
            opportunity:opportunities (
              title,
              brand:brands (
                name
              )
            )
          `)
          .eq('club_id', user?.id);

        if (error) throw error;
        setApplications(data || []);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadApplications();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Applications</h2>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading applications...</p>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              You haven't submitted any applications yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {application.opportunity.title}
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">
                    {application.opportunity.brand.name}
                  </span>
                  <span className={`text-sm capitalize ${
                    application.status === 'accepted' ? 'text-green-600' :
                    application.status === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {application.status}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}