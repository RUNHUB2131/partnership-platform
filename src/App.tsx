import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { HeroSection } from '@/components/ui/hero-section';
import { HowItWorks } from '@/components/ui/how-it-works';
import { TrustedBy } from '@/components/ui/trusted-by';
import { UserTypeSelection } from '@/components/auth/user-type-selection';
import { SignIn } from '@/components/auth/sign-in';
import { SignUp } from '@/components/auth/sign-up';
import { BrandDashboard } from '@/components/dashboard/brand-dashboard';
import { ClubDashboard } from '@/components/dashboard/club-dashboard';
import { PricingPage } from '@/components/pricing/pricing-page';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <main className="flex-grow pt-16">
                    <HeroSection />
                    <HowItWorks />
                    <TrustedBy />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/pricing"
              element={
                <>
                  <Header />
                  <main className="flex-grow pt-16">
                    <PricingPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route path="/get-started" element={<UserTypeSelection type="signup" />} />
            <Route path="/select-type" element={<UserTypeSelection type="signin" />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard/brand/*"
              element={
                <ProtectedRoute allowedRole="brand">
                  <BrandDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/club/*"
              element={
                <ProtectedRoute allowedRole="club">
                  <ClubDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;