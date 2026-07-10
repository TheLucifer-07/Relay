import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  Gavel,
  Home,
  MessageCircle,
  Plus,
  User,
  Zap,
  FileText,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRelay } from "../context/RelayContext";

const navLinks = [
  { label: "Home", icon: Home, to: "/dashboard" },
  { label: "Marketplace", icon: ShoppingBag, to: "/dashboard/marketplace" },
  { label: "Requests", icon: FileText, to: "/dashboard/requests" },
  { label: "Auction", icon: Gavel, to: "/auction" },
];

const navActions = [
  { label: "Trade Negotiations", icon: MessageCircle, to: "/messages" },
  { label: "Profile", icon: User, to: "/dashboard/profile" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    markAllNotificationsRead,
    notifications,
    isAuthenticated,
    signOutUser,
    isDemoMode,
    enterDemoMode,
    exchangeSessions,
    mockConversations,
  } = useRelay();
  const startRelayActive = location.pathname === "/dashboard/post";
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const totalUnreadMessages = isDemoMode
    ? (mockConversations || []).reduce((sum, c) => sum + (c.unread || 0), 0)
    : (exchangeSessions || []).reduce((sum, s) => sum + (s.unreadCount || 0), 0);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-[1180px] items-center justify-between gap-4 rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(10,18,30,0.84),rgba(4,10,18,0.80))] px-4 py-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.44),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[28px] sm:px-5"
      >
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[0.75rem] bg-[rgba(132,184,210,0.12)] text-[#a9cbda] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Zap className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="font-serif text-[1.18rem] leading-none text-white">
            Relay
          </span>
          {isDemoMode && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-[#ff9f71]/20 bg-[#ff9f71]/10 px-2 py-0.5 text-[0.65rem] font-medium text-[#ff9f71] backdrop-blur-sm">
              Demo
            </span>
          )}
        </Link>

        {/* Center links (Authenticated only) */}
        {isAuthenticated && (
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map(({ label, icon: Icon, to }) => {
              const active =
                location.pathname === to ||
                (to === "/dashboard/marketplace" &&
                  (location.pathname.startsWith("/dashboard/trades/") ||
                    location.pathname.startsWith("/trade/")));
              return (
                <Link
                  key={label}
                  to={to}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-white"
                      : "text-white/52 hover:text-white/88"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.09] shadow-[0_0_16px_rgba(141,205,228,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <Icon className="relative h-[0.9rem] w-[0.9rem]" strokeWidth={1.8} />
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Start Relay CTA (Authenticated only) */}
        {isAuthenticated && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => navigate("/dashboard/post")}
            className={`hidden items-center gap-2 rounded-full bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-4 py-2 text-sm font-semibold text-[#081a22] shadow-[0_8px_24px_rgba(112,152,174,0.22),inset_0_1px_0_rgba(255,255,255,0.48)] transition-all md:flex ${
              startRelayActive
                ? "ring-2 ring-white/30 ring-offset-2 ring-offset-[#07111c]"
                : ""
            }`}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
            Start Relay
          </motion.button>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  notificationsOpen
                    ? "bg-white/[0.09] text-white"
                    : "text-white/52 hover:bg-white/[0.07] hover:text-white/88"
                }`}
              >
                <Bell className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.8} />
                {unreadCount ? (
                  <span className="absolute right-1 top-1 flex h-[0.88rem] min-w-[0.88rem] items-center justify-center rounded-full bg-[#8dcde4] px-1 text-[0.48rem] font-bold text-[#010204]">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              {/* Action Links (Messages, Profile) */}
              {navActions.map(({ label, icon: Icon, to }) => {
                const active = location.pathname === to;
                const isMsg = label === "Trade Negotiations";
                return (
                  <Link
                    key={label}
                    to={to}
                    aria-label={label}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                      active
                        ? "bg-white/[0.09] text-white"
                        : "text-white/52 hover:bg-white/[0.07] hover:text-white/88"
                    }`}
                  >
                    <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.8} />
                    {isMsg && totalUnreadMessages > 0 ? (
                      <span className="absolute right-1 top-1 flex h-[0.88rem] min-w-[0.88rem] items-center justify-center rounded-full bg-[#8dcde4] px-1 text-[0.48rem] font-bold text-[#010204]">
                        {totalUnreadMessages}
                      </span>
                    ) : null}
                  </Link>
                );
              })}

              {/* Logout Button */}
              <button
                type="button"
                onClick={signOutUser}
                aria-label="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/52 hover:bg-white/[0.07] hover:text-white/88 transition-colors"
              >
                <LogOut className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.8} />
              </button>

              {/* Go Live Button for Guest Users */}
              {isDemoMode && (
                <Link
                  to="/auth?tab=signup"
                  className="rounded-full bg-gradient-to-r from-[#ff9f71] via-[#ffc75b] to-[#8dcde4] px-3.5 py-1.5 text-xs font-semibold text-[#010204] shadow-[0_8px_20px_rgba(255,159,113,0.18)] transition-all hover:opacity-90 ml-1"
                >
                  Go Live
                </Link>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { enterDemoMode(); navigate("/dashboard"); }}
                className="hidden rounded-full border border-white/8 bg-white/4 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition-all hover:bg-white/8 hover:text-white sm:inline-block"
              >
                Watch Demo
              </button>
              <Link
                to="/auth?tab=login"
                className="rounded-full border border-white/8 bg-white/4 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition-all hover:bg-white/8 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/auth?tab=signup"
                className="rounded-full bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-3.5 py-1.5 text-xs font-semibold text-[#081a22] shadow-[0_8px_20px_rgba(112,152,174,0.18)] transition-all hover:opacity-90"
              >
                Signup
              </Link>
            </div>
          )}

          {/* Mobile: Start Relay (Authenticated only) */}
          {isAuthenticated && (
            <button
              type="button"
              aria-label="Start Relay"
              onClick={() => navigate("/dashboard/post")}
              className={`ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#c4d9e3] to-[#8eb1c0] text-[#081a22] shadow-[0_4px_12px_rgba(112,152,174,0.22)] md:hidden ${
                startRelayActive
                  ? "ring-2 ring-white/30 ring-offset-2 ring-offset-[#07111c]"
                  : ""
              }`}
            >
              <Plus className="h-4 w-4" strokeWidth={2.4} />
            </button>
          )}
        </div>

        {/* Notifications Dropdown (Authenticated only) */}
        {isAuthenticated && (
          <AnimatePresence>
            {notificationsOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-2 top-[calc(100%+0.75rem)] z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(10,18,30,0.94),rgba(4,10,18,0.90))] shadow-[0_28px_90px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[28px]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-[8%] top-[1px] h-24 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_42%,transparent_100%)]"
                />
                <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-4">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                      Notifications
                    </p>
                    <p className="mt-1 text-[0.92rem] font-semibold tracking-[-0.02em] text-white/90">
                      {unreadCount} unread exchange updates
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[0.72rem] font-medium text-white/56 transition-colors hover:bg-white/[0.07] hover:text-white/86"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="relative max-h-[28rem] overflow-y-auto px-2 py-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id || notification.title}
                      className="flex gap-3 rounded-[1rem] px-3 py-3 transition-colors hover:bg-white/[0.045]"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          notification.unread ? "bg-[#8dcde4]" : "bg-white/16"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[0.82rem] font-semibold leading-5 text-white/86">
                            {notification.title}
                          </p>
                          <span className="shrink-0 text-[0.66rem] text-white/32">
                            {notification.time}
                          </span>
                        </div>
                        <p className="mt-1 text-[0.76rem] leading-5 text-white/46">
                          {notification.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative border-t border-white/[0.06] px-4 py-3">
                  <div className="flex items-center gap-2 text-[0.72rem] text-white/42">
                    <CheckCircle className="h-3.5 w-3.5 text-[#c4e0a8]" strokeWidth={1.8} />
                    AI verification and trade activity updates are live.
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </motion.nav>
    </header>
  );
}
