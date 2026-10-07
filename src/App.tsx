import React from 'react';
import { useRouter } from './context/RouterContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { RegistrationSuccessPage } from './pages/RegistrationSuccessPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminRegistrationsPage } from './pages/admin/AdminRegistrationsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminPaymentSettingsPage } from './pages/admin/AdminPaymentSettingsPage';
import { AdminSiteSettingsPage } from './pages/admin/AdminSiteSettingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

export function App() {
  const { currentPath, matchesRoute } = useRouter();

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Admin Login
    if (currentPath === '/admin/login') {
      return <AdminLoginPage />;
    }

    // 2. Admin Dashboard & Subpages
    if (currentPath === '/admin') {
      return (
        <AdminLayout>
          <AdminDashboardPage />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/registrations' || matchesRoute('/admin/registrations/:id')) {
      return (
        <AdminLayout>
          <AdminRegistrationsPage />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/events') {
      return (
        <AdminLayout>
          <AdminEventsPage />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/settings/payment') {
      return (
        <AdminLayout>
          <AdminPaymentSettingsPage />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/settings') {
      return (
        <AdminLayout>
          <AdminSiteSettingsPage />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/users') {
      return (
        <AdminLayout>
          <AdminUsersPage />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/logs') {
      return (
        <AdminLayout>
          <AdminAuditLogsPage />
        </AdminLayout>
      );
    }

    // 3. Public Pages
    let publicContent: React.ReactNode = null;

    if (matchesRoute('/registration-success/:registrationId')) {
      publicContent = <RegistrationSuccessPage />;
    } else if (matchesRoute('/register/:slug')) {
      publicContent = <RegistrationPage />;
    } else if (matchesRoute('/events/:slug')) {
      publicContent = <EventDetailsPage />;
    } else if (currentPath === '/events') {
      publicContent = <EventsPage />;
    } else if (currentPath === '/about') {
      publicContent = <AboutPage />;
    } else if (currentPath === '/contact') {
      publicContent = <ContactPage />;
    } else {
      // Default to Home
      publicContent = <HomePage />;
    }

    return (
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{publicContent}</main>
        <Footer />
      </div>
    );
  };

  return <>{renderRoute()}</>;
}

export default App;
