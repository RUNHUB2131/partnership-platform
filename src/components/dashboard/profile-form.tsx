import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/lib/supabase';
import type { Brand, RunClub, UserRole } from '@/lib/types';

const brandProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  logo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

const clubProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  member_count: z.number().int().min(0).optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  logo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type BrandProfileValues = z.infer<typeof brandProfileSchema>;
type ClubProfileValues = z.infer<typeof clubProfileSchema>;

interface ProfileFormProps {
  type: UserRole;
}

export function ProfileForm({ type }: ProfileFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Brand | RunClub | null>(null);

  const form = useForm<BrandProfileValues | ClubProfileValues>({
    resolver: zodResolver(type === 'brand' ? brandProfileSchema : clubProfileSchema),
    defaultValues: type === 'brand' ? {
      name: '',
      description: '',
      website: '',
      logo_url: '',
    } : {
      name: '',
      description: '',
      location: '',
      member_count: 0,
      website: '',
      logo_url: '',
    }
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const table = type === 'brand' ? 'brands' : 'run_clubs';
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', user?.id)
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setProfile(data);
          form.reset(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user, type, form]);

  async function onSubmit(data: BrandProfileValues | ClubProfileValues) {
    try {
      setLoading(true);
      const table = type === 'brand' ? 'brands' : 'run_clubs';
      
      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq('id', profile.id);

        if (error) throw error;
        toast.success('Profile updated successfully');
      } else {
        // Create new profile
        const { error } = await supabase
          .from(table)
          .insert([{ ...data, user_id: user?.id }]);

        if (error) throw error;
        toast.success('Profile created successfully');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {profile ? `Edit ${type === 'brand' ? 'Brand' : 'Run Club'} Profile` : `Create ${type === 'brand' ? 'Brand' : 'Run Club'} Profile`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              disabled={loading}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              disabled={loading}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {type === 'club' && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...form.register('location')}
                disabled={loading}
              />
              {form.formState.errors.location && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          )}

          {type === 'club' && (
            <div className="space-y-2">
              <Label htmlFor="member_count">Number of Members</Label>
              <Input
                id="member_count"
                type="number"
                {...form.register('member_count', { valueAsNumber: true })}
                disabled={loading}
              />
              {form.formState.errors.member_count && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.member_count.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              {...form.register('website')}
              disabled={loading}
            />
            {form.formState.errors.website && (
              <p className="text-sm text-destructive">
                {form.formState.errors.website.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              type="url"
              {...form.register('logo_url')}
              disabled={loading}
            />
            {form.formState.errors.logo_url && (
              <p className="text-sm text-destructive">
                {form.formState.errors.logo_url.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {profile ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}