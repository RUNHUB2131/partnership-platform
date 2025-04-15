import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, WalletIcon } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  budget_range: string;
  event_date: string;
  location: string;
  requirements: string | null;
  status: 'open' | 'closed';
}

export function OpportunityList() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOpportunities(data || []);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-40 bg-gray-100" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Available Opportunities</h2>
      {opportunities.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No opportunities available at the moment.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{opportunity.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {opportunity.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <WalletIcon className="h-4 w-4" />
                    {opportunity.budget_range}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(opportunity.event_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    {opportunity.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}