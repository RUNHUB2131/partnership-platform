import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SettingsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Account settings and preferences will be available here soon.
        </p>
      </CardContent>
    </Card>
  );
}