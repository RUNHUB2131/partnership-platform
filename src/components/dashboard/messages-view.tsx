import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MessagesView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Messaging functionality coming soon! You'll be able to communicate directly with brands and running clubs here.
        </p>
      </CardContent>
    </Card>
  );
}