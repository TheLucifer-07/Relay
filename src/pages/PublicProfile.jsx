import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  Zap,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Avatar from "../components/ui/Avatar";
import GlassCard from "../components/ui/GlassCard";
import TraderListingCard from "../components/ui/TraderListingCard";
import { useRelay } from "../context/RelayContext";
import { reveal } from "../utils/motion";
import { api } from "../lib/api";
import {
  INDIAN_NAMES,
  AVATAR_COLORS,
  demoMarketplaceListingsSeed,
} from "../data/demoSeeds";


const achievements = [
  { label: "Verified Trader", icon: ShieldCheck, color: "text-[#8dcde4]" },
  { label: "Trusted Member", icon: Award, color: "text-[#ffc75b]" },
  { label: "Fast Responder", icon: Zap, color: "text-[#c4e0a8]" },
  { label: "100 Successful Trades", icon: Trophy, color: "text-[#ff9f71]" },
  { label: "Community Favourite", icon: Users, color: "text-[#bb93ff]" },
];

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const {
    isDemoMode,
    showToast,
    startOrOpenConversation,
    onlineUsers,
    backendUserId,
  } = useRelay();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  const isDemoUser = isDemoMode || (userId && userId.startsWith("demo-user-"));
  const isOnline = userId ? Boolean(onlineUsers[userId]) : false;

  useEffect(() => {
    if (isDemoUser) {
      const timer = setTimeout(() => {
        setLoading(true);
        setError("");
        const match = userId?.match(/demo-user-(\d+)/);
        const idx = match ? parseInt(match[1], 10) : 0;
        const name = INDIAN_NAMES[idx % INDIAN_NAMES.length] || "Relay Trader";
        const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];

        const demoProfile = {
          _id: userId,
          userId: userId,
          displayName: name,
          avatarInitials: name.split(" ").map(n => n[0]).join(""),
          avatarColor: color,
          bio: `Hi! I'm ${name}. I love trading books, electronics, and tools near MVP Colony. Open to fair swaps!`,
          city: "Visakhapatnam",
          location: "Visakhapatnam",
          memberSince: `Jan ${2022 + (idx % 3)}`,
          trustScore: 90 + (idx % 11),
          successfulTrades: (idx * 4) % 32 + 3,
          successRate: "98%",
          responseTime: "10 min",
          communityRating: 4.8,
          reviewCount: 5,
          lastSeenAt: new Date().toISOString(),
        };

        const userListings = demoMarketplaceListingsSeed
          .filter((l) => l.ownerId === userId)
          .map((l) => ({
            ...l,
            tradeId: l.id,
          }));

        const demoReviews = [
          {
            _id: "rev-1",
            reviewerName: "Amit Kumar",
            reviewerInitials: "AK",
            reviewerColor: "bg-[rgba(255,159,113,0.16)] text-[#ff9f71]",
            starRating: 5,
            stars: "★★★★★",
            title: "Excellent Swap",
            description: "Super fast response and very polite. Item works perfectly.",
            tradeDate: "Today",
          },
          {
            _id: "rev-2",
            reviewerName: "Priya Rao",
            reviewerInitials: "PR",
            reviewerColor: "bg-[rgba(187,147,255,0.18)] text-[#bb93ff]",
            starRating: 5,
            stars: "★★★★★",
            title: "Highly recommended",
            description: "Great relay experience. Met up at RK Beach safely.",
            tradeDate: "3 days ago",
          }
        ];

        setProfile(demoProfile);
        setListings(userListings);
        setReviews(demoReviews);
        setLoading(false);
      }, 0);

      return () => clearTimeout(timer);
    } else {
      // Load real MERN profile from backend
      async function loadRealProfile() {
        setLoading(true);
        setError("");
        try {
          const profileRes = await api.getPublicProfile(userId);
          if (profileRes?.profile) {
            setProfile(profileRes.profile);
            setReviews(profileRes.reviews || []);
          } else {
            setError("Profile not found.");
          }

          const listingsRes = await api.getUserListings(userId);
          if (listingsRes?.listings) {
            setListings(listingsRes.listings.map(l => ({
              ...l,
              id: String(l._id || l.id),
              tradeId: String(l._id || l.id),
              desc: `${l.condition} · AI Verified`,
              availability: "Available now",
              detailLabel: "Condition",
              detailValue: l.condition,
            })));
          }
        } catch (err) {
          setError(err.message || "Failed to load trader profile.");
        } finally {
          setLoading(false);
        }
      }
      void loadRealProfile();
    }
  }, [userId, isDemoUser]);

  // Handle message action: opens existing conversation or creates one
  async function handleMessageClick() {
    if (!profile) return;

    if (isDemoUser) {
      await startOrOpenConversation({
        targetUserId: userId,
        targetUser: {
          displayName: profile.displayName,
          avatarInitials: profile.avatarInitials,
          avatarColor: profile.avatarColor,
        },
        sourceType: "request",
        sourceId: userId,
        requestId: userId,
        sourceTitle: `Message ${profile.displayName}`,
        lookingFor: "Open conversation",
      });
      return;
    }

    if (userId === backendUserId) {
      navigate("/profile");
      return;
    }

    const firstListing = listings[0];
    if (!firstListing) {
      showToast("Cannot message", "This user has no active listings to trade.", "error");
      return;
    }

    await startOrOpenConversation({
      targetUserId: userId,
      targetUser: {
        displayName: profile.displayName,
        avatarInitials: profile.avatarInitials,
        avatarColor: profile.avatarColor,
      },
      sourceType: "listing",
      sourceId: firstListing.id || firstListing._id,
      listingId: firstListing.id || firstListing._id,
      sourceTitle: firstListing.title,
      lookingFor: firstListing.lookingFor,
    });
  }

  // Handle trade offer click
  async function handleMakeOfferClick() {
    if (!profile) return;
    const firstListing = listings[0];
    if (!firstListing) {
      showToast("No active listings", "This user has no resources to trade.", "error");
      return;
    }
    await startOrOpenConversation({
      targetUserId: userId,
      targetUser: {
        displayName: profile.displayName,
        avatarInitials: profile.avatarInitials,
        avatarColor: profile.avatarColor,
      },
      sourceType: "listing",
      sourceId: firstListing.id || firstListing._id,
      listingId: firstListing.id || firstListing._id,
      sourceTitle: firstListing.title,
      lookingFor: firstListing.lookingFor,
    });
  }

  const profileStats = useMemo(() => {
    if (!profile) return [];
    return [
      { label: "Completion Rate", value: profile.successRate || "98%", icon: CheckCircle, color: "#c4e0a8", glow: "rgba(196,224,168,0.11)" },
      { label: "Average Response Time", value: profile.responseTime || "10 min", icon: Clock, color: "#8dcde4", glow: "rgba(141,205,228,0.13)" },
      { label: "Community Rating", value: String(profile.communityRating || "4.8"), icon: Star, color: "#bb93ff", glow: "rgba(187,147,255,0.11)" },
      { label: "Successful Exchanges", value: String(profile.successfulTrades || 0), icon: Trophy, color: "#ffc75b", glow: "rgba(255,199,91,0.11)" },
    ];
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010204] text-white">
        <div className="text-sm font-semibold tracking-wide text-white/50">Loading profile data...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#010204] text-white px-4">
        <h2 className="text-xl font-bold text-white/80">{error || "User Profile not found"}</h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm text-white/70 hover:bg-white/15"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.06)_0%,transparent_50%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        {/* Back navigation header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </button>
        </div>

        {/* Profile Card */}
        <motion.section {...reveal(shouldReduceMotion, 0)} className="mb-8">
          <GlassCard className="px-5 py-6 sm:px-7 sm:py-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[56%] rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(141,205,228,0.14)_0%,transparent_74%)]"
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Reusable Avatar Component */}
                <div className="relative shrink-0">
                  <Avatar item={profile} size="h-24 w-24 text-3xl font-semibold" />
                  <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-[#8dcde4] text-[#010204]">
                    <ShieldCheck className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                      Verified Trader
                    </p>
                    <span className="rounded-full bg-[rgba(196,224,168,0.12)] px-2.5 py-0.5 text-[0.72rem] font-semibold text-[#c4e0a8]">
                      Trust Score {profile.trustScore}
                    </span>
                    {isOnline && (
                      <span className="rounded-full bg-[rgba(196,224,168,0.15)] px-2 py-0.5 text-[0.68rem] font-medium text-[#c4e0a8]">
                        ● Online
                      </span>
                    )}
                  </div>
                  <h1 className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.0] tracking-[-0.05em] text-white">
                    {profile.displayName}
                  </h1>
                  <p className="mt-2 text-sm text-white/60 max-w-[28rem]">{profile.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-[0.86rem] text-white/52">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {profile.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Member since {profile.memberSince}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions (Message + Make Offer) */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleMessageClick}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8dcde4] px-6 py-3 text-[0.84rem] font-semibold text-[#081a22] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" /> Message
                </button>
                <button
                  type="button"
                  onClick={handleMakeOfferClick}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-6 py-3 text-[0.84rem] font-medium text-white/66 transition-colors hover:bg-white/[0.07] hover:text-white/90"
                >
                  Make Offer
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Stats */}
        <motion.section {...reveal(shouldReduceMotion, 0.08)} className="mb-8">
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

        {/* Two-Column Listings + Reviews */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            {/* Active Listings */}
            <motion.section {...reveal(shouldReduceMotion, 0.12)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Trader's Listings
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Active verified exchanges.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {listings.map((listing) => (
                  <TraderListingCard key={listing.id} listing={listing} />
                ))}
                {listings.length === 0 && (
                  <p className="py-6 text-white/40">No active resources published.</p>
                )}
              </div>
            </motion.section>
          </div>

          <div className="space-y-8">
            {/* Reviews */}
            <motion.section {...reveal(shouldReduceMotion, 0.16)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Exchange Feedback
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Community reputation.
                </h2>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <GlassCard key={review._id} className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${review.reviewerColor}`}>
                        {review.reviewerInitials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{review.reviewerName}</p>
                        <p className="text-[0.7rem] text-white/36">{review.tradeDate}</p>
                      </div>
                      <span className="ml-auto text-[0.8rem] text-[#ffc75b] tracking-wide">{review.stars}</span>
                    </div>
                    <p className="mt-3 text-[0.84rem] font-semibold text-white/90">{review.title}</p>
                    <p className="mt-1 text-[0.8rem] text-white/50 leading-relaxed">{review.description}</p>
                  </GlassCard>
                ))}
                {reviews.length === 0 && (
                  <p className="py-6 text-white/40">No exchange reviews received yet.</p>
                )}
              </div>
            </motion.section>

            {/* Achievements */}
            <motion.section {...reveal(shouldReduceMotion, 0.2)}>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
                  Trader Achievements
                </p>
                <h2 className="mt-2 font-serif text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-white">
                  Earned badges.
                </h2>
              </div>
              <GlassCard className="px-5 py-5">
                <div className="space-y-3">
                  {achievements.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] ${item.color}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-white/80">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}
