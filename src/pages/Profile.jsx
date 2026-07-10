import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle,
  Clock,
  Gift,
  MapPin,
  MessageCircle,
  Settings,
  ShieldCheck,
  Star,
  TicketPercent,
  Trophy,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/ui/GlassCard";
import TradeStatusChip from "../components/trade/TradeStatusChip";
import TradeTimeline from "../components/trade/TradeTimeline";
import TradeSummaryRow from "../components/trade/TradeSummaryRow";
import { TRADE_OUTCOME } from "../data/tradeStatusConfig";
import { useRelay } from "../context/RelayContext";
import { reveal } from "../utils/motion";
import { getInitials } from "../utils/initials";

const iconByCategory = {
  Books: BookOpen,
  Coupons: TicketPercent,
  "Gift Cards": Gift,
  Tools: Wrench,
  More: Zap,
};

const iconClassByCategory = {
  Books: "text-[#8dcde4]",
  Coupons: "text-[#ffc75b]",
  "Gift Cards": "text-[#ff9f71]",
  Tools: "text-[#88c4ff]",
  More: "text-[#bb93ff]",
};

const achievements = [
  { label: "Verified Trader", icon: ShieldCheck, color: "text-[#8dcde4]" },
  { label: "Trusted Member", icon: Award, color: "text-[#ffc75b]" },
  { label: "Fast Responder", icon: Zap, color: "text-[#c4e0a8]" },
  { label: "100 Successful Trades", icon: Trophy, color: "text-[#ff9f71]" },
  { label: "Community Favourite", icon: Users, color: "text-[#bb93ff]" },
];


function TradeSectionCard({ trade, showTimeline = false }) {
  return (
    <div className="rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.92rem] font-semibold tracking-[-0.01em] text-white/90">
            {trade.offering} ↔ {trade.lookingFor}
          </p>
          <p className="mt-1 text-[0.78rem] text-white/42">
            with {trade.name}
            {trade.completed ? ` · ${trade.completed}` : ""}
            {trade.declinedDate ? ` · ${trade.declinedDate}` : ""}
            {trade.progress ? ` · ${trade.progress}` : ""}
          </p>
          <div className="mt-2">
            <TradeStatusChip outcome={trade.outcome || TRADE_OUTCOME.NEGOTIATION_ACTIVE} compact />
          </div>
        </div>
        {trade.rating ? (
          <span className="text-[0.84rem] tracking-[0.08em] text-[#ffc75b]">{trade.rating}</span>
        ) : null}
      </div>
      {showTimeline && trade.outcome ? (
        <div className="mt-4">
          <TradeTimeline outcome={trade.outcome} compact />
        </div>
      ) : null}
    </div>
  );
}

export default function Profile() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const {
    completedTrades: sharedCompletedTrades,
    currentUserProfile,
    myListings,
    ongoingTrades,
    mockConversations,
    declinedTrades,
  } = useRelay();

  const profileStats = [
    { label: "Completion Rate", value: currentUserProfile.successRate, icon: CheckCircle, color: "#c4e0a8", glow: "rgba(196,224,168,0.11)" },
    { label: "Average Response Time", value: currentUserProfile.responseTime, icon: Clock, color: "#8dcde4", glow: "rgba(141,205,228,0.13)" },
    { label: "Community Rating", value: "4.9", icon: Star, color: "#bb93ff", glow: "rgba(187,147,255,0.11)" },
    { label: "Successful Exchanges", value: String(currentUserProfile.successfulTrades), icon: Trophy, color: "#ffc75b", glow: "rgba(255,199,91,0.11)" },
  ];

  const listingCards = myListings.slice(0, 3).map((listing) => ({
    icon: iconByCategory[listing.category] || Zap,
    iconClass: iconClassByCategory[listing.category] || "text-[#bb93ff]",
    title: listing.title,
    detail: `Looking for ${listing.lookingFor}`,
    value: listing.value,
    status: listing.detailValue,
  }));

  const completedList = sharedCompletedTrades.map((trade) => ({
    ...trade,
    outcome: TRADE_OUTCOME.COMPLETED,
  }));

  const ongoingList = ongoingTrades.map((trade) => ({
    ...trade,
    outcome: TRADE_OUTCOME.NEGOTIATION_ACTIVE,
  }));

  const recentConversations = mockConversations.filter((c) => !c.archived).slice(0, 3);
  const reviewCards = sharedCompletedTrades.slice(0, 3).map((trade) => ({
    name: trade.name,
    rating: trade.rating,
    text: trade.feedback,
  }));

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.06)_0%,transparent_50%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <motion.section {...reveal(shouldReduceMotion, 0)} className="mb-8">
          <GlassCard className="px-5 py-6 sm:px-7 sm:py-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[56%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(141,205,228,0.14)_0%,transparent_74%)]"
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.8rem] border border-white/12 bg-[rgba(141,205,228,0.16)] text-3xl font-semibold text-[#8dcde4] shadow-[0_18px_48px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  {currentUserProfile.avatarInitials || getInitials(currentUserProfile.name)}
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-[#8dcde4] text-[#010204]">
                    <ShieldCheck className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                      Verified Trader
                    </p>
                    <span className="rounded-full bg-[rgba(196,224,168,0.12)] px-2.5 py-0.5 text-[0.72rem] font-semibold text-[#c4e0a8]">
                      Trust Score {currentUserProfile.trustScore}
                    </span>
                  </div>
                  <h1 className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white">
                    {currentUserProfile.name}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-3 text-[0.86rem] text-white/52">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {currentUserProfile.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Member since {currentUserProfile.memberSince}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/settings")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[0.84rem] font-medium text-white/66 transition-colors hover:bg-white/[0.07] hover:text-white/90"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/settings")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[0.84rem] font-medium text-white/66 transition-colors hover:bg-white/[0.07] hover:text-white/90"
                >
                  <Settings className="h-4 w-4" strokeWidth={1.8} />
                  Settings
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section {...reveal(shouldReduceMotion, 0.08)} className="mb-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
              Trade Statistics
            </p>
            <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
              Your exchange performance.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {profileStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={stat.label} className="px-5 py-5">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-[55%] rounded-[inherit]"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${stat.glow} 0%, transparent 72%)` }}
                  />
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_6px_16px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Icon className="h-[1rem] w-[1rem]" style={{ color: stat.color }} strokeWidth={1.8} />
                  </div>
                  <p className="relative mt-4 font-serif text-[2rem] leading-none tracking-[-0.04em] text-white">
                    {stat.value}
                  </p>
                  <p className="relative mt-1.5 text-[0.8rem] text-white/52">{stat.label}</p>
                </GlassCard>
              );
            })}
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <motion.section {...reveal(shouldReduceMotion, 0.12)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Current Listings
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Active verified exchanges.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {listingCards.map((listing) => {
                  const Icon = listing.icon;
                  return (
                    <GlassCard key={listing.title} className="px-5 py-5 transition-transform duration-300 hover:-translate-y-1">
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                        <Icon className={`h-[1.05rem] w-[1.05rem] ${listing.iconClass}`} />
                      </div>
                      <p className="relative mt-4 text-[0.95rem] font-semibold tracking-[-0.02em] text-white/94">
                        {listing.title}
                      </p>
                      <p className="relative mt-1 text-[0.78rem] leading-5 text-white/48">{listing.detail}</p>
                      <div className="relative mt-4 border-t border-white/[0.06] pt-4">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/30">
                          Estimated Exchange Value
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className="font-serif text-[1.05rem] text-white/86">{listing.value}</span>
                          <span className="text-[0.7rem] font-medium text-[#8dcde4]">{listing.status}</span>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </motion.section>

            <motion.section {...reveal(shouldReduceMotion, 0.14)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Completed Exchanges
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Successful handoffs.
                </h2>
              </div>
              <GlassCard className="px-5 py-5">
                <div className="relative space-y-3">
                  {completedList.map((trade) => (
                    <TradeSectionCard key={trade.id || trade.title} trade={trade} />
                  ))}
                </div>
              </GlassCard>
            </motion.section>

            <motion.section {...reveal(shouldReduceMotion, 0.16)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Ongoing Negotiations
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Active exchanges.
                </h2>
              </div>
              <GlassCard className="px-5 py-5">
                <div className="relative space-y-3">
                  {ongoingList.map((trade) => (
                    <TradeSectionCard key={trade.id} trade={trade} showTimeline />
                  ))}
                </div>
              </GlassCard>
            </motion.section>

            <motion.section {...reveal(shouldReduceMotion, 0.18)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Declined Trades
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Closed without exchange.
                </h2>
              </div>
              <GlassCard className="px-5 py-5">
                <div className="relative space-y-3">
                  {declinedTrades.map((trade) => (
                    <TradeSectionCard key={trade.id} trade={trade} showTimeline />
                  ))}
                </div>
              </GlassCard>
            </motion.section>
          </div>

          <div className="space-y-8">
            <motion.section {...reveal(shouldReduceMotion, 0.18)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Recent Conversations
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Your negotiation threads.
                </h2>
              </div>
              <GlassCard className="px-4 py-4">
                <div className="space-y-2">
                  {recentConversations.map((conversation) => (
                    <TradeSummaryRow
                      key={conversation.id}
                      trade={conversation}
                      onClick={() => navigate(`/messages?conversation=${conversation.id}`)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/messages")}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-[0.8rem] font-medium text-white/58 transition-colors hover:bg-white/[0.07] hover:text-white/86"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                  Open Messages
                </button>
              </GlassCard>
            </motion.section>

            <motion.section {...reveal(shouldReduceMotion, 0.2)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Achievements
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Trusted by Relay.
                </h2>
              </div>
              <GlassCard className="px-5 py-5">
                <div className="relative grid gap-3">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={achievement.label} className="flex items-center gap-3 rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-3 py-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                          <Icon className={`h-4 w-4 ${achievement.color}`} strokeWidth={1.8} />
                        </span>
                        <span className="text-[0.86rem] font-medium text-white/74">{achievement.label}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.section>

            <motion.section {...reveal(shouldReduceMotion, 0.22)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Reviews
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Recent ratings.
                </h2>
              </div>
              <GlassCard className="px-5 py-5">
                <div className="relative space-y-4">
                  {reviewCards.map((review) => (
                    <div key={review.name} className="rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-3 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[0.86rem] font-semibold text-white/86">{review.name}</p>
                        <span className="text-[0.72rem] tracking-[0.08em] text-[#ffc75b]">{review.rating}</span>
                      </div>
                      <p className="mt-2 text-[0.82rem] leading-5 text-white/52">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}
