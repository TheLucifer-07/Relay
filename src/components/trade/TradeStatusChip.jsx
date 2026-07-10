import { getTradeStatusConfig } from "../../data/tradeStatusConfig";

export default function TradeStatusChip({ outcome, compact = false }) {
  const config = getTradeStatusConfig(outcome);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.02em] ${config.chipClass}`}
      >
        {config.chipLabel}
      </span>
      {!compact && config.subLabel ? (
        <span className="text-[0.65rem] font-medium text-white/40">{config.subLabel}</span>
      ) : null}
    </div>
  );
}
