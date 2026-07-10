import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import Avatar from "./ui/Avatar";
import TraderListingCard from "./ui/TraderListingCard";
import {
  experienceOptions,
  feedbackTags,
  resolveTraderId,
  tradeAgainOptions,
} from "../data/traderProfiles";
import { TRADE_OUTCOME } from "../data/tradeStatusConfig";
import { useRelay } from "../context/RelayContext";

const easing = [0.22, 1, 0.36, 1];

const achievementIcons = {
  ShieldCheck,
  Award,
  Zap,
  Trophy,
  Users,
  Star,
};

function StatCard({ label, value, icon: Icon, color, glow }) {
  return (
    <div className="relative overflow-hidden rounded-[1rem] border border-white/[0.07] bg-white/[0.035] px-3 py-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] rounded-[inherit]"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, transparent 72%)` }}
      />
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={1.8} />
      </div>
      <p className="relative mt-2 font-serif text-[1.15rem] leading-none tracking-[-0.03em] text-white">
        {value}
      </p>
      <p className="relative mt-1 text-[0.68rem] leading-4 text-white/48">{label}</p>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-3 py-3">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-[0.68rem] font-semibold ${review.reviewerColor}`}
        >
          {review.reviewerInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.84rem] font-semibold text-white/86">{review.reviewerName}</p>
            <span className="shrink-0 text-[0.7rem] tracking-[0.08em] text-[#ffc75b]">{review.stars}</span>
          </div>
          <p className="mt-1 text-[0.72rem] text-white/40">
            {review.resource} · {review.tradeDate}
          </p>
          <p className="mt-2 text-[0.82rem] leading-5 text-white/54">"{review.text}"</p>
        </div>
      </div>
    </div>
  );
}

const emptyFeedback = {
  starRating: 0,
  experience: "",
  title: "",
  description: "",
  tradeAgain: "",
  tags: [],
};

export default function TraderProfileDrawer() {
  const shouldReduceMotion = useReducedMotion();
  const {
    traderProfileDrawer,
    traderProfiles,
    closeTraderProfileDrawer,
    submitTraderFeedback,
  } = useRelay();
  const [feedback, setFeedback] = useState(emptyFeedback);
  const [showSuccess, setShowSuccess] = useState(false);

  const traderId = resolveTraderId({
    traderId: traderProfileDrawer.traderId,
    conversationId: traderProfileDrawer.conversationId,
    name: traderProfileDrawer.name,
  });
  const trader = traderId ? traderProfiles[traderId] : null;
  const canLeaveFeedback = traderProfileDrawer.tradeOutcome === TRADE_OUTCOME.COMPLETED;

  const statCards = useMemo(() => {
    if (!trader) {
      return [];
    }

    return [
      { label: "Completed Exchanges", value: String(trader.stats.completedExchanges), icon: CheckCircle, color: "#c4e0a8", glow: "rgba(196,224,168,0.11)" },
      { label: "Success Rate", value: trader.stats.successRate, icon: Trophy, color: "#ffc75b", glow: "rgba(255,199,91,0.11)" },
      { label: "Average Response Time", value: trader.stats.avgResponseTime, icon: Clock, color: "#8dcde4", glow: "rgba(141,205,228,0.13)" },
      { label: "Avg. Negotiation Duration", value: trader.stats.avgNegotiationDuration, icon: CalendarDays, color: "#bb93ff", glow: "rgba(187,147,255,0.11)" },
      { label: "Trades This Month", value: String(trader.stats.tradesThisMonth), icon: Zap, color: "#c4e0a8", glow: "rgba(196,224,168,0.09)" },
      { label: "Repeat Trading Partners", value: String(trader.stats.repeatTradingPartners), icon: Users, color: "#8dcde4", glow: "rgba(141,205,228,0.11)" },
      { label: "Cancellation Rate", value: trader.stats.cancellationRate, icon: X, color: "#c89898", glow: "rgba(200,130,130,0.09)" },
      { label: "Community Trust Score", value: String(trader.stats.communityTrustScore), icon: ShieldCheck, color: "#bb93ff", glow: "rgba(187,147,255,0.11)" },
    ];
  }, [trader]);

  function resetFeedback() {
    setFeedback(emptyFeedback);
    setShowSuccess(false);
  }

  function handleClose() {
    resetFeedback();
    closeTraderProfileDrawer();
  }

  function toggleTag(tag) {
    setFeedback((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  }

  function handleSubmit() {
    if (!trader || !canLeaveFeedback || feedback.starRating < 1) {
      return;
    }

    submitTraderFeedback(trader.id, {
      ...feedback,
      resource: traderProfileDrawer.tradeResource || "Recent Exchange",
      tradeDate: traderProfileDrawer.tradeDate || "Today",
    });
    setFeedback(emptyFeedback);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 2800);
  }

  return (
    <AnimatePresence>
      {traderProfileDrawer.open && trader ? (
        <>
          <motion.button
            type="button"
            aria-label="Close trader profile drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[85] bg-black/40 backdrop-blur-[3px]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: easing }}
            className="fixed right-0 top-0 z-[90] flex h-dvh w-full max-w-[32rem] flex-col border-l border-white/[0.09] bg-[linear-gradient(180deg,rgba(10,18,30,0.97),rgba(4,10,18,0.95))] text-white shadow-[0_28px_90px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[28px]"
          >
            <div className="sticky top-0 z-[2] border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(10,18,30,0.98),rgba(8,14,24,0.94))] px-5 py-5 backdrop-blur-[18px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[8%] top-[1px] h-24 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_42%,transparent_100%)]"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="relative">
                    <Avatar item={trader} size="h-16 w-16 text-lg" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/14 bg-[#8dcde4] text-[#010204]">
                      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-serif text-[1.35rem] leading-none tracking-[-0.03em] text-white">
                        {trader.name}
                      </h2>
                      <span className="rounded-full bg-[rgba(196,224,168,0.12)] px-2 py-0.5 text-[0.62rem] font-semibold text-[#c4e0a8]">
                        AI Verified Trader
                      </span>
                    </div>
                    <p className="mt-2 text-[0.78rem] text-[#c4e0a8]">
                      {trader.onlineStatus === "Online"
                        ? "Online"
                        : `${trader.onlineStatus}${trader.lastSeen ? ` · Last seen ${trader.lastSeen}` : ""}`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.74rem] text-white/44">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" strokeWidth={1.8} />
                        Member since {trader.memberSince}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" strokeWidth={1.8} />
                        {trader.location}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[0.72rem]">
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-white/52">
                        {trader.distance} away
                      </span>
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-white/52">
                        Responds in {trader.responseTime}
                      </span>
                      <span className="rounded-full border border-[rgba(255,199,91,0.16)] bg-[rgba(255,199,91,0.08)] px-2 py-0.5 text-[#ffc75b]">
                        {trader.communityRating} · {trader.reviewCount} reviews
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[0.72rem]">
                      <span className="rounded-full border border-[rgba(196,224,168,0.16)] bg-[rgba(196,224,168,0.08)] px-2 py-0.5 text-[#c4e0a8]">
                        {trader.successfulExchanges} successful exchanges
                      </span>
                      <span className="rounded-full border border-[rgba(141,205,228,0.16)] bg-[rgba(141,205,228,0.08)] px-2 py-0.5 text-[#8dcde4]">
                        Reliability {trader.reliabilityScore}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close drawer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/46 transition-colors hover:bg-white/[0.07] hover:text-white/86"
                >
                  <X className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <section className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Exchange Performance
                </p>
                <h3 className="mt-1 font-serif text-[1.25rem] tracking-[-0.03em] text-white">
                  Trading reputation at a glance.
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {statCards.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                  ))}
                </div>
              </section>

              <section className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Current Listings
                </p>
                <h3 className="mt-1 font-serif text-[1.25rem] tracking-[-0.03em] text-white">
                  Active resources listed by {trader.name.split(" ")[0]}.
                </h3>
                <div className="mt-4 space-y-3">
                  {trader.listings.map((listing) => (
                    <TraderListingCard
                      key={listing.tradeId}
                      listing={listing}
                      onNavigate={handleClose}
                    />
                  ))}
                </div>
              </section>

              <section className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Achievements
                </p>
                <h3 className="mt-1 font-serif text-[1.25rem] tracking-[-0.03em] text-white">
                  Community trust signals.
                </h3>
                <div className="mt-4 grid gap-2">
                  {trader.achievements.map((achievement) => {
                    const Icon = achievementIcons[achievement.icon] || Award;
                    return (
                      <div
                        key={achievement.label}
                        className="flex items-center gap-3 rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-3 py-3"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                          <Icon className={`h-4 w-4 ${achievement.color}`} strokeWidth={1.8} />
                        </span>
                        <span className="text-[0.84rem] font-medium text-white/74">{achievement.label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Reviews
                </p>
                <h3 className="mt-1 font-serif text-[1.25rem] tracking-[-0.03em] text-white">
                  {trader.reviewCount} community reviews · {trader.communityRating} average
                </h3>
                <div className="mt-4 max-h-[22rem] space-y-3 overflow-y-auto pr-1">
                  {trader.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>

              <section className="mb-24 rounded-[1.2rem] border border-white/[0.08] bg-white/[0.03] px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Leave Feedback
                </p>
                <h3 className="mt-1 font-serif text-[1.25rem] tracking-[-0.03em] text-white">
                  Help the Relay community
                </h3>
                <p className="mt-2 text-[0.82rem] leading-5 text-white/48">
                  Help the Relay community by sharing your experience after trading.
                </p>

                <AnimatePresence>
                  {showSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-[1rem] border border-[rgba(196,224,168,0.18)] bg-[rgba(196,224,168,0.08)] px-4 py-4 text-center"
                    >
                      <CheckCircle className="mx-auto h-6 w-6 text-[#c4e0a8]" strokeWidth={1.8} />
                      <p className="mt-3 text-[0.9rem] font-medium text-[#dff3c6]">
                        Thank you for helping build a trusted Relay community.
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {!canLeaveFeedback ? (
                  <p className="mt-4 rounded-[1rem] border border-white/[0.07] bg-white/[0.025] px-3 py-3 text-[0.82rem] text-white/46">
                    You can leave feedback after a completed exchange.
                  </p>
                ) : (
                  <div className={`mt-4 space-y-4 ${showSuccess ? "pointer-events-none opacity-40" : ""}`}>
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">
                        Star Rating
                      </p>
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedback((current) => ({ ...current, starRating: star }))}
                            className="text-[1.35rem] leading-none transition-transform hover:scale-110"
                          >
                            <span className={star <= feedback.starRating ? "text-[#ffc75b]" : "text-white/22"}>
                              {star <= feedback.starRating ? "★" : "☆"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="block">
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">
                        Trade Experience
                      </span>
                      <select
                        value={feedback.experience}
                        onChange={(event) =>
                          setFeedback((current) => ({ ...current, experience: event.target.value }))
                        }
                        className="mt-2 w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.88rem] text-white outline-none transition-all focus:border-white/20 focus:bg-white/[0.06]"
                      >
                        <option value="" className="bg-[#0a121e]">
                          Select experience
                        </option>
                        {experienceOptions.map((option) => (
                          <option key={option} value={option} className="bg-[#0a121e]">
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">
                        Review Title
                      </span>
                      <input
                        type="text"
                        value={feedback.title}
                        onChange={(event) =>
                          setFeedback((current) => ({ ...current, title: event.target.value }))
                        }
                        placeholder="Summarize your exchange"
                        className="mt-2 w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.88rem] text-white outline-none placeholder-white/30 transition-all focus:border-white/20 focus:bg-white/[0.06]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">
                        Review Description
                      </span>
                      <textarea
                        value={feedback.description}
                        onChange={(event) =>
                          setFeedback((current) => ({ ...current, description: event.target.value }))
                        }
                        rows={4}
                        placeholder="Share details about the exchange experience"
                        className="mt-2 w-full resize-none rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.88rem] text-white outline-none placeholder-white/30 transition-all focus:border-white/20 focus:bg-white/[0.06]"
                      />
                    </label>

                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">
                        Would You Trade Again?
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tradeAgainOptions.map((option) => {
                          const active = feedback.tradeAgain === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setFeedback((current) => ({ ...current, tradeAgain: option }))}
                              className={`rounded-full border px-3 py-1.5 text-[0.76rem] font-medium transition-colors ${
                                active
                                  ? "border-[rgba(141,205,228,0.2)] bg-[rgba(141,205,228,0.1)] text-[#8dcde4]"
                                  : "border-white/[0.08] bg-white/[0.04] text-white/52 hover:bg-white/[0.07]"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">
                        Quick Tags
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {feedbackTags.map((tag) => {
                          const active = feedback.tags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`rounded-full border px-3 py-1.5 text-[0.72rem] font-medium transition-colors ${
                                active
                                  ? "border-[rgba(255,199,91,0.2)] bg-[rgba(255,199,91,0.1)] text-[#ffc75b]"
                                  : "border-white/[0.08] bg-white/[0.04] text-white/48 hover:bg-white/[0.07]"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {canLeaveFeedback && !showSuccess ? (
              <div className="sticky bottom-0 z-[2] border-t border-white/[0.06] bg-[linear-gradient(180deg,rgba(8,14,24,0.92),rgba(6,10,18,0.98))] px-5 py-4 backdrop-blur-[18px]">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={feedback.starRating < 1 || !feedback.description.trim()}
                  className="w-full rounded-full border border-white/12 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-5 py-3.5 text-[0.9rem] font-semibold text-[#081a22] shadow-[0_12px_28px_rgba(112,152,174,0.24)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  Submit Feedback
                </button>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
