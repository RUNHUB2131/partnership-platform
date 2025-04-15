import { Container } from '@/components/ui/container';
import { ArrowRight, Users, Megaphone, HandshakeIcon } from 'lucide-react';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect with running clubs and create meaningful partnerships in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-brand-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
            <p className="text-muted-foreground">
              Set up your brand profile and showcase your company to running clubs
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
              <Megaphone className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Post Opportunities</h3>
            <p className="text-muted-foreground">
              Share your sponsorship opportunities and campaign details
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
              <HandshakeIcon className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect & Collaborate</h3>
            <p className="text-muted-foreground">
              Review applications and start collaborating with running clubs
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/signup?type=brand"
            className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-500"
          >
            Get started today
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </Container>
    </section>
  );
}