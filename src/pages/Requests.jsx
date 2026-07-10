import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useRelay } from "../context/RelayContext";
import { tradePath } from "../routes/paths";
import Avatar from "../components/ui/Avatar";
import { getInitials } from "../utils/initials";

const easing = [0.22, 1, 0.36, 1];

const tabs = ["Incoming", "Outgoing", "Ongoing", "Completed", "Declined"];

function reveal(shouldReduceMotion, delay = 0) {
  return {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.65, delay, ease: easing },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.2 },
    },
  };
}

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



function TradePair({ offering, lookingFor }) {
  return (
    <div className="relative mt-4 grid gap-2 rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-3 py-3 sm:grid-cols-2">
      <div>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
          Offering
        </p>
        <p className="mt-0.5 truncate text-[0.82rem] font-medium text-white/78">
          {offering}
        </p>
      </div>
      <div className="border-t border-white/[0.06] pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
          Looking For
        </p>
        <p className="mt-0.5 truncate text-[0.82rem] font-medium text-white/78">
          {lookingFor}
        </p>
      </div>
    </div>
  );
}

function IncomingCard({ onAccept, onDecline, onNegotiate, request, index, shouldReduceMotion }) {
  const navigate = useNavigate();
  return (
    <motion.article {...reveal(shouldReduceMotion, index * 0.04)}>
      <GlassCard className="px-5 py-5 transition-transform duration-300 hover:-translate-y-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[50%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(141,205,228,0.12)_0%,transparent_72%)]"
        />
        <div className="relative flex items-start gap-4">
          <button
            type="button"
            onClick={() => {
              if (request.otherUserId || request.userId) {
                navigate(`/profile/${request.otherUserId || request.userId}`);
              }
            }}
            className="transition-opacity hover:opacity-80 outline-none"
          >
            <Avatar
              item={{
                name: request.name,
                initials: request.initials,
                color: request.color,
                avatarUrl: request.avatarUrl,
              }}
            />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (request.otherUserId || request.userId) {
                    navigate(`/profile/${request.otherUserId || request.userId}`);
                  }
                }}
                className="text-[0.98rem] font-semibold tracking-[-0.02em] text-white/94 hover:text-[#8dcde4] transition-colors text-left outline-none"
              >
                {request.name}
              </button>
              <span className="flex items-center gap-1 rounded-full bg-[rgba(141,205,228,0.1)] px-2 py-0.5 text-[0.65rem] font-semibold text-[#8dcde4]">
                <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2} />
                Verified
              </span>
              <span className="rounded-full bg-[rgba(196,224,168,0.12)] px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#c4e0a8]">
                {request.match}% match
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.74rem] text-white/40">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" strokeWidth={1.8} />
                {request.distance}
              </span>
              <span className="text-white/20">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" strokeWidth={1.8} />
                {request.time}
              </span>
            </div>
          </div>
        </div>

        <TradePair offering={request.offering} lookingFor={request.lookingFor} />

        <p className="relative mt-4 rounded-[1rem] bg-white/[0.035] px-3 py-3 text-[0.82rem] leading-5 text-white/54">
          {request.message}
        </p>

        <div className="relative mt-4 grid gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-[1fr_1fr_auto]">
          <button
            type="button"
            onClick={() => onAccept(request)}
            className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-white/12 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-4 py-2.5 text-[0.8rem] font-semibold text-[#081a22] shadow-[0_10px_26px_rgba(112,152,174,0.18),inset_0_1px_0_rgba(255,255,255,0.42)]"
          >
            <CheckCircle className="h-3.5 w-3.5" strokeWidth={2.2} />
            Accept Trade
          </button>
          <button
            type="button"
            onClick={() => onNegotiate(request)}
            className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-[0.8rem] font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white/90"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            Negotiate
          </button>
          <button
            type="button"
            onClick={() => onDecline(request)}
            className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[0.8rem] font-medium text-white/42 transition-colors hover:bg-white/[0.06] hover:text-white/72"
          >
            <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            Decline
          </button>
        </div>
      </GlassCard>
    </motion.article>
  );
}

function OutgoingCard({ onCancel, onNegotiate, request, index, shouldReduceMotion }) {
  const navigate = useNavigate();
  return (
    <motion.article {...reveal(shouldReduceMotion, index * 0.05)}>
      <GlassCard className="px-5 py-5">
        <div className="relative flex items-start gap-4">
          <button
            type="button"
            onClick={() => {
              if (request.otherUserId || request.userId) {
                navigate(`/profile/${request.otherUserId || request.userId}`);
              }
            }}
            className="transition-opacity hover:opacity-80 outline-none"
          >
            <Avatar
              item={{
                name: request.name,
                initials: request.initials,
                color: request.color,
                avatarUrl: request.avatarUrl,
              }}
            />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (request.otherUserId || request.userId) {
                    navigate(`/profile/${request.otherUserId || request.userId}`);
                  }
                }}
                className="text-[0.98rem] font-semibold tracking-[-0.02em] text-white/94 hover:text-[#8dcde4] transition-colors text-left outline-none"
              >
                {request.name}
              </button>
              <span className="flex items-center gap-1 rounded-full bg-[rgba(141,205,228,0.1)] px-2 py-0.5 text-[0.65rem] font-semibold text-[#8dcde4]">
                <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2} />
                Verified
              </span>
            </div>
            <p className="mt-1 text-[0.78rem] text-white/42">
              {request.status} · {request.time}
            </p>
          </div>
        </div>

        <TradePair offering={request.offering} lookingFor={request.lookingFor} />

        <div className="relative mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 text-[0.76rem] text-white/42">
            <MapPin className="h-3 w-3" strokeWidth={1.8} />
            {request.distance}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onNegotiate(request)}
              className="rounded-[0.9rem] border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[0.78rem] font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white/90"
            >
              Continue Negotiation
            </button>
            <button
              type="button"
              onClick={() => onCancel(request)}
              className="rounded-[0.9rem] border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[0.78rem] font-medium text-white/42 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              Cancel Request
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
}

function OngoingCard({ onComplete, onNegotiate, onViewTrade, request, index, shouldReduceMotion }) {
  const navigate = useNavigate();
  return (
    <motion.article {...reveal(shouldReduceMotion, index * 0.05)}>
      <GlassCard className="px-5 py-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[46%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(141,205,228,0.11)_0%,transparent_74%)]"
        />
        <div className="relative flex items-start gap-4">
          <button
            type="button"
            onClick={() => {
              if (request.otherUserId || request.userId) {
                navigate(`/profile/${request.otherUserId || request.userId}`);
              }
            }}
            className="transition-opacity hover:opacity-80 outline-none"
          >
            <Avatar
              item={{
                name: request.name,
                initials: request.initials,
                color: request.color,
                avatarUrl: request.avatarUrl,
              }}
            />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (request.otherUserId || request.userId) {
                    navigate(`/profile/${request.otherUserId || request.userId}`);
                  }
                }}
                className="text-[0.98rem] font-semibold tracking-[-0.02em] text-white/94 hover:text-[#8dcde4] transition-colors text-left outline-none"
              >
                {request.name}
              </button>
              <span className="rounded-full bg-[rgba(141,205,228,0.1)] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[#8dcde4]">
                {request.progress}
              </span>
            </div>
            <p className="mt-1 text-[0.78rem] text-white/42">
              {request.time}
            </p>
          </div>
        </div>

        <TradePair offering={request.offering} lookingFor={request.lookingFor} />

        {request.message ? (
          <p className="relative mt-4 rounded-[1rem] bg-white/[0.035] px-3 py-3 text-[0.82rem] leading-5 text-white/54">
            {request.message}
          </p>
        ) : null}

        <div className="relative mt-4 grid gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onNegotiate(request)}
            className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-[0.8rem] font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white/90"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            Continue Negotiation
          </button>
          <button
            type="button"
            onClick={() => onViewTrade(request)}
            className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-[0.8rem] font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white/90"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            View Trade
          </button>
          <button
            type="button"
            onClick={() => onComplete(request)}
            className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-white/12 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-4 py-2.5 text-[0.8rem] font-semibold text-[#081a22] shadow-[0_10px_26px_rgba(112,152,174,0.18),inset_0_1px_0_rgba(255,255,255,0.42)]"
          >
            <CheckCircle className="h-3.5 w-3.5" strokeWidth={2.2} />
            Complete Trade
          </button>
        </div>
      </GlassCard>
    </motion.article>
  );
}

function CompletedCard({ request, index, shouldReduceMotion }) {
  const navigate = useNavigate();
  return (
    <motion.article {...reveal(shouldReduceMotion, index * 0.05)}>
      <GlassCard className="px-5 py-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[46%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,224,168,0.11)_0%,transparent_74%)]"
        />
        <div className="relative flex items-start gap-4">
          <button
            type="button"
            onClick={() => {
              if (request.otherUserId || request.userId) {
                navigate(`/profile/${request.otherUserId || request.userId}`);
              }
            }}
            className="transition-opacity hover:opacity-80 outline-none"
          >
            <Avatar
              item={{
                name: request.name,
                initials: request.initials,
                color: request.color,
                avatarUrl: request.avatarUrl,
              }}
            />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (request.otherUserId || request.userId) {
                    navigate(`/profile/${request.otherUserId || request.userId}`);
                  }
                }}
                className="text-[0.98rem] font-semibold tracking-[-0.02em] text-white/94 hover:text-[#8dcde4] transition-colors text-left outline-none"
              >
                {request.name}
              </button>
              <span className="rounded-full bg-[rgba(196,224,168,0.12)] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[#c4e0a8]">
                Trade success
              </span>
            </div>
            <p className="mt-1 text-[0.78rem] text-white/42">
              Trade completed · {request.completed}
            </p>
          </div>
        </div>

        <TradePair offering={request.offering} lookingFor={request.lookingFor} />

        <div className="relative mt-4 rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-3 py-3">
          <div className="flex items-center gap-2 text-[#ffc75b]">
            <Star className="h-3.5 w-3.5 fill-[#ffc75b]" />
            <span className="text-[0.86rem] tracking-[0.08em]">{request.rating}</span>
          </div>
          <p className="mt-2 text-[0.82rem] leading-5 text-white/56">
            "{request.feedback}"
          </p>
        </div>
      </GlassCard>
    </motion.article>
  );
}

export default function Requests() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const {
    acceptIncomingRequest,
    cancelOutgoingRequest,
    completeOngoingTrade,
    completedTrades: completedTradesState,
    declineIncomingRequest,
    declinedTrades: declinedTradesState,
    incomingRequests: incomingRequestsState,
    ongoingTrades,
    outgoingRequests: outgoingRequestsState,
    startOrOpenConversation,

  } = useRelay();
  const [activeTab, setActiveTab] = useState("Incoming");
  const [decliningRequest, setDecliningRequest] = useState(null);
  const incomingList = incomingRequestsState ?? [];
  const outgoingList = outgoingRequestsState ?? [];
  const completedList = completedTradesState ?? [];
  const declinedList = declinedTradesState ?? [];

  const counts = {
    Incoming: incomingList.length,
    Outgoing: outgoingList.length,
    Ongoing: ongoingTrades.length,
    Completed: completedList.length,
    Declined: declinedList.length,
  };

  function openRequestNegotiation(request) {
    const targetUserId = request.otherUserId || request.userId;
    startOrOpenConversation({
      targetUserId,
      targetUser: {
        displayName: request.name,
        avatarInitials: request.initials || getInitials(request.name),
        avatarColor: request.color,
      },
      sourceType: "request",
      sourceId: request.id || request.tradeId,
      requestId: request.id || request.tradeId,
      sourceTitle: request.lookingFor || "Relay Request",
      lookingFor: request.lookingFor || "Relay Request",
    });
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.06)_0%,transparent_50%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <motion.section {...reveal(shouldReduceMotion, 0)} aria-labelledby="requests-title" className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
            Trade Requests
          </p>
          <h1
            id="requests-title"
            className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white"
          >
            Manage every exchange request.
          </h1>
          <p className="mt-3 max-w-[38rem] text-[1.02rem] leading-[1.7] text-white/60">
            Review verified incoming offers, track outgoing negotiations, and
            celebrate completed trades.
          </p>
        </motion.section>

        <motion.div
          {...reveal(shouldReduceMotion, 0.08)}
          className="mb-6 flex gap-2 overflow-x-auto rounded-[1.2rem] border border-white/[0.08] bg-white/[0.035] p-1.5 backdrop-blur-[18px]"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative flex shrink-0 items-center gap-2 rounded-[0.95rem] px-4 py-2 text-[0.84rem] font-medium transition-all duration-200 ${
                  active ? "text-white" : "text-white/48 hover:text-white/80"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="requests-tab"
                    className="absolute inset-0 rounded-[0.95rem] bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative">{tab}</span>
                <span className="relative rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[0.66rem] text-white/56">
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "Incoming" && (
            <motion.section
              key="incoming"
              {...reveal(shouldReduceMotion, 0)}
              className="grid gap-4 lg:grid-cols-2"
            >
              {incomingList.map((request, index) => (
                <IncomingCard
                  key={request.name}
                  request={request}
                  index={index}
                  onAccept={() => acceptIncomingRequest(request.id)}
                  onDecline={() => setDecliningRequest(request)}
                  onNegotiate={openRequestNegotiation}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </motion.section>
          )}

          {activeTab === "Outgoing" && (
            <motion.section
              key="outgoing"
              {...reveal(shouldReduceMotion, 0)}
              className="grid gap-4 lg:grid-cols-2"
            >
              {outgoingList.map((request, index) => (
                <OutgoingCard
                  key={request.name}
                  request={request}
                  index={index}
                  onCancel={() => cancelOutgoingRequest(request.id)}
                  onNegotiate={openRequestNegotiation}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </motion.section>
          )}

          {activeTab === "Ongoing" && (
            <motion.section
              key="ongoing"
              {...reveal(shouldReduceMotion, 0)}
              className="grid gap-4 lg:grid-cols-2"
            >
              {ongoingTrades.map((request, index) => (
                <OngoingCard
                  key={request.id}
                  request={request}
                  index={index}
                  onComplete={() => completeOngoingTrade(request.id)}
                  onNegotiate={openRequestNegotiation}
                  onViewTrade={() => navigate(tradePath(request.tradeId))}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </motion.section>
          )}

          {activeTab === "Completed" && (
            <motion.section
              key="completed"
              {...reveal(shouldReduceMotion, 0)}
              className="grid gap-4 lg:grid-cols-3"
            >
              {completedList.map((request, index) => (
                <CompletedCard
                  key={request.id || request.name}
                  request={request}
                  index={index}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </motion.section>
          )}

          {activeTab === "Declined" && (
            <motion.section
              key="declined"
              {...reveal(shouldReduceMotion, 0)}
              className="grid gap-4 lg:grid-cols-3"
            >
              {declinedList.map((request, index) => (
                <CompletedCard
                  key={request.id || request.name}
                  request={{
                    ...request,
                    completed: request.declinedDate,
                    rating: "☆☆☆☆☆",
                    feedback: "Declined without exchange.",
                  }}
                  index={index}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        <motion.div {...reveal(shouldReduceMotion, 0.12)} className="mt-8">
          <GlassCard className="px-5 py-5">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#8dcde4] shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <ArrowLeftRight className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[0.95rem] font-semibold tracking-[-0.02em] text-white/90">
                    Verified requests only
                  </p>
                  <p className="mt-1 text-[0.8rem] text-white/46">
                    Relay checks item details before requests reach your queue.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[rgba(196,224,168,0.12)] px-3 py-1 text-[0.72rem] font-semibold text-[#c4e0a8]">
                AI verification active
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </main>

      <AnimatePresence>
        {decliningRequest ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/44 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.24, ease: easing }}
              className="relative w-full max-w-[24rem] overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.94),rgba(5,10,18,0.9))] px-5 py-6 shadow-[0_28px_90px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[28px]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                Decline Trade?
              </p>
              <h2 className="mt-3 font-serif text-[2rem] leading-none tracking-[-0.05em] text-white">
                This action cannot be undone.
              </h2>
              <p className="mt-3 text-[0.9rem] leading-6 text-white/52">
                {decliningRequest.name}'s request will be removed from Incoming.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDecliningRequest(null)}
                  className="rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2.5 text-[0.82rem] font-medium text-white/66 transition-colors hover:bg-white/[0.07] hover:text-white/90"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    declineIncomingRequest(decliningRequest.id);
                    setDecliningRequest(null);
                  }}
                  className="rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2.5 text-[0.82rem] font-medium text-white/66 transition-colors hover:bg-white/[0.07] hover:text-white/90"
                >
                  Decline
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
