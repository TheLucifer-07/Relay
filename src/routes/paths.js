export const TRADE_DETAIL_ROUTE = "/trade/:tradeId";
export const LEGACY_TRADE_DETAIL_ROUTE = "/dashboard/trades/:tradeId";
export const AUCTION_ROUTE = "/auction";

export function tradePath(tradeId) {
  return `/trade/${tradeId}`;
}
