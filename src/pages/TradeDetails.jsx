import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle,
  Gift,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  TicketPercent,
  Wrench,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useRelay } from "../context/RelayContext";
import Avatar from "../components/ui/Avatar";

const easing = [0.22, 1, 0.36, 1];

const categoryMeta = {
  Books: { icon: BookOpen, iconClass: "text-[#8dcde4]", glow: "rgba(141,205,228,0.15)", blob: "bg-[#8dcde4]/18" },
  Coupons: { icon: TicketPercent, iconClass: "text-[#ffc75b]", glow: "rgba(255,199,91,0.13)", blob: "bg-[#ffc75b]/16" },
  "Gift Cards": { icon: Gift, iconClass: "text-[#ff9f71]", glow: "rgba(255,159,113,0.13)", blob: "bg-[#ff9f71]/16" },
  Tools: { icon: Wrench, iconClass: "text-[#88c4ff]", glow: "rgba(136,196,255,0.13)", blob: "bg-[#88c4ff]/16" },
  More: { icon: Sparkles, iconClass: "text-[#bb93ff]", glow: "rgba(187,147,255,0.12)", blob: "bg-[#bb93ff]/14" },
};

function reveal(shouldReduceMotion, delay = 0) {
  return {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.7, delay, ease: easing },
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

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[0.72rem] font-medium text-white/58 ${className}`}>
      {children}
    </span>
  );
}

function parseValue(value) {
  return Number(String(value || "").replace(/[^\d]/g, "")) || 0;
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/[0.06] py-3 last:border-b-0">
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/34">
        {label}
      </span>
      <span className="max-w-[62%] text-right text-[0.86rem] leading-5 text-white/74">
        {value}
      </span>
    </div>
  );
}

function ResourceCard({ resource, selected, onToggle }) {
  const meta = categoryMeta[resource.category] || categoryMeta.More;
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative overflow-hidden rounded-[1.2rem] border px-4 py-4 text-left transition-all duration-300 ${
        selected
          ? "border-white/22 bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_24px_rgba(141,205,228,0.1)]"
          : "border-white/[0.08] bg-white/[0.035] hover:border-white/14 hover:bg-white/[0.06]"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] rounded-[inherit] opacity-80"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${meta.glow} 0%, transparent 72%)`,
        }}
      />
      <div className={`absolute -right-7 -top-7 h-16 w-16 rounded-full blur-2xl ${meta.blob}`} />
      <div className="relative flex gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Icon className={`h-5 w-5 ${meta.iconClass}`} strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.92rem] font-semibold tracking-[-0.02em] text-white/92">
            {resource.title}
          </span>
          <span className="mt-1 block text-[0.74rem] text-white/46">
            {resource.category} · {resource.condition}
          </span>
          <span className="mt-3 inline-flex rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.7rem] font-medium text-white/62">
            {resource.value}
          </span>
        </span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? "border-[#c4e0a8]/34 bg-[#c4e0a8]/14 text-[#c4e0a8]"
              : "border-white/[0.09] text-transparent"
          }`}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
      </div>
    </button>
  );
}

export default function TradeDetails() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const {
    currentUserResources,
    marketplaceListings,
    startOrOpenConversation,
    isStartingNegotiation,
    setSelectedTrade,
    bookmarkedListingIds,
    toggleBookmark,
  } = useRelay();
  const [offerValidationError, setOfferValidationError] = useState(null);
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);

  const trade = marketplaceListings.find(
    (listing) => String(listing.id) === String(tradeId)
  );
  const meta = categoryMeta[trade?.category] || categoryMeta.More;
  const Icon = meta.icon;

  useEffect(() => {
    setSelectedTrade(trade || null);
  }, [setSelectedTrade, trade]);

  const selectedResources = useMemo(
    () =>
      currentUserResources.filter((resource) =>
        selectedResourceIds.includes(resource.id)
      ),
    [currentUserResources, selectedResourceIds]
  );
  const selectedTotal = selectedResources.reduce(
    (total, resource) => total + parseValue(resource.value),
    0
  );
  const ownerValue = parseValue(trade?.value);
  const difference = selectedTotal - ownerValue;
  const balanceText =
    selectedResources.length === 0
      ? "Select resources to compare"
      : Math.abs(difference) <= 150
        ? "Well balanced"
        : difference > 0
          ? "You are offering more value"
          : "Consider adding one more item";
  const isBookmarked = bookmarkedListingIds.includes(trade?.id);
  const aiSuggestion = selectedResources.length
    ? balanceText === "Well balanced"
      ? `Relay suggests a fair match for ${trade?.offering}.`
      : `Consider adding one more resource to make this exchange feel more balanced.`
    : `Select one or more of your resources to let Relay estimate a fair exchange.`;

  function toggleResource(resourceId) {
    setSelectedResourceIds((current) =>
      current.includes(resourceId)
        ? current.filter((id) => id !== resourceId)
        : [...current, resourceId]
    );
  }

  async function handleSendOffer() {
    if (!trade) return;

    if (selectedResourceIds.length === 0) {
      setOfferValidationError("Please select at least one resource to offer before sending a trade offer.");
      return;
    }
    setOfferValidationError(null);

    const ownerId = trade.userId || trade.ownerId;
    if (!ownerId) {
      setOfferValidationError("Cannot identify the listing owner. Please try again.");
      return;
    }

    await startOrOpenConversation({
      targetUserId: ownerId,
      targetUser: {
        displayName: trade.owner || trade.ownerName || trade.ownerProfile?.name || "Relay Trader",
        avatarInitials: trade.ownerProfile?.initials || trade.ownerProfile?.avatarInitials,
        avatarColor: trade.ownerProfile?.avatarColor,
      },
      sourceType: "listing",
      sourceId: trade.id || trade._id,
      listingId: trade.id || trade._id,
      sourceTitle: trade.title,
      lookingFor: trade.lookingFor,
      selectedResourceIds,
      isOfferResolved: true,
    });
  }

  async function handleStartNegotiation() {
    if (!trade) return;

    const ownerId = trade.userId || trade.ownerId;
    if (!ownerId) {
      setOfferValidationError("Cannot identify the listing owner. Please try again.");
      return;
    }

    await startOrOpenConversation({
      targetUserId: ownerId,
      targetUser: {
        displayName: trade.owner || trade.ownerName || trade.ownerProfile?.name || "Relay Trader",
        avatarInitials: trade.ownerProfile?.initials || trade.ownerProfile?.avatarInitials,
        avatarColor: trade.ownerProfile?.avatarColor,
      },
      sourceType: "listing",
      sourceId: trade.id || trade._id,
      listingId: trade.id || trade._id,
      sourceTitle: trade.title,
      lookingFor: trade.lookingFor,
    });
  }

  if (!trade) {
    return (
      <div className="relative min-h-screen text-white">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
        <Navbar />
        <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <GlassCard className="px-6 py-8">
            <p className="relative text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
              Trade Details
            </p>
            <h1 className="relative mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white">
              Trade not found.
            </h1>
            <button
              type="button"
              onClick={() => navigate("/dashboard/marketplace")}
              className="relative mt-6 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[0.84rem] font-medium text-white/66 transition-colors hover:bg-white/[0.07] hover:text-white/90"
            >
              Back to Marketplace
            </button>
          </GlassCard>
        </main>
      </div>
    );
  }

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
              className="pointer-events-none absolute inset-x-0 top-0 h-[56%] rounded-[inherit]"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${meta.glow} 0%, transparent 74%)` }}
            />
            <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl ${meta.blob}`} />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2 text-[0.8rem] font-medium text-white/58 transition-colors hover:bg-white/[0.07] hover:text-white/90"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Back
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.72rem] font-semibold ${meta.iconClass}`}>
                    <Icon className="h-3 w-3" strokeWidth={1.8} />
                    {trade.category}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-[rgba(141,205,228,0.1)] px-2.5 py-1 text-[0.72rem] font-semibold text-[#8dcde4]">
                    <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                    AI Verified
                  </span>
                  <Pill>
                    <MapPin className="h-3 w-3" strokeWidth={1.8} />
                    {trade.distance}
                  </Pill>
                  <Pill>{trade.availability}</Pill>
                  <Pill className="text-[#ffc75b]">
                    <Star className="h-3 w-3 fill-[#ffc75b]" />
                    {trade.rating}
                  </Pill>
                </div>
                <h1 className="mt-4 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white">
                  {trade.title}
                </h1>
                <p className="mt-3 max-w-[40rem] text-[1.02rem] leading-[1.7] text-white/60">
                  {trade.owner} is offering {trade.offering} and looking for {trade.lookingFor}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (trade?.ownerId) {
                    navigate(`/profile/${trade.ownerId}`);
                  }
                }}
                className="w-full text-left rounded-[1.25rem] border border-white/[0.08] bg-white/[0.04] px-4 py-4 lg:max-w-[22rem] transition-all hover:bg-white/[0.07] hover:border-white/[0.14] outline-none"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    item={{
                      name: trade.owner,
                      initials: trade.ownerProfile.initials,
                      color: trade.ownerProfile.avatarColor,
                      avatarUrl: trade.ownerProfile.avatarUrl,
                    }}
                    size="h-14 w-14 text-base font-semibold"
                  />
                  <div className="min-w-0">
                    <p className="text-[0.96rem] font-semibold tracking-[-0.02em] text-white/94 hover:text-[#8dcde4] transition-colors">
                      {trade.owner}
                    </p>
                    <p className="mt-1 text-[0.78rem] text-white/44">
                      Joined {trade.ownerProfile.joinedSince}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[0.72rem] text-white/46">
                      <span>{trade.ownerProfile.completedTrades} completed</span>
                      <span>{trade.ownerProfile.responseTime} response</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </GlassCard>
        </motion.section>

        <section className="grid gap-5 lg:grid-cols-2">
          <motion.div {...reveal(shouldReduceMotion, 0.08)}>
            <GlassCard className="h-full px-5 py-6 sm:px-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[52%] rounded-[inherit]"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${meta.glow} 0%, transparent 74%)` }}
              />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Owner Is Offering
                </p>
                <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-white/[0.04]">
                  <div className="flex aspect-[16/10] items-center justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.14)_0%,rgba(255,255,255,0.04)_48%,transparent_100%)]">
                    <span className="flex h-20 w-20 items-center justify-center rounded-[1.4rem] border border-white/10 bg-white/[0.04]">
                      <Icon className={`h-9 w-9 ${meta.iconClass}`} strokeWidth={1.6} />
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill className={meta.iconClass}>{trade.category}</Pill>
                    <Pill>{trade.condition}</Pill>
                    {trade.quality ? <Pill>{trade.quality}</Pill> : null}
                    {trade.expiry ? <Pill>{trade.expiry}</Pill> : null}
                    {trade.balanceRemaining ? <Pill>Balance {trade.balanceRemaining}</Pill> : null}
                  </div>
                  <h2 className="mt-4 text-[1.35rem] font-semibold tracking-[-0.03em] text-white/94">
                    {trade.offering}
                  </h2>
                  <p className="mt-3 text-[0.92rem] leading-7 text-white/56">
                    {trade.description}
                  </p>
                </div>

                <div className="mt-5 rounded-[1.15rem] border border-white/[0.07] bg-white/[0.035] px-4 py-4">
                  <DetailRow label="Estimated Exchange Value" value={trade.value} />
                  <DetailRow label="Condition" value={trade.condition} />
                  {trade.accessories ? <DetailRow label="Included Accessories" value={trade.accessories} /> : null}
                  <DetailRow label="Owner Notes" value={trade.ownerNotes} />
                  <DetailRow label="Verification Status" value={trade.verificationStatus} />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div {...reveal(shouldReduceMotion, 0.12)}>
            <GlassCard className="h-full px-5 py-6 sm:px-6">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Owner Is Looking For
                </p>
                <div className="mt-5 rounded-[1.25rem] border border-white/[0.08] bg-white/[0.04] px-4 py-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                    Looking For
                  </p>
                  <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.03em] text-white/94">
                    {trade.lookingFor}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trade.lookingForDetails.preferredCategories.map((category) => (
                      <Pill key={category}>{category}</Pill>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-[1.15rem] border border-white/[0.07] bg-white/[0.035] px-4 py-4">
                  <DetailRow label="Estimated Value" value={trade.lookingForDetails.estimatedValue} />
                  <DetailRow label="Condition Preference" value={trade.lookingForDetails.conditionPreference} />
                  <DetailRow label="Open To Negotiation" value={trade.lookingForDetails.openToNegotiation ? "Yes" : "No"} />
                  <DetailRow label="Open To Multiple Items" value={trade.lookingForDetails.openToMultipleItems ? "Yes" : "No"} />
                  <DetailRow label="Nearby Only" value={trade.lookingForDetails.nearbyOnly ? "Yes" : "No"} />
                </div>

                <div className="mt-5 rounded-[1.15rem] border border-[#c4e0a8]/16 bg-[#c4e0a8]/10 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#c4e0a8]" strokeWidth={1.8} />
                    <div>
                      <p className="text-[0.92rem] font-semibold text-[#dff3c6]">
                        Verified exchange intent
                      </p>
                      <p className="mt-1 text-[0.82rem] leading-5 text-white/52">
                        Relay has matched this listing against nearby resources and trade preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        <motion.section {...reveal(shouldReduceMotion, 0.16)} className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
              My Available Resources
            </p>
            <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
              Choose what you can offer.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentUserResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                selected={selectedResourceIds.includes(resource.id)}
                onToggle={() => toggleResource(resource.id)}
              />
            ))}
          </div>
        </motion.section>

        <motion.section {...reveal(shouldReduceMotion, 0.2)} className="mt-8">
          <GlassCard className="px-5 py-6 sm:px-6">
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Negotiation Panel
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Build a balanced trade offer.
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1rem] border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                      Selected Resources
                    </p>
                    <p className="mt-2 text-[0.9rem] font-semibold text-white/84">
                      {selectedResources.length ? selectedResources.map((resource) => resource.title).join(", ") : "None selected"}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                      Owner Resource
                    </p>
                    <p className="mt-2 text-[0.9rem] font-semibold text-white/84">
                      {trade.offering}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                      Trade Balance
                    </p>
                    <p className="mt-2 text-[0.9rem] font-semibold text-white/84">
                      {balanceText}
                    </p>
                    <p className="mt-1 text-[0.74rem] text-white/42">
                      Difference: {selectedResources.length ? `₹${Math.abs(difference).toLocaleString("en-IN")}` : "Not calculated"}
                    </p>
                  </div>
                </div>
                <div className="mt-5 rounded-[1rem] border border-[#8dcde4]/14 bg-[#8dcde4]/10 px-4 py-3 text-[0.84rem] leading-6 text-white/66">
                  <span className="font-semibold text-[#bde2ef]">Relay AI Suggestion:</span>{" "}
                  {aiSuggestion}
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:w-[14rem]">
                <button
                  type="button"
                  onClick={() => toggleBookmark(trade.id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-[0.84rem] font-medium transition-colors ${isBookmarked ? "border-[#8dcde4]/30 bg-[#8dcde4]/12 text-[#8dcde4]" : "border-white/[0.09] bg-white/[0.04] text-white/66 hover:bg-white/[0.07] hover:text-white/90"}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} strokeWidth={1.8} />
                  {isBookmarked ? "Bookmarked" : "Bookmark Trade"}
                </button>
                <button
                  type="button"
                  disabled={isStartingNegotiation}
                  onClick={handleStartNegotiation}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[0.84rem] font-medium text-white/66 transition-colors hover:bg-white/[0.07] hover:text-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                  {isStartingNegotiation ? "Starting..." : "Start Negotiation"}
                </button>
                {offerValidationError && (
                  <p className="text-[0.75rem] text-[#ff9f71] px-1">{offerValidationError}</p>
                )}
                <button
                  type="button"
                  disabled={isStartingNegotiation}
                  onClick={handleSendOffer}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-5 py-3 text-[0.84rem] font-semibold text-[#081a22] shadow-[0_18px_48px_rgba(112,152,174,0.24),inset_0_1px_0_rgba(255,255,255,0.48)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeftRight className="h-4 w-4" strokeWidth={2.1} />
                  Send Trade Offer
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-[0.84rem] font-medium text-white/42 transition-colors hover:bg-white/[0.06] hover:text-white/72"
                >
                  Cancel
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.section>
      </main>

      <AnimatePresence>
        {successOpen ? (
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
              className="relative w-full max-w-[26rem] overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.94),rgba(5,10,18,0.9))] px-5 py-6 shadow-[0_28px_90px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[28px]"
            >
              <button
                type="button"
                aria-label="Close success modal"
                onClick={() => setSuccessOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/42 transition-colors hover:bg-white/[0.07] hover:text-white/80"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c4e0a8]/22 bg-[#c4e0a8]/12 text-[#c4e0a8]">
                <CheckCircle className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <h2 className="mt-5 font-serif text-[2rem] leading-none tracking-[-0.05em] text-white">
                Trade request sent successfully.
              </h2>
              <p className="mt-3 text-[0.92rem] leading-6 text-white/56">
                Your outgoing request has been added. The owner can now review your selected resources.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/marketplace")}
                  className="rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2.5 text-[0.82rem] font-medium text-white/66 transition-colors hover:bg-white/[0.07] hover:text-white/90"
                >
                  Continue Browsing
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/requests")}
                  className="rounded-full border border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] px-4 py-2.5 text-[0.82rem] font-semibold text-[#081a22]"
                >
                  Go To Requests
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
