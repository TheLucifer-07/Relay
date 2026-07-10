import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bookmark, MapPin, X, ShieldCheck, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/ui/GlassCard";
import { useRelay } from "../context/RelayContext";
import { CATEGORIES, SORTS, ICON_MAP } from "../data/categoriesConfig";
import { tradePath } from "../routes/paths";
import RelayMap from "../components/map/RelayMap";

const easing = [0.16, 1, 0.3, 1];
const DEFAULT_MAP_CENTER = { lat: 17.3850, lng: 78.4867 };

function RelayCard({ card, index }) {
  const meta = ICON_MAP[card.category] || ICON_MAP.More;
  const Icon = meta.icon;
  const navigate = useNavigate();
  const { toggleBookmark, bookmarkedListingIds } = useRelay();

  const isBookmarked = bookmarkedListingIds.includes(card.id);
  const badgeClass =
    card.badge === "Hot Trade"
      ? "bg-[rgba(255,159,113,0.12)] text-[#ff9f71]"
      : "bg-[rgba(187,147,255,0.12)] text-[#bb93ff]";

  const hasImage = card.images && card.images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: easing }}
      className="group flex flex-col h-full"
    >
      <GlassCard className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-[0_20px_50px_rgba(0,0,0,0.36)]">
        {/* Banner image or category representation */}
        {hasImage ? (
          <div className="relative h-32 w-full border-b border-white/[0.04] overflow-hidden flex items-center justify-center bg-white/[0.01]">
            <img
              src={card.images[0]}
              alt={card.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay glow on image */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070e17] to-transparent opacity-60" />
          </div>
        ) : (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[48%] rounded-[inherit]"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${meta.glow} 0%, transparent 72%)` }} />
        )}
        <div aria-hidden="true" className={`absolute -right-5 -top-5 h-16 w-16 rounded-full blur-2xl ${meta.blob}`} />

        <div className="relative flex flex-grow flex-col p-5 justify-between">
          <div>
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_6px_16px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <Icon className={`h-[1.05rem] w-[1.05rem] ${meta.iconClass}`} />
                </div>
                <div>
                  <span className={`text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${meta.iconClass}`}>
                    {card.category}
                  </span>
                  <p className="mt-0.5 text-[0.95rem] font-semibold leading-tight tracking-[-0.02em] text-white/94">
                    {card.title}
                  </p>
                </div>
              </div>
              <div className="mt-0.5 flex shrink-0 flex-col items-end gap-1">
                <span className="flex items-center gap-1 rounded-full bg-[rgba(141,205,228,0.1)] px-2 py-0.5 text-[0.65rem] font-semibold text-[#8dcde4]">
                  <ShieldCheck className="h-2.5 w-2.5 animate-spin" style={{ animationDuration: '6s' }} />
                  Verified
                </span>
                {card.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.08em] ${badgeClass}`}>
                    {card.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="relative mt-3 text-[0.8rem] leading-[1.6] text-white/52 line-clamp-2">
              {card.description || card.desc}
            </p>

            {/* Trade pair */}
            <div className="relative mt-4 rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-3 py-3">
              <div className="grid gap-2">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                    Offering
                  </p>
                  <p className="mt-0.5 truncate text-[0.8rem] font-medium text-white/78">
                    {card.offering || card.title}
                  </p>
                </div>
                <div className="border-t border-white/[0.06] pt-2">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                    Looking For
                  </p>
                  <p className="mt-0.5 truncate text-[0.8rem] font-medium text-white/78">
                    {card.lookingFor}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Meta row */}
            <div className="relative mt-4 flex items-center gap-3 text-[0.74rem] text-white/40">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" strokeWidth={1.8} />
                {card.distance}
              </span>
              <span className="text-white/20">·</span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-[#ffc75b] text-[#ffc75b]" />
                {card.rating}
              </span>
              <span className="text-white/20">·</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (card.ownerId) {
                    navigate(`/profile/${card.ownerId}`);
                  }
                }}
                className="text-white/44 hover:text-white/80 transition-colors truncate max-w-[80px] text-left outline-none font-medium"
              >
                {card.owner}
              </button>
            </div>

            {/* Trade details detailValue if present */}
            {card.detailValue && (
              <div className="relative mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,199,91,0.1)] px-2.5 py-0.5 text-[0.7rem] font-medium text-[#ffc75b]">
                  <span className="text-white/38">{card.detailLabel || "Condition"}:</span>
                  {card.detailValue}
                </span>
              </div>
            )}

            {/* Footer */}
            <div className="relative mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/30">
                  Exchange Value
                </p>
                <span className="font-serif text-[1.05rem] font-medium tracking-[-0.02em] text-white/88">
                  {card.value}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark trade"}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleBookmark(card.id);
                  }}
                  className={`rounded-full border p-2 transition-colors ${
                    isBookmarked 
                      ? "border-[#8dcde4]/30 bg-[#8dcde4]/12 text-[#8dcde4]" 
                      : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/80"
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-current" : ""}`} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(tradePath(card.id))}
                  className="rounded-[0.75rem] border border-white/[0.1] bg-white/[0.05] px-3.5 py-1.5 text-[0.76rem] font-medium text-white/72 transition-colors hover:bg-white/[0.09] hover:text-white"
                >
                  View Trade
                </button>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
}

export default function Marketplace() {
  const navigate = useNavigate();
  const { marketplaceListings } = useRelay();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("Newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'

  const cards = marketplaceListings;

  const filtered = useMemo(() => {
    let list = [...cards];

    if (activeCategory !== "All") {
      list = list.filter((c) => c.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.owner.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.lookingFor.toLowerCase().includes(q)
      );
    }

    if (activeSort === "Nearby") {
      list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (activeSort === "Popular") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (activeSort === "Verified Only") {
      list = list.filter((c) => c.verified);
    }

    return list;
  }, [search, activeCategory, activeSort, cards]);

  // Simulate or map coordinates based on distance metric or ID hashes
  const getCoordinates = (item, baseCenterPoint) => {
    if (item.latitude !== undefined && item.longitude !== undefined) {
      return { lat: item.latitude, lng: item.longitude };
    }
    const idHash = item.id.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
    const angle = (idHash % 360) * (Math.PI / 180);
    const radius = 0.003 + (idHash % 12) * 0.0008; // offset from 300m to 1.2km
    return {
      lat: baseCenterPoint.lat + Math.sin(angle) * radius,
      lng: baseCenterPoint.lng + Math.cos(angle) * radius
    };
  };

  const mappedListings = useMemo(() => {
    return filtered.map((item) => {
      const coords = getCoordinates(item, DEFAULT_MAP_CENTER);
      return {
        ...item,
        coordinates: [coords.lng, coords.lat]
      };
    });
  }, [filtered]);

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.06)_0%,transparent_50%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">
              Marketplace
            </p>
            <h1 className="mt-2 font-serif text-[clamp(2rem,3.6vw,3rem)] leading-[1.0] tracking-[-0.05em] text-white">
              Resources near you.
            </h1>
            <p className="mt-2 text-[0.95rem] text-white/52">
              {cards.length} verified trade offers · Updated just now
            </p>
          </motion.div>
        </div>

        {/* Search + filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: easing }}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search trades, resources, owners…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[1rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(14,22,36,0.78),rgba(5,10,18,0.72))] py-3 pl-11 pr-4 text-[0.88rem] text-white placeholder-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[20px] outline-none transition-all focus:border-white/20 focus:shadow-[0_8px_24px_rgba(0,0,0,0.22),0_0_0_1px_rgba(141,205,228,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/36 hover:text-white/70">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 sm:pb-0">
            {SORTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveSort(s)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.78rem] font-medium transition-all duration-200 ${
                  activeSort === s
                    ? "border-white/20 bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    : "border-white/[0.07] bg-white/[0.03] text-white/48 hover:text-white/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14, ease: easing }}
          className="mb-8 flex items-center gap-2 overflow-x-auto pb-1"
        >
          {CATEGORIES.map((cat) => {
            const meta = cat !== "All" ? ICON_MAP[cat] : null;
            const Icon = meta?.icon;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.82rem] font-medium transition-all duration-200 ${
                  active
                    ? "border-white/18 bg-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    : "border-white/[0.07] bg-white/[0.03] text-white/48 hover:text-white/80"
                }`}
              >
                {Icon && <Icon className={`h-3.5 w-3.5 ${active ? meta.iconClass : "text-current"}`} strokeWidth={1.8} />}
                {cat}
                {active && cat !== "All" && (
                  <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[0.62rem] font-bold ${meta.iconClass} bg-white/[0.08]`}>
                    {cards.filter((c) => c.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Results count & view toggles */}
        <div className="mb-5 flex items-center justify-between border-b border-white/[0.04] pb-4">
          <p className="text-[0.82rem] text-white/40">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
            {activeCategory !== "All" && ` in ${activeCategory}`}
            {search && ` for "${search}"`}
          </p>
          <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1 shadow-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "grid" ? "bg-white/[0.08] text-white" : "text-white/46 hover:text-white"
              }`}
            >
              Grid Feed
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "map" ? "bg-white/[0.08] text-white" : "text-white/46 hover:text-white"
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Display Views */}
        {viewMode === "map" ? (
          <div className="relative h-[550px] w-full rounded-2xl border border-white/[0.09] bg-[#050912] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.36)]">
            <RelayMap
              listings={mappedListings}
              onRequest={(item) => navigate(tradePath(item.id))}
            />
            
            {/* Geolocation indicator banner */}
            <div className="pointer-events-none absolute left-4 bottom-4 z-10 sm:left-6 sm:bottom-6">
              <span className="rounded-lg bg-black/80 px-3.5 py-2 text-[0.72rem] font-semibold text-[#8dcde4] border border-white/10 shadow-lg backdrop-blur-md">
                🔍 {filtered.length} listings mapped nearby. Click markers to inspect details.
              </span>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filtered.map((card, i) => (
                  <RelayCard key={card.id} card={card} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Search className="h-6 w-6 text-white/30" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-[1rem] font-medium text-white/60">No resources found yet</p>
                <p className="mt-1 text-[0.84rem] text-white/36">A new marketplace will appear here as listings are published from the backend.</p>
                <button
                  type="button"
                  onClick={() => { setSearch(""); setActiveCategory("All"); }}
                  className="mt-5 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-[0.82rem] text-white/60 hover:text-white/90"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
