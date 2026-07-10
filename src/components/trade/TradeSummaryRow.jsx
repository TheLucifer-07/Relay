import { ShieldCheck } from "lucide-react";
import Avatar from "../ui/Avatar";
import TradeStatusChip from "./TradeStatusChip";

export default function TradeSummaryRow({ trade, onClick, onProfileClick, active = false }) {
  function handleProfileClick(event) {
    event.stopPropagation();
    onProfileClick?.(trade);
  }

  function handleRowClick() {
    onClick?.();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleRowClick();
        }
      }}
      className={`w-full cursor-pointer rounded-[1.15rem] border px-3 py-3 text-left transition-all duration-200 ${
        active
          ? "border-white/18 bg-white/[0.09]"
          : "border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleProfileClick}
          aria-label={`View ${trade.name}'s trader profile`}
          className="shrink-0 rounded-2xl transition-opacity hover:opacity-85"
        >
          <Avatar item={trade} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleProfileClick}
              className="truncate text-[0.9rem] font-semibold tracking-[-0.02em] text-white/90 transition-colors hover:text-white"
            >
              {trade.name}
            </button>
            <span className="shrink-0 text-[0.66rem] text-white/34">{trade.time}</span>
          </div>
          <div className="mt-1.5">
            <TradeStatusChip outcome={trade.outcome} compact />
          </div>
          <p className="mt-2 truncate text-[0.75rem] text-white/48">
            {trade.offering} ↔ {trade.lookingFor}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="truncate text-[0.74rem] text-white/38">{trade.lastMessage}</p>
            {trade.unread ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8dcde4] px-1.5 text-[0.62rem] font-bold text-[#010204]">
                {trade.unread}
              </span>
            ) : null}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[0.68rem] text-[#8dcde4]">
            <ShieldCheck className="h-3 w-3" strokeWidth={2} />
            Verified
          </div>
        </div>
      </div>
    </div>
  );
}
