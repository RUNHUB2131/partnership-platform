import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, Phone } from "lucide-react";

export function ContactSection() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Still have questions?</CardTitle>
        <CardDescription>
          Our team is here to help. Get in touch with us through any of these channels.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Us
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Call Us
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Live Chat
        </Button>
      </CardContent>
    </Card>
  );
}