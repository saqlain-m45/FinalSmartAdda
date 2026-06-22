import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PendingApproval from './pages/Auth/PendingApproval';
import DriverPendingPage from './pages/Auth/DriverPendingPage';

// ─── Protected Route ────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userData, currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRoles && !userData) return <PageLoader />;
  if (userData?.role === 'driver' && userData?.status === 'pending') return <PendingApproval />;
  if (allowedRoles && !allowedRoles.includes(userData?.role)) return <Navigate to="/" />;

  return children;
};

// ─── Layout Components ──────────────────────────────────────────
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';

// ─── Lazy Pages ─────────────────────────────────────────────────
const Home             = lazy(() => import('./pages/Home'));
const Login            = lazy(() => import('./pages/Auth/Login'));
const Register         = lazy(() => import('./pages/Auth/Register'));
const BusDetails       = lazy(() => import('./pages/Passenger/BusDetails'));
const BookingConfirm   = lazy(() => import('./pages/Passenger/BookingConfirmation'));
const MyBookings       = lazy(() => import('./pages/Passenger/MyBookings'));
const TrackBus         = lazy(() => import('./pages/Passenger/TrackBus'));
const AdminDashboard   = lazy(() => import('./pages/Admin/Dashboard'));
const DriverDashboard  = lazy(() => import('./pages/Driver/Dashboard'));
const ChatSupport      = lazy(() => import('./components/Passenger/ChatSupport'));

// ─── Spinner ────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{ height: '70vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 40, height: 40, border: '3px solid #f3f3f3', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }} />
  </div>
);

// ─── Root App ───────────────────────────────────────────────────
function App() {
  const { userData, currentUser } = useAuth();
  const location = useLocation();

  // Detect admin or driver panel routes — hide frontend chrome
  const isAdminRoute  = location.pathname.startsWith('/admin');
  const isDriverRoute = location.pathname.startsWith('/driver');
  const isPanelRoute  = isAdminRoute || isDriverRoute;

  // Redirect already-logged-in users away from auth pages
  const AuthRedirect = ({ children }) => {
    if (currentUser && userData) {
      if (userData.role === 'admin')  return <Navigate to="/admin" />;
      if (userData.role === 'driver') return <Navigate to="/driver" />;
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <div className="app-container">

      {/* ── Navbar: ONLY for passenger / public pages ── */}
      {!isPanelRoute && <Navbar />}

      <div className="app-main-layout">
        {/* ── Sidebar: ONLY for admin / driver panels ── */}
        {isPanelRoute && (userData?.role === 'admin' || userData?.role === 'driver') && <Sidebar />}

        <main className={`app-main-content ${isPanelRoute ? 'panel-content' : location.pathname === '/' ? 'home-content' : 'public-content'}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public / Passenger routes */}
              <Route path="/"                    element={<Home />} />
              <Route path="/login"               element={<AuthRedirect><Login /></AuthRedirect>} />
              <Route path="/register"            element={<AuthRedirect><Register /></AuthRedirect>} />
              <Route path="/driver-pending"      element={<DriverPendingPage />} />
              <Route path="/track-bus"           element={<TrackBus />} />
              <Route path="/track/:busId"        element={<TrackBus />} />

              <Route path="/bus/:busId"          element={
                <ProtectedRoute allowedRoles={['passenger', 'admin', 'driver']}>
                  <BusDetails />
                </ProtectedRoute>
              } />
              <Route path="/booking-confirmation" element={
                <ProtectedRoute allowedRoles={['passenger', 'admin', 'driver']}>
                  <BookingConfirm />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings"         element={
                <ProtectedRoute allowedRoles={['passenger', 'admin', 'driver']}>
                  <MyBookings />
                </ProtectedRoute>
              } />

              {/* Admin panel */}
              <Route path="/admin/*"             element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Driver panel */}
              <Route path="/driver/*"            element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      {/* ── Footer: ONLY for passenger / public pages ── */}
      {!isPanelRoute && <Footer />}

      {/* ── Chat widget: ONLY for passenger / public pages ── */}
      {!isPanelRoute && (
        <Suspense fallback={null}>
          <ChatSupport />
        </Suspense>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default App;
