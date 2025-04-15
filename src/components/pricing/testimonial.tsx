import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Testimonial() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="pt-6">
        <div className="relative">
          <svg
            className="absolute -top-6 -left-6 h-16 w-16 text-brand-100 transform -rotate-12"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <blockquote className="relative">
            <p className="text-lg font-medium leading-8 text-gray-900">
              "RUNHUB has transformed how we connect with running clubs. The platform's reach and ease of use have helped us launch successful campaigns across multiple cities. The unlimited plan has been perfect for our ongoing partnerships."
            </p>
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">John Doe</div>
              <div className="text-sm text-muted-foreground">Marketing Director, SportsBrand Inc.</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}