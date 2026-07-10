export const TRADE_OUTCOME = {
  COMPLETED: "completed",
  NEGOTIATION_ACTIVE: "negotiation_active",
  DECLINED: "declined",
};

export function getTradeStatusConfig(status, outcome) {
  const current = status || outcome || "pending";
  
  if (current === "completed") {
    return {
      label: "Trade Completed",
      chipLabel: "Trade Completed",
      chipClass: "bg-[rgba(196,224,168,0.12)] text-[#c4e0a8] border-[rgba(196,224,168,0.18)]",
      glowColor: "rgba(196,224,168,0.11)",
      locked: true,
      footerMessage: "Exchange Completed Successfully",
      quickActions: [],
      footerActions: [
        { id: "summary", label: "View Trade Summary" },
        { id: "feedback", label: "Leave Feedback" },
        { id: "archive", label: "Archive Conversation" },
      ],
    };
  }
  
  if (["declined", "cancelled", "expired"].includes(current)) {
    return {
      label: "Trade Closed",
      chipLabel: "Trade Closed",
      chipClass: "bg-[rgba(200,130,130,0.12)] text-[#c89898] border-[rgba(200,130,130,0.18)]",
      glowColor: "rgba(200,130,130,0.09)",
      locked: true,
      footerMessage: "Conversation Closed",
      quickActions: [],
      footerActions: [
        { id: "archive", label: "Archive" },
      ],
    };
  }

  if (["accepted", "offer_accepted"].includes(current)) {
    return {
      label: "Offer Accepted",
      chipLabel: "Offer Accepted",
      chipClass: "bg-[rgba(141,205,228,0.12)] text-[#8dcde4] border-[rgba(141,205,228,0.18)]",
      glowColor: "rgba(141,205,228,0.11)",
      locked: false,
      footerMessage: null,
      quickActions: [
        { id: "schedule", label: "Schedule Meeting" },
        { id: "handoff", label: "Confirm Handoff" },
        { id: "reject", label: "Reject Offer" },
      ],
      footerActions: [],
    };
  }

  if (current === "meeting_scheduled") {
    return {
      label: "Meeting Scheduled",
      chipLabel: "Meeting Scheduled",
      chipClass: "bg-[rgba(187,147,255,0.12)] text-[#bb93ff] border-[rgba(187,147,255,0.18)]",
      glowColor: "rgba(187,147,255,0.11)",
      locked: false,
      footerMessage: null,
      quickActions: [
        { id: "handoff", label: "Confirm Handoff" },
        { id: "complete", label: "Complete Exchange" },
        { id: "reject", label: "Reject Offer" },
      ],
      footerActions: [],
    };
  }

  if (current === "resources_exchanged") {
    return {
      label: "Resources Exchanged",
      chipLabel: "Resources Exchanged",
      chipClass: "bg-[rgba(196,224,168,0.12)] text-[#c4e0a8] border-[rgba(196,224,168,0.18)]",
      glowColor: "rgba(196,224,168,0.11)",
      locked: false,
      footerMessage: null,
      quickActions: [
        { id: "complete", label: "Complete Exchange" },
      ],
      footerActions: [],
    };
  }

  // Default: pending / negotiation_started / negotiation_active / counter_offered / offer_sent
  return {
    label: "Negotiation Active",
    chipLabel: "Negotiation Active",
    chipClass: "bg-[rgba(255,199,91,0.12)] text-[#ffc75b] border-[rgba(255,199,91,0.18)]",
    glowColor: "rgba(255,199,91,0.11)",
    locked: false,
    footerMessage: null,
    quickActions: [
      { id: "accept", label: "Accept Offer" },
      { id: "counter", label: "Counter Offer" },
      { id: "reject", label: "Reject Offer" },
      { id: "schedule", label: "Schedule Meeting" },
    ],
    footerActions: [],
  };
}
