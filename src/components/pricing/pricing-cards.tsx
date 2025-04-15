import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Pay Per Post",
    id: "pay-per-post",
    description: "Perfect for brands testing the waters or with occasional opportunities.",
    features: [
      "Single opportunity posting",
      "Brand profile",
      "Application tracking",
      "Email notifications",
      "30-day listing duration",
    ],
    cta: "Post an Opportunity",
    mostPopular: false,
  },
  {
    name: "Unlimited",
    id: "unlimited",
    description: "Best for brands with regular opportunities and ongoing campaigns.",
    features: [
      "Unlimited opportunity postings",
      "Dedicated support",
      "Custom branding",
      "API access",
      "Bulk posting tools",
      "Campaign management",
    ],
    cta: "Subscribe Now",
    mostPopular: true,
  },
];

export function PricingCards() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={cn(
              "relative flex flex-col",
              tier.mostPopular && "border-brand-600 shadow-lg"
            )}
          >
            {tier.mostPopular && (
              <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-brand-600 px-3 py-1 text-sm font-medium text-white">
                Most popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {tier.description}
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-5 w-5 flex-none text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  "w-full",
                  tier.mostPopular && "bg-brand-600 hover:bg-brand-500"
                )}
                size="lg"
                asChild
              >
                <Link to="/signup?type=brand">{tier.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}