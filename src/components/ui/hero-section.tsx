import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="py-24 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-7xl font-bold mb-6">
          Connect with RUNHUB
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join the community where running clubs and brands create meaningful partnerships
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/signup?type=club">I'm a Running Club</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/signup?type=brand">I'm a Brand</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}