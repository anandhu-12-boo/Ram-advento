import { useEffect, type ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SiteShell } from "@/components/SiteShell";

// Page Imports
import HomePage from "./routes/index";
import SafariPage from "./routes/safari";
import ToursPage from "./routes/tours.index";
import TourDetailPage from "./routes/tours.$slug";
import GalleryPage from "./routes/gallery";
import AboutPage from "./routes/about";
import ContactPage from "./routes/contact";
import BookPage from "./routes/book";
import BookingConfirmedPage from "./routes/booking-confirmed";
import LoginPage from "./routes/login";
import RegisterPage from "./routes/register";
import ForgotPasswordPage from "./routes/forgot-password";
import ResetPasswordPage from "./routes/reset-password";

// Authenticated Account Pages
import MyAccountPage from "./routes/_authenticated/my-account.index";
import MyBookingsPage from "./routes/_authenticated/my-account.bookings.index";
import BookingDetailPage from "./routes/_authenticated/my-account.bookings.$bookingId";

// Admin Pages
import AdminDashboard from "./routes/admin.index";
import AdminLoginPage from "./routes/admin.login";
import AdminBookingsPage from "./routes/admin.bookings.index";
import AdminBookingDetailPage from "./routes/admin.bookings.$bookingId";
import AdminToursPage from "./routes/admin.tours";
import AdminAvailabilityPage from "./routes/admin.availability";
import AdminCustomersPage from "./routes/admin.customers";
import AdminRevenuePage from "./routes/admin.revenue";
import AdminReviewsPage from "./routes/admin.reviews";
import AdminEnquiriesPage from "./routes/admin.enquiries";
import AdminSettingsPage from "./routes/admin.settings";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function ProtectedCustomerRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <SiteShell>
        <div className="flex min-h-[60vh] items-center justify-center pt-24">
          <BrandLogo size={64} priority />
        </div>
      </SiteShell>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}

function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <SiteShell hideFooter hideMobileBookingBar>
        <div className="flex min-h-[60vh] items-center justify-center pt-24">
          <BrandLogo size={64} priority />
        </div>
      </SiteShell>
    );
  }

  if (!isAdmin) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}

function NotFoundPage() {
  return (
    <SiteShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center pt-24">
        <BrandLogo size={100} interactive />
        <h1 className="mt-8 font-display text-[clamp(2rem,6vw,4rem)] text-mist">
          You've taken the wrong trail.
        </h1>
        <p className="mt-3 text-mist/70">Let's get you back to the adventure.</p>
        <a href="/" className="mt-8 rounded-sm bg-sand px-6 py-3 text-xs font-bold uppercase text-forest-deep">
          Back to adventure
        </a>
      </div>
    </SiteShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/safari" element={<SafariPage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tours/:slug" element={<TourDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Authenticated Customer Routes */}
        <Route
          path="/my-account"
          element={
            <ProtectedCustomerRoute>
              <MyAccountPage />
            </ProtectedCustomerRoute>
          }
        />
        <Route
          path="/my-account/bookings"
          element={
            <ProtectedCustomerRoute>
              <MyBookingsPage />
            </ProtectedCustomerRoute>
          }
        />
        <Route
          path="/my-account/bookings/:bookingId"
          element={
            <ProtectedCustomerRoute>
              <BookingDetailPage />
            </ProtectedCustomerRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedAdminRoute>
              <AdminBookingsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/bookings/:bookingId"
          element={
            <ProtectedAdminRoute>
              <AdminBookingDetailPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/tours"
          element={
            <ProtectedAdminRoute>
              <AdminToursPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/availability"
          element={
            <ProtectedAdminRoute>
              <AdminAvailabilityPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedAdminRoute>
              <AdminCustomersPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/revenue"
          element={
            <ProtectedAdminRoute>
              <AdminRevenuePage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedAdminRoute>
              <AdminReviewsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/enquiries"
          element={
            <ProtectedAdminRoute>
              <AdminEnquiriesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <AdminSettingsPage />
            </ProtectedAdminRoute>
          }
        />

        {/* Catch All 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
