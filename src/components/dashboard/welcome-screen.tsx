import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/lib/supabase';

export function WelcomeScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      if (!user) return;

      const table = user.role === 'brand' ? 'brands' : 'run_clubs';
      const { data } = await supabase
        .from(table)
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      setHasProfile(!!data);
    }

    checkProfile();
  }, [user]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to RUNHUB! 🎉</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Let's get you started</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                1
              </div>
              <p>Complete your profile to showcase your {user?.role === 'brand' ? 'brand' : 'run club'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                2
              </div>
              <p>
                {user?.role === 'brand'
                  ? 'Create your first opportunity'
                  : 'Browse available opportunities'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                3
              </div>
              <p>
                {user?.role === 'brand'
                  ? 'Connect with running clubs'
                  : 'Submit your first application'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate(`/dashboard/${user?.role}/profile`)}
          >
            {hasProfile ? 'View Profile' : 'Complete Your Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}