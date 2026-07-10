import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Marketplace from "../pages/Marketplace";
import TradeDetails from "../pages/TradeDetails";
import StartRelay from "../pages/StartRelay";
import Requests from "../pages/Requests";
import Messages from "../pages/Messages";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import PublicProfile from "../pages/PublicProfile";
import Settings from "../pages/Settings";
import Auction from "../pages/Auction";
import { AUCTION_ROUTE, LEGACY_TRADE_DETAIL_ROUTE, TRADE_DETAIL_ROUTE } from "./paths";
import { useRelay } from "../context/RelayContext";

// Auth pages
import Auth from "../pages/Auth";
import ForgotPassword from "../pages/ForgotPassword";

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading, isDemoMode } = useRelay();

  // If in demo mode, bypass authorization check entirely
  if (isDemoMode) {
    return children;
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010204]">
        <div className="text-sm font-semibold tracking-wide text-white/50">Verifying session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?tab=login" replace />;
  }

  return children;
}

function AnonymousRoute({ children }) {
  const { isAuthenticated, authLoading, isDemoMode } = useRelay();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010204]">
        <div className="text-sm font-semibold tracking-wide text-white/50">Verifying session...</div>
      </div>
    );
  }

  // Redirect to dashboard ONLY if they are authenticated as a persistent user (not demo!)
  if (isAuthenticated && !isDemoMode) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * DemoEntryRedirect — handles legacy /demo/* URLs.
 * Calls enterDemoMode() then redirects to the equivalent authenticated path.
 */
function DemoEntryRedirect({ to }) {
  const { enterDemoMode } = useRelay();
  const navigate = useNavigate();

  useEffect(() => {
    enterDemoMode();
    navigate(to, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#010204]">
      <div className="text-sm font-semibold tracking-wide text-white/50">Loading demo...</div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Marketing Landing */}
      <Route path="/" element={<Landing />} />

      {/* Guest Authentication Routes */}
      <Route path="/auth" element={<AnonymousRoute><Auth /></AnonymousRoute>} />
      <Route path="/login" element={<Navigate to="/auth?tab=login" replace />} />
      <Route path="/signup" element={<Navigate to="/auth?tab=signup" replace />} />
      <Route path="/forgot-password" element={<AnonymousRoute><ForgotPassword /></AnonymousRoute>} />

      {/* Production Application Routes (Protected — but demo mode bypasses all guards) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
      <Route path={TRADE_DETAIL_ROUTE} element={<ProtectedRoute><TradeDetails /></ProtectedRoute>} />
      <Route path={LEGACY_TRADE_DETAIL_ROUTE} element={<ProtectedRoute><TradeDetails /></ProtectedRoute>} />
      <Route path="/dashboard/post" element={<ProtectedRoute><StartRelay /></ProtectedRoute>} />
      <Route path="/dashboard/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/dashboard/messages" element={<Navigate to="/messages" replace />} />
      <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
      <Route path={AUCTION_ROUTE} element={<ProtectedRoute><Auction /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Legacy /demo/* routes — enter demo mode and redirect */}
      <Route path="/demo" element={<DemoEntryRedirect to="/dashboard" />} />
      <Route path="/dashboard/demo" element={<DemoEntryRedirect to="/dashboard" />} />
      <Route path="/demo/dashboard" element={<DemoEntryRedirect to="/dashboard" />} />
      <Route path="/demo/dashboard/marketplace" element={<DemoEntryRedirect to="/dashboard/marketplace" />} />
      <Route path="/demo/dashboard/requests" element={<DemoEntryRedirect to="/dashboard/requests" />} />
      <Route path="/demo/dashboard/messages" element={<DemoEntryRedirect to="/messages" />} />
      <Route path="/demo/dashboard/notifications" element={<DemoEntryRedirect to="/dashboard/notifications" />} />
      <Route path="/demo/dashboard/profile" element={<DemoEntryRedirect to="/dashboard/profile" />} />
      <Route path="/demo/auction" element={<DemoEntryRedirect to="/auction" />} />
      <Route path="/demo/dashboard/post" element={<DemoEntryRedirect to="/dashboard/post" />} />
      <Route path="/demo/dashboard/settings" element={<DemoEntryRedirect to="/dashboard/settings" />} />
    </Routes>
  );
}

export default AppRoutes;
