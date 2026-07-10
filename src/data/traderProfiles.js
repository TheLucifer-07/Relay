export const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
export const feedbackTags = ["Fast", "Reliable", "Clear communication", "Friendly"];export const tradeAgainOptions = ["Yes", "Maybe", "Not sure"];
export const traderProfiles = {};

export function resolveTraderId({ traderId, conversationId, name }) {
  return traderId || conversationId || name || null;
}

export const traderProfilesSeed = traderProfiles;
