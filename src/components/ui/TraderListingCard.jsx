import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Gift,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  Wrench,
} from "lucide-react";
import GlassCard from "./GlassCard";
import { tradePath } from "../../routes/paths";

const ICON_MAP = {
  Books: { icon: BookOpen, iconClass: "text-[#8dcde4]", glow: "rgba(141,205,228,0.15)", blob: "bg-[#8dcde4]/18" },
  Coupons: { icon: TicketPercent, iconClass: "text-[#ffc75b]", glow: "rgba(255,199,91,0.13)", blob: "bg-[#ffc75b]/16" },
  "Gift Cards": { icon: Gift, iconClass: "text-[#ff9f71]", glow: "rgba(255,159,113,0.13)", blob: "bg-[#ff9f71]/16" },
  Tools: { icon: Wrench, iconClass: "text-[#88c4ff]", glow: "rgba(136,196,255,0.13)", blob: "bg-[#88c4ff]/16" },
  More: { icon: Sparkles, iconClass: "text-[#bb93ff]", glow: "rgba(187,147,255,0.12)", blob: "bg-[#bb93ff]/14" },
};

export default function TraderListingCard({ listing, onNavigate }) {
  const navigate = useNavigate();
  const meta = ICON_MAP[listing.category] || ICON_MAP.Books;
  const Icon = meta.icon;

  function handleClick() {
    onNavigate?.();
    navigate(tradePath(listing.tradeId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group w-full text-left transition-transform duration-300 hover:-translate-y-0.5"
    >
      <GlassCard className="flex h-full flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[48%] rounded-[inherit]"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${meta.glow} 0%, transparent 72%)` }}
        />
        <div aria-hidden="true" className={`absolute -right-5 -top-5 h-16 w-16 rounded-full blur-2xl ${meta.blob}`} />

        <div className="relative flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_6px_16px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
                <Icon className={`h-[1.05rem] w-[1.05rem] ${meta.iconClass}`} />
              </div>
              <div>
                <span className={`text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${meta.iconClass}`}>
                  {listing.category}
                </span>
                <p className="mt-0.5 text-[0.92rem] font-semibold leading-tight tracking-[-0.02em] text-white/94">
                  {listing.title}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[rgba(141,205,228,0.1)] px-2 py-0.5 text-[0.65rem] font-semibold text-[#8dcde4]">
              <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2} />
              Verified
            </span>
          </div>

          <p className="relative mt-2 text-[0.78rem] leading-[1.6] text-white/52">{listing.desc}</p>

          <div className="relative mt-3 rounded-[1rem] border border-white/[0.06] bg-white/[0.035] px-3 py-3">
            <div className="grid gap-2">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                  Offering
                </p>
                <p className="mt-0.5 truncate text-[0.8rem] font-medium text-white/78">
                  {listing.title} · {listing.condition}
                </p>
              </div>
              <div className="border-t border-white/[0.06] pt-2">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/34">
                  Looking For
                </p>
                <p className="mt-0.5 truncate text-[0.8rem] font-medium text-white/78">
                  {listing.lookingFor}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(255,199,91,0.1)] px-2.5 py-0.5 text-[0.7rem] font-medium text-[#ffc75b]">
              <span className="text-white/38">{listing.detailLabel}:</span>
              {listing.detailValue}
            </span>
          </div>

          <div className="relative mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/30">
                Estimated Exchange Value
              </p>
              <span className="font-serif text-[1rem] font-medium tracking-[-0.02em] text-white/88">
                {listing.value}
              </span>
            </div>
            <span
              className={`text-[0.72rem] font-medium ${
                listing.status === "Urgent Trade" ? "text-[#ffc75b]" : "text-[#8dcde4]"
              }`}
            >
              {listing.status}
            </span>
          </div>
        </div>
      </GlassCard>
    </button>
  );
}
