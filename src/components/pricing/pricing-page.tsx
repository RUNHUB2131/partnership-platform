import { PricingHero } from "./pricing-hero";
import { PricingCards } from "./pricing-cards";
import { Testimonial } from "./testimonial";
import { FAQ } from "./faq";
import { ContactSection } from "./contact-section";

export function PricingPage() {
  return (
    <div className="space-y-24 py-24">
      <PricingHero />
      <PricingCards />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Testimonial />
      </div>
      <FAQ />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ContactSection />
      </div>
    </div>
  );
}