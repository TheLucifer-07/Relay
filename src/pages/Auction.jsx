import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Flame,
  Gavel,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/ui/GlassCard";
import { useRelay } from "../context/RelayContext";
import { reveal } from "../utils/motion";
import Avatar from "../components/ui/Avatar";

const easing = [0.22, 1, 0.36, 1];

const categoryMeta = {
  Books: { icon: BookOpen, iconClass: "text-[#8dcde4]", glow: "rgba(141,205,228,0.15)" },
  Tools: { icon: Wrench, iconClass: "text-[#88c4ff]", glow: "rgba(136,196,255,0.13)" },
  Electronics: { icon: Sparkles, iconClass: "text-[#bb93ff]", glow: "rgba(187,147,255,0.12)" },
  Furniture: { icon: Sparkles, iconClass: "text-[#ffc75b]", glow: "rgba(255,199,91,0.11)" },
  "Educational Kits": { icon: BookOpen, iconClass: "text-[#8dcde4]", glow: "rgba(141,205,228,0.13)" },
  Stationery: { icon: BookOpen, iconClass: "text-[#c4e0a8]", glow: "rgba(196,224,168,0.11)" },
  Collectibles: { icon: Star, iconClass: "text-[#ff9f71]", glow: "rgba(255,159,113,0.12)" },
};

function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function BidHistoryTimeline({ history, shouldReduceMotion }) {
  return (
    <div className="relative space-y-0">
      {history.map((bid, index) => {
        const isLast = index === history.length - 1;
        return (
          <motion.div
            key={`${bid.name}-${bid.amount}-${index}`}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.45,
              delay: shouldReduceMotion ? 0 : index * 0.08,
              ease: easing,
            }}
            className="relative flex items-center gap-3 pb-4 last:pb-0"
          >
            {!isLast ? (
              <span
                aria-hidden="true"
                className="absolute left-[0.55rem] top-5 h-[calc(100%-0.25rem)] w-px bg-gradient-to-b from-white/16 to-white/04"
              />
            ) : null}
            <span
              className={`relative z-[1] flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-full border ${
                bid.isCurrent
                  ? "border-[rgba(255,199,91,0.28)] bg-[rgba(255,199,91,0.12)]"
                  : "border-white/12 bg-white/[0.04]"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${bid.isCurrent ? "bg-[#ffc75b]" : "bg-white/40"}`} />
            </span>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <span className={`text-[0.84rem] font-medium ${bid.isCurrent ? "text-[#ffc75b]" : "text-white/62"}`}>
                {bid.name}
              </span>
              <span className={`font-serif text-[0.95rem] ${bid.isCurrent ? "text-white" : "text-white/72"}`}>
                {formatCurrency(bid.amount)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function PlaceBidModal({ auction, onClose, onPlaceBid, showSuccess, shouldReduceMotion }) {
  const [bidAmount, setBidAmount] = useState(String(auction.suggestedBid));

  function submitBid() {
    const amount = Number(bidAmount);

    if (!amount || amount <= auction.highestBid) {
      return;
    }

    onPlaceBid(amount);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(1,2,4,0.72)] px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: 0.98 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.45, ease: easing }}
        className="relative w-full max-w-md overflow-hidden rounded-[1.6rem] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(14,22,36,0.94),rgba(5,10,18,0.92))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.1)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white/80"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: shouldReduceMotion ? 1 : 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(196,224,168,0.22)] bg-[rgba(196,224,168,0.12)]"
              >
                <Gavel className="h-7 w-7 text-[#c4e0a8]" strokeWidth={1.8} />
              </motion.div>
              <p className="mt-5 font-serif text-[1.6rem] tracking-[-0.03em] text-white">Bid Placed</p>
              <p className="mt-2 text-[0.88rem] text-white/52">
                Your bid of {formatCurrency(Number(bidAmount))} is now the highest offer.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">Place Bid</p>
              <h3 className="mt-2 font-serif text-[1.6rem] leading-[1.05] tracking-[-0.03em] text-white">
                {auction.resourceName}
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[1rem] border border-white/[0.07] bg-white/[0.03] px-3 py-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                    Current Highest Bid
                  </p>
                  <p className="mt-1 font-serif text-[1.2rem] text-white">{formatCurrency(auction.highestBid)}</p>
                </div>
                <div className="rounded-[1rem] border border-[rgba(255,199,91,0.14)] bg-[rgba(255,199,91,0.06)] px-3 py-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[#ffc75b]/70">
                    Suggested Bid
                  </p>
                  <p className="mt-1 font-serif text-[1.2rem] text-[#ffc75b]">
                    {formatCurrency(auction.suggestedBid)}
                  </p>
                </div>
              </div>

              <label className="mt-5 block">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/38">
                  Your Bid Amount
                </span>
                <input
                  type="number"
                  min={auction.highestBid + 1}
                  value={bidAmount}
                  onChange={(event) => setBidAmount(event.target.value)}
                  className="mt-2 w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[1rem] text-white outline-none transition-all focus:border-white/20 focus:bg-white/[0.06]"
                />
              </label>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[0.84rem] font-medium text-white/58 transition-colors hover:bg-white/[0.07] hover:text-white/86"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitBid}
                  className="flex-1 rounded-full border border-white/12 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-4 py-3 text-[0.84rem] font-semibold text-[#081a22] shadow-[0_10px_24px_rgba(112,152,174,0.22)] transition-transform hover:-translate-y-0.5"
                >
                  Place Bid
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function BidHistoryModal({ auction, onClose, shouldReduceMotion }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(1,2,4,0.72)] px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: 0.98 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.45, ease: easing }}
        className="relative w-full max-w-md overflow-hidden rounded-[1.6rem] border border-white/[0.1] bg-[linear-gradient(180deg,rgba(14,22,36,0.94),rgba(5,10,18,0.92))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.1)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white/80"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">Bid History</p>
        <h3 className="mt-2 font-serif text-[1.6rem] leading-[1.05] tracking-[-0.03em] text-white">
          {auction.resourceName}
        </h3>
        <div className="mt-5 rounded-[1rem] border border-white/[0.07] bg-white/[0.03] px-4 py-4">
          <BidHistoryTimeline history={auction.bidHistory} shouldReduceMotion={shouldReduceMotion} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function AuctionCard({ auction, index, onPlaceBid, onViewHistory, onViewDetails, shouldReduceMotion }) {
  const meta = categoryMeta[auction.category] || categoryMeta.Books;
  const Icon = meta.icon;
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, delay: index * 0.06, ease: easing }}
    >
      <GlassCard className="flex h-full flex-col transition-transform duration-300 hover:-translate-y-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[48%] rounded-[inherit]"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${meta.glow} 0%, transparent 72%)` }}
        />

        <div className="relative flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_6px_16px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                <Icon className={`h-[1.05rem] w-[1.05rem] ${meta.iconClass}`} />
              </div>
              <div>
                <span className={`text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${meta.iconClass}`}>
                  {auction.category}
                </span>
                <p className="mt-0.5 text-[0.98rem] font-semibold leading-tight tracking-[-0.02em] text-white/94">
                  {auction.resourceName}
                </p>
              </div>
            </div>
            {auction.aiVerified ? (
              <span className="flex items-center gap-1 rounded-full bg-[rgba(141,205,228,0.1)] px-2 py-0.5 text-[0.65rem] font-semibold text-[#8dcde4]">
                <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2} />
                AI Verified
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              if (auction.ownerId || auction.userId) {
                navigate(`/profile/${auction.ownerId || auction.userId}`);
              }
            }}
            className="mt-4 flex items-center gap-3 text-left transition-opacity hover:opacity-80 outline-none w-max"
          >
            <Avatar
              item={{
                name: auction.ownerName || auction.owner,
                initials: auction.ownerInitials,
                color: auction.ownerColor,
                avatarUrl: auction.ownerAvatarUrl || auction.avatarUrl,
              }}
              size="h-9 w-9 text-[0.72rem]"
            />
            <div>
              <p className="text-[0.84rem] font-medium text-white/82 hover:text-[#8dcde4] transition-colors">{auction.ownerName || auction.owner}</p>
              <div className="mt-0.5 flex items-center gap-1 text-[0.68rem] text-[#8dcde4]">
                <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2} />
                Verified
              </div>
            </div>
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/30">Condition</p>
              <p className="mt-1 text-[0.82rem] text-white/68">{auction.condition}</p>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/30">Est. Value</p>
              <p className="mt-1 text-[0.82rem] text-white/68">{auction.estimatedValue}</p>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/30">Days Listed</p>
              <p className="mt-1 text-[0.82rem] text-white/68">{auction.daysListed} days</p>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/30">Distance</p>
              <p className="mt-1 flex items-center gap-1 text-[0.82rem] text-white/68">
                <MapPin className="h-3 w-3" strokeWidth={1.8} />
                {auction.distance}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[1rem] border border-white/[0.07] bg-white/[0.03] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                  Current Highest Bid
                </p>
                <p className="mt-1 font-serif text-[1.35rem] tracking-[-0.03em] text-white">
                  {formatCurrency(auction.highestBid)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                  Time Remaining
                </p>
                <p className="mt-1 flex items-center justify-end gap-1 text-[0.82rem] font-medium text-[#ffc75b]">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {auction.timeRemaining}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.74rem] text-white/44">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" strokeWidth={1.8} />
              {auction.bidders} bidders
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" strokeWidth={1.8} />
              {auction.popularity}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
            <button
              type="button"
              onClick={() => onViewDetails(auction)}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-[0.76rem] font-medium text-white/58 transition-colors hover:bg-white/[0.07] hover:text-white/86"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={() => onViewHistory(auction.id)}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-[0.76rem] font-medium text-white/58 transition-colors hover:bg-white/[0.07] hover:text-white/86"
            >
              Bid History
            </button>
            <button
              type="button"
              onClick={() => onPlaceBid(auction.id)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-3 py-2.5 text-[0.76rem] font-semibold text-[#081a22] shadow-[0_8px_20px_rgba(112,152,174,0.2)] transition-transform hover:-translate-y-0.5"
            >
              <Gavel className="h-3.5 w-3.5" strokeWidth={2} />
              Place Bid
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
}

export default function Auction() {
  const shouldReduceMotion = useReducedMotion();
  const { auctionListings, placeAuctionBid, showToast, isDemoMode, setDemoUnlockModalOpen } = useRelay();
  const visibleAuctions = useMemo(
    () => auctionListings.filter((auction) => auction.status !== "completed" && auction.status !== "inactive"),
    [auctionListings]
  );
  const [bidModalId, setBidModalId] = useState(null);
  const [historyModalId, setHistoryModalId] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  const bidAuction = useMemo(
    () => auctionListings.find((auction) => auction.id === bidModalId),
    [auctionListings, bidModalId]
  );
  const historyAuction = useMemo(
    () => auctionListings.find((auction) => auction.id === historyModalId),
    [auctionListings, historyModalId]
  );

  function openBidModal(auctionId) {
    setBidSuccess(false);
    setBidModalId(auctionId);
  }

  function closeBidModal() {
    setBidModalId(null);
    setBidSuccess(false);
  }

  function handlePlaceBid(amount) {
    if (!bidModalId) {
      return;
    }

    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      closeBidModal();
      return;
    }

    placeAuctionBid(bidModalId, amount);
    setBidSuccess(true);
    showToast("Bid Placed", `Your bid of ${formatCurrency(amount)} is now leading.`);

    window.setTimeout(() => {
      closeBidModal();
    }, 1800);
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.06)_0%,transparent_50%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <motion.section {...reveal(shouldReduceMotion, 0)} className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
            Community Auctions
          </p>
          <h1 className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white">
            Give unmatched resources another chance.
          </h1>
          <p className="mt-3 max-w-[38rem] text-[1.02rem] leading-[1.7] text-white/60">
            Long-lasting resources that remain unmatched are promoted into community auctions — never coupons or gift cards.
          </p>
        </motion.section>

        <motion.section {...reveal(shouldReduceMotion, 0.06)} className="mb-8">
          <GlassCard className="px-5 py-5 sm:px-6 sm:py-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[60%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,199,91,0.1)_0%,transparent_74%)]"
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[rgba(255,199,91,0.18)] bg-[rgba(255,199,91,0.08)]">
                <Gavel className="h-5 w-5 text-[#ffc75b]" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="font-serif text-[1.5rem] leading-[1.1] tracking-[-0.03em] text-white">
                  Why Auctions?
                </h2>
                <p className="mt-2 max-w-[42rem] text-[0.92rem] leading-[1.7] text-white/58">
                  Resources that remain unmatched for over 90 days become eligible for Community Auctions.
                  Expiring resources such as Coupons and Gift Cards are excluded because they lose value over time.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Books", "Tools", "Electronics", "Furniture", "Educational Kits", "Collectibles", "Stationery"].map(
                    (category) => (
                      <span
                        key={category}
                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[0.68rem] font-medium text-white/48"
                      >
                        {category}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section {...reveal(shouldReduceMotion, 0.1)}>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                Live Auctions
              </p>
              <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                Reusable resources seeking a new owner.
              </h2>
            </div>
            <p className="hidden text-[0.8rem] text-white/40 sm:block">
              {visibleAuctions.length} active auctions nearby
            </p>
          </div>

          {visibleAuctions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleAuctions.map((auction, index) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  index={index}
                  shouldReduceMotion={shouldReduceMotion}
                  onPlaceBid={openBidModal}
                  onViewHistory={setHistoryModalId}
                  onViewDetails={(item) =>
                    showToast(
                      "Auction Details",
                      `${item.resourceName} — ${item.condition} · ${item.estimatedValue} estimated value.`
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[1.4rem] border border-white/[0.08] bg-white/[0.03] px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Gavel className="h-6 w-6 text-white/30" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-[1rem] font-medium text-white/60">No community auctions yet</p>
              <p className="mt-1 text-[0.84rem] text-white/36">Auction activity will appear here once the backend starts publishing listings.</p>
            </div>
          )}
        </motion.section>
      </main>

      <AnimatePresence>
        {bidAuction ? (
          <PlaceBidModal
            auction={bidAuction}
            onClose={closeBidModal}
            onPlaceBid={handlePlaceBid}
            showSuccess={bidSuccess}
            shouldReduceMotion={shouldReduceMotion}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {historyAuction ? (
          <BidHistoryModal
            auction={historyAuction}
            onClose={() => setHistoryModalId(null)}
            shouldReduceMotion={shouldReduceMotion}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
