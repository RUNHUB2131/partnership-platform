import { Container } from "@/components/ui/container";

export function PricingHero() {
  return (
    <Container className="py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Connect with running clubs efficiently and effectively. Choose the plan that works best for your brand's needs.
        </p>
      </div>
    </Container>
  );
}