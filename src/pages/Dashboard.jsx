import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  TicketPercent,
  Gift,
  Wrench,
  Sparkles,
  ArrowRight,
  MapPin,
  MessageCircle,
  Zap,
  CheckCircle,
  Clock,
  Users,
  Award,
  TrendingUp,
  BarChart3,
  ShoppingBag,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useRelay } from "../context/RelayContext";
import { tradePath } from "../routes/paths";
import { getInitials } from "../utils/initials";
import Avatar from "../components/ui/Avatar";

const easing = [0.22, 1, 0.36, 1];

function reveal(shouldReduceMotion, delay = 0) {
  return {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.85, delay, ease: easing },
    },
  };
}

function useReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return { ref, inView };
}

// ─── Glass card shell ─────────────────────────────────────────────────────────

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.78),rgba(5,10,18,0.72))] shadow-[0_24px_70px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[22px] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] top-[1px] h-[36%] rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.02)_30%,transparent_100%)]"
      />
      {children}
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const categoryMeta = {
  Books: { icon: BookOpen, iconClass: "text-[#8dcde4]", blobColor: "bg-[#8dcde4]/20", glowColor: "rgba(141,205,228,0.15)", statusColor: "text-[#8dcde4]" },
  Coupons: { icon: TicketPercent, iconClass: "text-[#ffc75b]", blobColor: "bg-[#ffc75b]/18", glowColor: "rgba(255,199,91,0.13)", statusColor: "text-[#ffc75b]" },
  "Gift Cards": { icon: Gift, iconClass: "text-[#ff9f71]", blobColor: "bg-[#ff9f71]/18", glowColor: "rgba(255,159,113,0.13)", statusColor: "text-[#ff9f71]" },
  Tools: { icon: Wrench, iconClass: "text-[#88c4ff]", blobColor: "bg-[#88c4ff]/18", glowColor: "rgba(136,196,255,0.13)", statusColor: "text-[#8dcde4]" },
  More: { icon: Sparkles, iconClass: "text-[#bb93ff]", blobColor: "bg-[#bb93ff]/14", glowColor: "rgba(187,147,255,0.12)", statusColor: "text-[#bb93ff]" },
};

// ─── Trending Relays ──────────────────────────────────────────────────────────

const trending = [
  {
    id: 1,
    icon: BookOpen,
    iconClass: "text-[#8dcde4]",
    blobColor: "bg-[#8dcde4]/20",
    glowColor: "rgba(141,205,228,0.15)",
    title: "Atomic Habits",
    description: "Offering for Clean Code",
    distance: "0.4 km",
    status: "★★★★★ Like New",
    statusColor: "text-[#8dcde4]",
    user: "Priya M.",
  },
  {
    id: 6,
    icon: TicketPercent,
    iconClass: "text-[#ffc75b]",
    blobColor: "bg-[#ffc75b]/18",
    glowColor: "rgba(255,199,91,0.13)",
    title: "Amazon 10% Coupon",
    description: "Looking for BookMyShow voucher",
    distance: "1.1 km",
    status: "Expires in 5 Days",
    statusColor: "text-[#ffc75b]",
    user: "Arjun K.",
  },
  {
    id: 10,
    icon: Gift,
    iconClass: "text-[#ff9f71]",
    blobColor: "bg-[#ff9f71]/18",
    glowColor: "rgba(255,159,113,0.13)",
    title: "Amazon Gift Card",
    description: "Unused balance for Swiggy card",
    distance: "0.8 km",
    status: "Unused · Verified",
    statusColor: "text-[#ff9f71]",
    user: "Meera S.",
  },
  {
    id: 15,
    icon: Wrench,
    iconClass: "text-[#88c4ff]",
    blobColor: "bg-[#88c4ff]/18",
    glowColor: "rgba(136,196,255,0.13)",
    title: "Bosch Drill",
    description: "Offering for Arduino kit",
    distance: "2.3 km",
    status: "Like New",
    statusColor: "text-[#8dcde4]",
    user: "Rahul D.",
  },
  {
    id: 3,
    icon: BookOpen,
    iconClass: "text-[#8dcde4]",
    blobColor: "bg-[#8dcde4]/20",
    glowColor: "rgba(141,205,228,0.15)",
    title: "Design Thinking",
    description: "Offering for DSA Abdul Bari",
    distance: "0.6 km",
    status: "★★★★ Good",
    statusColor: "text-[#8dcde4]",
    user: "Sneha R.",
  },
  {
    id: 7,
    icon: TicketPercent,
    iconClass: "text-[#ffc75b]",
    blobColor: "bg-[#ffc75b]/18",
    glowColor: "rgba(255,199,91,0.13)",
    title: "Myntra Coupon",
    description: "Looking for Ajio coupon",
    distance: "1.4 km",
    status: "Expires in 2 Days",
    statusColor: "text-[#ffc75b]",
    user: "Kiran T.",
  },
];

// ─── Nearby Requests — sourced from demoRequestsSeed for stable deterministic IDs ─

const requests = [
  {
    id: "demo-request-aditya",
    tradeId: "demo-request-aditya",
    name: "Aditya R.",
    initials: "AR",
    otherUserId: "demo-user-5",
    avatarColor: "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
    item: "Looking for a book on UX design",
    lookingFor: "Looking for a book on UX design",
    icon: BookOpen,
    iconClass: "text-[#8dcde4]",
    match: 94,
    distance: "0.5 km",
  },
  {
    id: "demo-request-nisha",
    tradeId: "demo-request-nisha",
    name: "Nisha P.",
    initials: "NP",
    otherUserId: "demo-user-2",
    avatarColor: "bg-[rgba(255,199,91,0.16)] text-[#ffc75b]",
    item: "Needs a 15% or more discount coupon",
    lookingFor: "Needs a 15% or more discount coupon",
    icon: TicketPercent,
    iconClass: "text-[#ffc75b]",
    match: 88,
    distance: "0.9 km",
  },
  {
    id: "demo-request-vikram",
    tradeId: "demo-request-vikram",
    name: "Vikram S.",
    initials: "VS",
    otherUserId: "demo-user-1",
    avatarColor: "bg-[rgba(136,196,255,0.16)] text-[#88c4ff]",
    item: "Looking to borrow a hand drill",
    lookingFor: "Looking to borrow a hand drill",
    icon: Wrench,
    iconClass: "text-[#88c4ff]",
    match: 97,
    distance: "1.2 km",
  },
  {
    id: "demo-request-divya",
    tradeId: "demo-request-divya",
    name: "Divya M.",
    initials: "DM",
    otherUserId: "demo-user-8",
    avatarColor: "bg-[rgba(255,159,113,0.16)] text-[#ff9f71]",
    item: "Wants a gift card for stationery",
    lookingFor: "Wants a gift card for stationery",
    icon: Gift,
    iconClass: "text-[#ff9f71]",
    match: 82,
    distance: "1.8 km",
  },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────

const activity = [
  {
    icon: CheckCircle,
    iconClass: "text-[#c4e0a8]",
    dotColor: "bg-[#c4e0a8]",
    title: "Relay completed",
    description: "\"Atomic Habits\" handed off to Priya M.",
    time: "2 hours ago",
  },
  {
    icon: MessageCircle,
    iconClass: "text-[#8dcde4]",
    dotColor: "bg-[#8dcde4]",
    title: "New negotiation",
    description: "Vikram S. replied about the drill trade.",
    time: "4 hours ago",
  },
  {
    icon: Zap,
    iconClass: "text-[#ffc75b]",
    dotColor: "bg-[#ffc75b]",
    title: "New match found",
    description: "Your coupon matches Nisha P.'s request.",
    time: "Yesterday",
  },
  {
    icon: Users,
    iconClass: "text-[#bb93ff]",
    dotColor: "bg-[#bb93ff]",
    title: "Someone nearby joined",
    description: "3 new members joined your local community.",
    time: "2 days ago",
  },
  {
    icon: Clock,
    iconClass: "text-[#88c4ff]",
    dotColor: "bg-[#88c4ff]",
    title: "Coupon trade expiring",
    description: "Your Amazon coupon trade expires in 5 days.",
    time: "2 days ago",
  },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const {
    marketplaceListings,
    incomingRequests,
    notifications,
    ongoingTrades,
    completedTrades,
    mockConversations,
    startOrOpenConversation,
    isStartingNegotiation,
    isDemoMode,
  } = useRelay();

  const { ref: statsRef, inView: statsInView } = useReveal();
  const { ref: trendingRef, inView: trendingInView } = useReveal();
  const { ref: requestsRef, inView: requestsInView } = useReveal();
  const { ref: activityRef, inView: activityInView } = useReveal();

  const activeRelaysCount = ongoingTrades.length || 4;
  const completedRelaysCount = completedTrades.length || 17;
  const nearbyRequestsCount = (incomingRequests.length + marketplaceListings.filter(l => l.status === "Urgent Trade").length) || 23;
  const negotiationsCount = mockConversations.length || 3;

  const dynamicStats = [
    { label: "Active Relays", value: String(activeRelaysCount), icon: Zap, color: "#8dcde4", glow: "rgba(141,205,228,0.13)" },
    { label: "Completed Relays", value: String(completedRelaysCount), icon: CheckCircle, color: "#c4e0a8", glow: "rgba(196,224,168,0.11)" },
    { label: "Nearby Requests", value: String(nearbyRequestsCount), icon: MapPin, color: "#ffc75b", glow: "rgba(255,199,91,0.11)" },
    { label: "Negotiations", value: String(negotiationsCount), icon: MessageCircle, color: "#bb93ff", glow: "rgba(187,147,255,0.11)" },
  ];

  const formattedIncoming = incomingRequests.map(ir => ({
    id: ir.id,
    tradeId: ir.tradeId,
    name: ir.name,
    initials: ir.initials,
    otherUserId: ir.otherUserId || ir.userId,
    avatarColor: ir.color || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
    item: `Wants to trade: ${ir.lookingFor} for ${ir.offering}`,
    icon: ShoppingBag,
    iconClass: "text-[#8dcde4]",
    match: 95,
    distance: ir.distance || "Nearby",
  }));

  const resolvedRequests = useMemo(() => {
    return requests.map((r) => {
      if (isDemoMode) return r;
      const matchedListing = r.name.includes("Aditya")
        ? marketplaceListings.find(l => l.ownerName?.includes("Aditya") || l.ownerProfile?.name?.includes("Aditya"))
        : r.name.includes("Nisha")
        ? marketplaceListings.find(l => l.ownerName?.includes("Nisha") || l.ownerProfile?.name?.includes("Nisha"))
        : r.name.includes("Vikram")
        ? marketplaceListings.find(l => l.ownerName?.includes("Vikram") || l.ownerProfile?.name?.includes("Vikram"))
        : marketplaceListings.find(l => !l.ownerName?.includes("Aditya") && !l.ownerName?.includes("Nisha") && !l.ownerName?.includes("Vikram"));

      if (matchedListing) {
        return {
          ...r,
          id: matchedListing.id || matchedListing._id,
          tradeId: matchedListing.id || matchedListing._id,
          otherUserId: matchedListing.userId || matchedListing.ownerId,
          name: matchedListing.ownerName || matchedListing.ownerProfile?.name || r.name,
          initials: getInitials(matchedListing.ownerName || r.name),
        };
      }
      return r;
    });
  }, [marketplaceListings, isDemoMode]);

  const dashboardRequests = formattedIncoming.length
    ? [...formattedIncoming, ...resolvedRequests].slice(0, 4)
    : resolvedRequests;

  const recentNotifications = notifications.slice(0, 3).map(n => ({
    icon: n.type === "match" ? Zap : CheckCircle,
    iconClass: n.type === "match" ? "text-[#ffc75b]" : "text-[#c4e0a8]",
    dotColor: n.type === "match" ? "bg-[#ffc75b]" : "bg-[#c4e0a8]",
    title: n.title,
    description: n.message,
    time: n.time || "Just now"
  }));

  const dashboardActivity = recentNotifications.length
    ? [...recentNotifications, ...activity].slice(0, 5)
    : activity;

  const dashboardTrending = marketplaceListings.length
    ? marketplaceListings.slice(0, 6).map((listing) => {
        const meta = categoryMeta[listing.category] || categoryMeta.More;

        return {
          id: listing.id,
          ...meta,
          title: listing.title,
          description: `Offering for ${listing.lookingFor}`,
          distance: listing.distance,
          status: listing.detailValue || listing.availability,
          user: listing.owner,
        };
      })
    : trending;

  return (
    <div className="relative min-h-screen text-white">
      {/* Overlays — same as Landing */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.32)_0%,rgba(2,7,12,0.22)_18%,rgba(0,0,0,0.30)_54%,rgba(0,0,0,0.60)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(164,207,228,0.07)_0%,transparent_28%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">

        {/* ── Hero ── */}
        <section aria-labelledby="dash-title" className="mb-12">
          <motion.div
            variants={reveal(shouldReduceMotion, 0)}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
              Dashboard
            </p>
            <h1
              id="dash-title"
              className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white"
            >
              Welcome back.
            </h1>
            <p className="mt-3 max-w-[36rem] text-[1.05rem] leading-[1.7] text-white/62">
              Ready to help something valuable find its next owner?
            </p>
          </motion.div>

          <motion.div
            variants={reveal(shouldReduceMotion, 0.1)}
            initial="hidden"
            animate="visible"
            className="mt-7 flex flex-wrap gap-4"
          >
            <button
              type="button"
              onClick={() => navigate("/dashboard/post")}
              className="inline-flex items-center gap-3 rounded-full border border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-7 py-3.5 text-[0.95rem] font-semibold tracking-[-0.02em] text-[#081a22] shadow-[0_18px_48px_rgba(112,152,174,0.26),inset_0_1px_0_rgba(255,255,255,0.48)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/6 bg-black/10">
                <Sparkles className="h-[0.9rem] w-[0.9rem]" />
              </span>
              Start a Relay
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/requests")}
              className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(8,20,31,0.76),rgba(4,12,20,0.56))] px-7 py-3.5 text-[0.95rem] font-medium tracking-[-0.02em] text-[#dfedf3] shadow-[0_16px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9ec1d0]/22"
            >
              <ArrowRight className="h-[1rem] w-[1rem] text-[#a2c8d8]" />
              Browse Requests
            </button>
          </motion.div>
        </section>

        {/* ── Stats ── */}
        <section ref={statsRef} aria-label="Statistics" className="mb-12">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {dynamicStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={reveal(shouldReduceMotion, i * 0.07)}
                  initial="hidden"
                  animate={statsInView ? "visible" : "hidden"}
                >
                  <GlassCard className="px-5 py-5">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-[55%] rounded-[inherit]"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${stat.glow} 0%, transparent 72%)` }}
                    />
                    <div
                      className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_6px_16px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      <Icon className={`h-[1rem] w-[1rem] ${stat.color === "#8dcde4" ? "text-[#8dcde4]" : stat.color === "#c4e0a8" ? "text-[#c4e0a8]" : stat.color === "#ffc75b" ? "text-[#ffc75b]" : "text-[#bb93ff]"}`} strokeWidth={1.8} />
                    </div>
                    <p className="relative mt-4 font-serif text-[2rem] leading-none tracking-[-0.04em] text-white">
                      {stat.value}
                    </p>
                    <p className="relative mt-1.5 text-[0.8rem] text-white/52">
                      {stat.label}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Trending Relays ── */}
        <section ref={trendingRef} aria-labelledby="trending-title" className="mb-12">
          <motion.div
            variants={reveal(shouldReduceMotion, 0)}
            initial="hidden"
            animate={trendingInView ? "visible" : "hidden"}
            className="mb-6 flex items-end justify-between"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                Trending Relays
              </p>
              <h2
                id="trending-title"
                className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white"
              >
                Popular resources nearby.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/marketplace")}
              className="hidden text-sm text-white/46 transition-colors hover:text-white/80 sm:block"
            >
              View all →
            </button>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardTrending.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title + i}
                  variants={reveal(shouldReduceMotion, 0.05 + i * 0.06)}
                  initial="hidden"
                  animate={trendingInView ? "visible" : "hidden"}
                >
                  <GlassCard className="px-5 py-5 transition-transform duration-300 hover:-translate-y-1">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-[50%] rounded-[inherit]"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${card.glowColor} 0%, transparent 72%)` }}
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute -right-5 -top-5 h-14 w-14 rounded-full blur-2xl ${card.blobColor}`}
                    />

                    <div className="relative flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                        <Icon className={`h-[1.05rem] w-[1.05rem] ${card.iconClass}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.96rem] font-semibold tracking-[-0.02em] text-white/94">
                          {card.title}
                        </p>
                        <p className="mt-0.5 text-[0.8rem] leading-5 text-white/52">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[0.76rem] text-white/44">
                        <MapPin className="h-3 w-3" strokeWidth={1.8} />
                        {card.distance}
                        <span className="text-white/24">·</span>
                        <span className="text-white/44">{card.user}</span>
                      </div>
                      <span className={`text-[0.74rem] font-medium ${card.statusColor}`}>
                        {card.status}
                      </span>
                    </div>

                    <div className="relative mt-4 border-t border-white/[0.06] pt-4">
                      <button
                        type="button"
                        onClick={() => navigate(tradePath(card.id))}
                        className="w-full rounded-[0.9rem] border border-white/[0.08] bg-white/[0.04] py-2 text-[0.8rem] font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white/90"
                      >
                        View Trade
                      </button>
                    </div>
                  </GlassCard>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* ── Nearby Requests ── */}
        <section ref={requestsRef} aria-labelledby="requests-title" className="mb-12">
          <motion.div
            variants={reveal(shouldReduceMotion, 0)}
            initial="hidden"
            animate={requestsInView ? "visible" : "hidden"}
            className="mb-6 flex items-end justify-between"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                Nearby Requests
              </p>
              <h2
                id="requests-title"
                className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white"
              >
                People waiting for your resources.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/requests")}
              className="hidden text-sm text-white/46 transition-colors hover:text-white/80 sm:block"
            >
              View all →
            </button>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {dashboardRequests.map((req, i) => {
              const Icon = req.icon || ShoppingBag;
              return (
                <motion.article
                  key={req.name}
                  variants={reveal(shouldReduceMotion, 0.06 + i * 0.07)}
                  initial="hidden"
                  animate={requestsInView ? "visible" : "hidden"}
                >
                  <GlassCard className="px-5 py-5">
                    <div className="relative flex items-center gap-4">
                      {/* Avatar */}
                      <button
                        type="button"
                        onClick={() => {
                          if (req.otherUserId) {
                            navigate(`/profile/${req.otherUserId}`);
                          }
                        }}
                        className="transition-opacity hover:opacity-80 outline-none shrink-0"
                      >
                        <Avatar
                          item={{
                            name: req.name,
                            initials: req.initials || getInitials(req.name),
                            color: req.avatarColor,
                          }}
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (req.otherUserId) {
                                navigate(`/profile/${req.otherUserId}`);
                              }
                            }}
                            className="text-[0.94rem] font-semibold tracking-[-0.02em] text-white/94 hover:text-[#8dcde4] transition-colors text-left outline-none"
                          >
                            {req.name}
                          </button>
                          <span className="shrink-0 rounded-full bg-[rgba(196,224,168,0.12)] px-2.5 py-0.5 text-[0.72rem] font-semibold text-[#c4e0a8]">
                            {req.match}% match
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[0.8rem] text-white/54">
                          <Icon className={`h-3 w-3 shrink-0 ${req.iconClass || "text-[#8dcde4]"}`} strokeWidth={1.8} />
                          <span className="truncate">{req.item}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[0.74rem] text-white/36">
                          <MapPin className="h-2.5 w-2.5" strokeWidth={1.8} />
                          {req.distance}
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-4 border-t border-white/[0.06] pt-4">
                      <button
                        type="button"
                        disabled={isStartingNegotiation}
                        onClick={() =>
                          startOrOpenConversation({
                            targetUserId: req.otherUserId,
                            targetUser: {
                              displayName: req.name,
                              avatarInitials: req.initials || getInitials(req.name),
                              avatarColor: req.avatarColor,
                            },
                            sourceType: "request",
                            sourceId: req.id || req.tradeId,
                            requestId: req.id || req.tradeId,
                            sourceTitle: req.lookingFor || req.item || "Relay Request",
                            lookingFor: req.lookingFor || req.item || "Relay Request",
                          })
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-[0.9rem] border border-white/[0.08] bg-white/[0.04] py-2 text-[0.8rem] font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
                        {isStartingNegotiation ? "Starting negotiation..." : "Negotiate"}
                      </button>
                    </div>
                  </GlassCard>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* ── Recent Activity ── */}
        <section ref={activityRef} aria-labelledby="activity-title">
          <motion.div
            variants={reveal(shouldReduceMotion, 0)}
            initial="hidden"
            animate={activityInView ? "visible" : "hidden"}
            className="mb-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
              Recent Activity
            </p>
            <h2
              id="activity-title"
              className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white"
            >
              Your latest updates.
            </h2>
          </motion.div>

          <motion.div
            variants={reveal(shouldReduceMotion, 0.08)}
            initial="hidden"
            animate={activityInView ? "visible" : "hidden"}
          >
            <GlassCard className="px-6 py-6 sm:px-8">
              <div className="relative space-y-0">
                {dashboardActivity.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="relative flex gap-5">
                      {/* Timeline line */}
                      {i < dashboardActivity.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="absolute left-[1.1rem] top-9 h-[calc(100%-1rem)] w-px bg-white/[0.07]"
                        />
                      )}

                      {/* Dot */}
                      <div className="relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_6px_16px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.07)]">
                        <Icon className={`h-[0.95rem] w-[0.95rem] ${item.iconClass}`} strokeWidth={1.8} />
                      </div>

                      <div className={`min-w-0 flex-1 ${i < dashboardActivity.length - 1 ? "pb-6" : ""}`}>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[0.92rem] font-semibold tracking-[-0.01em] text-white/90">
                            {item.title}
                          </p>
                          <span className="shrink-0 text-[0.74rem] text-white/36">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[0.82rem] leading-[1.55] text-white/52">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* ── Leaderboard & Analytics ── */}
        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Community Leaderboard */}
          <motion.div
            variants={reveal(shouldReduceMotion, 0.12)}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-4">
              <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                <Award className="h-4 w-4 text-[#ffc75b]" /> Community Leaderboard
              </span>
              <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                Top barter leaders.
              </h2>
            </div>
            
            <GlassCard className="p-6 bg-[linear-gradient(180deg,rgba(14,22,36,0.78),rgba(5,10,18,0.72))] border border-white/[0.09] shadow-2xl backdrop-blur-2xl">
              <div className="divide-y divide-white/[0.06] space-y-3.5">
                {[
                  { rank: 1, name: "Priya M.", initials: "PM", color: "bg-[#8dcde4]/20 text-[#8dcde4]", score: "1,240 pts", trades: "24 trades", badge: "Legend", rate: "100%", otherUserId: "demo-user-0" },
                  { rank: 2, name: "Meera S.", initials: "MS", color: "bg-[#ffc75b]/16 text-[#ffc75b]", score: "980 pts", trades: "18 trades", badge: "Expert", rate: "98%", otherUserId: "demo-user-4" },
                  { rank: 3, name: "Rahul D.", initials: "RD", color: "bg-[#ff9f71]/16 text-[#ff9f71]", score: "820 pts", trades: "15 trades", badge: "Gold", rate: "95%", otherUserId: "demo-user-3" },
                  { rank: 4, name: "Kiran K.", initials: "KK", color: "bg-[#88c4ff]/16 text-[#88c4ff]", score: "670 pts", trades: "11 trades", badge: "Silver", rate: "96%", otherUserId: "demo-user-6" }
                ].map((user, idx) => (
                  <div key={user.rank} className={`flex items-center justify-between pt-3.5 ${idx === 0 ? "pt-0" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white/44 w-4">
                        #{user.rank}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (user.otherUserId) {
                            navigate(`/profile/${user.otherUserId}`);
                          }
                        }}
                        className="transition-opacity hover:opacity-80 outline-none"
                      >
                        <Avatar
                          item={{
                            name: user.name,
                            initials: user.initials,
                            color: user.color,
                          }}
                          size="h-9 w-9 text-[0.8rem]"
                        />
                      </button>
                      <div>
                        <h4 className="text-[0.92rem] font-semibold text-white/90 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (user.otherUserId) {
                                navigate(`/profile/${user.otherUserId}`);
                              }
                            }}
                            className="hover:text-[#8dcde4] transition-colors text-left outline-none font-semibold text-[0.92rem]"
                          >
                            {user.name}
                          </button>
                          <span className={`text-[0.62rem] font-bold px-1.5 py-0.5 rounded-md ${
                            idx === 0 ? "bg-[#ff9f71]/12 text-[#ff9f71]" : "bg-white/6 text-white/54"
                          }`}>
                            {user.badge}
                          </span>
                        </h4>
                        <p className="text-[0.74rem] text-white/36 mt-0.5">
                          {user.trades} · Success: {user.rate}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#8dcde4]">
                      {user.score}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Trade Activity Chart */}
          <motion.div
            variants={reveal(shouldReduceMotion, 0.16)}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-4">
              <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                <BarChart3 className="h-4 w-4 text-[#8dcde4]" /> Transaction Analytics
              </span>
              <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                Monthly activity.
              </h2>
            </div>

            <GlassCard className="p-6 flex flex-col justify-between h-[282px] bg-[linear-gradient(180deg,rgba(14,22,36,0.78),rgba(5,10,18,0.72))] border border-white/[0.09] shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between text-xs text-white/44 mb-4">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> +14% Activity increase
                </span>
                <span>Vizag Area</span>
              </div>

              {/* Dynamic SVG Line/Area Chart */}
              <div className="relative flex-grow w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8dcde4" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#8dcde4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                  {/* Gradient Area Fill */}
                  <path
                    d="M0,45 L15,35 L35,40 L55,20 L75,25 L100,5 L100,50 L0,50 Z"
                    fill="url(#chart-area-grad)"
                  />
                  
                  {/* Stroke Line */}
                  <path
                    d="M0,45 L15,35 L35,40 L55,20 L75,25 L100,5"
                    fill="none"
                    stroke="#8dcde4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Dots representing weekly peaks */}
                  <circle cx="15" cy="35" r="1.5" fill="#8dcde4" stroke="#050912" strokeWidth="0.5" />
                  <circle cx="35" cy="40" r="1.5" fill="#8dcde4" stroke="#050912" strokeWidth="0.5" />
                  <circle cx="55" cy="20" r="1.5" fill="#ffc75b" stroke="#050912" strokeWidth="0.5" />
                  <circle cx="75" cy="25" r="1.5" fill="#8dcde4" stroke="#050912" strokeWidth="0.5" />
                  <circle cx="100" cy="5" r="2" fill="#8dcde4" stroke="#ffffff" strokeWidth="0.8" />
                </svg>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[0.68rem] text-white/34 mt-4 border-t border-white/[0.06] pt-3.5">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4 (Now)</span>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
