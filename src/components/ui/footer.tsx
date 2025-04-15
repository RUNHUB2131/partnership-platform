import { Link } from 'react-router-dom';
import { RunhubLogo } from '@/components/ui/runhub-logo';

export function Footer() {
  return (
    <footer className="bg-footer text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <RunhubLogo variant="white" />
            <p className="text-sm text-gray-300">
              Connecting running clubs with brands for meaningful partnerships
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/#how-it-works" className="text-sm text-gray-300 hover:text-white">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-sm text-gray-300 hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-300 text-center">
            © {new Date().getFullYear()} RUNHUB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}