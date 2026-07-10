import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  CheckCheck,
  Check,
  Clock,
  ImagePlus,
  MessageCircle,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Smile,
  WifiOff,
} from "lucide-react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/ui/GlassCard";
import TradeStatusChip from "../components/trade/TradeStatusChip";
import TradeTimeline from "../components/trade/TradeTimeline";
import { getTradeStatusConfig, TRADE_OUTCOME } from "../data/tradeStatusConfig";
import { useRelay } from "../context/RelayContext";
import { reveal } from "../utils/motion";
import { api } from "../lib/api";
import HandoffMap from "../components/HandoffMap";
import { getInitials } from "../utils/initials";

// ─── Helpers ────────────────────────────────────────────────────────────────
const FILTERS = ["All", "Ongoing", "Completed", "Declined"];

function formatMsgTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getDateLabel(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const now = new Date();
  const diff = now.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0);
  if (diff <= 0) return "Today";
  if (diff <= 86400000) return "Yesterday";
  return new Date(dateStr).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function ConversationRow({ conversation, isActive, onClick, isOnline }) {
  const unread = conversation.unreadCount ?? conversation.unread ?? 0;
  const lastMsg = conversation.lastMessage || conversation.messages?.at(-1)?.text || "Start a conversation";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-start gap-3 rounded-[1rem] px-3 py-3.5 text-left transition-all duration-200 ${
        isActive ? "bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" : "hover:bg-white/[0.04]"
      }`}
    >
      {/* Avatar with online dot */}
      <div className="relative shrink-0 mt-0.5">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${conversation.color || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]"}`}>
          {conversation.avatarUrl
            ? <img src={conversation.avatarUrl} alt="" className="h-full w-full rounded-2xl object-cover" />
            : (conversation.avatarInitials || conversation.initials || (conversation.name?.[0] ?? "R"))
          }
        </div>
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#010204] bg-[#c4e0a8]" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-[0.88rem] font-semibold text-white/90">{conversation.name}</span>
          <span className="shrink-0 text-[0.65rem] text-white/36">{conversation.time}</span>
        </div>
        <p className="mt-0.5 truncate text-[0.76rem] text-white/46 leading-snug">
          {lastMsg}
        </p>
        {conversation.offering && (
          <p className="mt-0.5 truncate text-[0.68rem] text-[#8dcde4]/60">
            {conversation.offering} ↔ {conversation.lookingFor}
          </p>
        )}
      </div>

      {/* Unread badge */}
      {unread > 0 && (
        <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8dcde4] px-1.5 text-[0.6rem] font-bold text-[#010204]">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}

function MessageBubble({ message, isMine, showDate, dateLabel, senderName }) {
  const isSystem = message.type === "system";
  const time = formatMsgTime(message.createdAt) || message.time || "";

  const statusIcon = isMine ? (
    message.isRead ? (
      <CheckCheck className="inline h-3 w-3 text-[#8dcde4]" />
    ) : message._failed ? (
      <WifiOff className="inline h-3 w-3 text-red-400" />
    ) : message._optimistic ? (
      <Clock className="inline h-3 w-3 text-white/30" />
    ) : (
      <Check className="inline h-3 w-3 text-white/40" />
    )
  ) : null;

  if (isSystem) {
    return (
      <>
        {showDate && dateLabel && (
          <div className="flex justify-center my-3">
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[0.68rem] text-white/40">{dateLabel}</span>
          </div>
        )}
        <div className="flex justify-center my-2">
          <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 text-[0.74rem] text-white/58 font-medium">
            {message.text}
          </span>
        </div>
      </>
    );
  }

  const isOffer = message.type === "offer" || (message.text && message.text.includes("TRADE OFFER"));

  if (isOffer) {
    const lines = message.text.split("\n");
    const youOfferLine = lines.find(l => l.toLowerCase().includes("you offer") || l.toLowerCase().includes("offers:"));
    const exchangeForLine = lines.find(l => l.toLowerCase().includes("exchange for") || l.toLowerCase().includes("wants:"));
    const statusLine = lines.find(l => l.toLowerCase().includes("status:"));

    const youOfferVal = youOfferLine ? (youOfferLine.includes(":") ? youOfferLine.split(":")[1]?.trim() : youOfferLine.replace(/you offer/gi, "").trim()) : "Items";
    const exchangeForVal = exchangeForLine ? (exchangeForLine.includes(":") ? exchangeForLine.split(":")[1]?.trim() : exchangeForLine.replace(/in exchange for/gi, "").trim()) : "Items";
    const statusVal = statusLine ? (statusLine.includes(":") ? statusLine.split(":")[1]?.trim() : "Pending") : "Pending";

    return (
      <>
        {showDate && dateLabel && (
          <div className="flex justify-center my-3">
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[0.68rem] text-white/40">{dateLabel}</span>
          </div>
        )}
        <div className={`flex ${isMine ? "justify-end" : "justify-start"} my-3`}>
          <div className="w-[85%] sm:w-[70%] rounded-[1.4rem] border border-[#8dcde4]/24 bg-[linear-gradient(180deg,rgba(14,26,45,0.72),rgba(6,12,22,0.64))] p-4 shadow-[0_24px_50px_rgba(0,0,0,0.3)] backdrop-blur-md text-left">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 mb-3">
              <ArrowLeftRight className="h-4 w-4 text-[#8dcde4]" strokeWidth={2.2} />
              <span className="text-[0.84rem] font-bold tracking-wider uppercase text-[#9ec1d0]">Active Trade Offer</span>
              <span className="ml-auto rounded-full bg-[#ffc75b]/12 px-2.5 py-0.5 text-[0.68rem] font-semibold text-[#ffc75b]">
                {statusVal}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.08em] text-white/34">Offered Resource(s)</p>
                <p className="mt-1 text-[0.82rem] font-semibold text-white/80 leading-relaxed">{youOfferVal}</p>
              </div>

              <div className="flex justify-center py-1">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              </div>

              <div>
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.08em] text-[#8dcde4]/50">Requested Resource(s)</p>
                <p className="mt-1 text-[0.82rem] font-semibold text-[#8dcde4] leading-relaxed">{exchangeForVal}</p>
              </div>
            </div>

            <p className="mt-3 flex items-center justify-end gap-1 text-[0.64rem] text-white/34 border-t border-white/[0.06] pt-2">
              {time} {statusIcon}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {showDate && dateLabel && (
        <div className="flex justify-center my-3">
          <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[0.68rem] text-white/40">{dateLabel}</span>
        </div>
      )}
      {!isMine && senderName && (
        <p className="mb-1 ml-1 text-[0.65rem] text-white/38">{senderName}</p>
      )}
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[78%] rounded-[1.1rem] border px-4 py-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.18)] ${
            isMine
              ? "border-white/12 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] text-[#081a22]"
              : "border-white/[0.08] bg-white/[0.05] text-white/76"
          } ${message._failed ? "opacity-60" : ""}`}
        >
          <p className="text-[0.88rem] leading-6 whitespace-pre-wrap">{message.text}</p>
          <p className={`mt-1 flex items-center gap-1 text-[0.64rem] ${isMine ? "text-[#081a22]/56 justify-end" : "text-white/34"}`}>
            {time} {statusIcon}
          </p>
        </div>
      </div>
    </>
  );
}

function TypingIndicator({ name }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
            className="h-1.5 w-1.5 rounded-full bg-[#8dcde4]/60"
          />
        ))}
      </div>
      <span className="text-[0.72rem] text-white/38">{name} is typing…</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Messages() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    mockConversations,
    setMockConversations,
    negotiations,
    openTraderProfileDrawer,
    showToast,
    archiveConversation,
    loadExchangeSessions,
    submitTraderFeedback,
    activeSessionId,
    setActiveSessionId,
    activeMessages,
    sendChatMessage,
    sendingMessage,
    onlineUsers,
    typingUsers,
    socket,
    backendUserId,
    isDemoMode,
  } = useRelay();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("Active Trades");
  const [activeId, setActiveId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("conversation") || null;
  });
  const [draft, setDraft] = useState("");
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);
  const [meetingLocation, setMeetingLocation] = useState("Madhurawada Crossroads, Visakhapatnam");
  const [meetingTime, setMeetingTime] = useState("");
  // Mobile: "list" | "chat"
  const [mobilePanel, setMobilePanel] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("conversation") ? "chat" : "list";
  });

  // Feedback Modal states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submittedFeedbackIds, setSubmittedFeedbackIds] = useState({});
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [accuracyAnswer, setAccuracyAnswer] = useState("Yes");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  // Sync activeId when URL changes (back/forward navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const convId = params.get("conversation");
    if (!convId || convId === activeId) return;

    // Avoid cascading renders by scheduling state updates.
    queueMicrotask(() => {
      setActiveId(convId);
      setActiveSessionId(convId);
      setMobilePanel("chat");
    });
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps


  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, typingUsers]);

  // Focus input when switching conversations
  useEffect(() => {
    if (mobilePanel === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeId, mobilePanel]);

  // Normalize negotiations into unified shape
  const normalizedNegotiations = useMemo(() =>
    negotiations.map((n) => ({
      ...n,
      id: n.id || n._id,
      name: n.name || n.ownerName || "Relay User",
      initials: n.initials || n.ownerInitials || getInitials(n.name || n.ownerName || "Relay User"),
      color: n.color || n.ownerColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
      isNegotiation: true,
    })),
    [negotiations]
  );

  const allConversations = useMemo(
    () => (isDemoMode ? mockConversations : normalizedNegotiations),
    [isDemoMode, mockConversations, normalizedNegotiations]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allConversations.filter((conversation) => {
      if (view === "Archived") {
        if (!conversation.archived) return false;
      } else {
        if (conversation.archived) return false;
      }
      if (filter === "Ongoing" && conversation.outcome !== TRADE_OUTCOME.NEGOTIATION_ACTIVE) return false;
      if (filter === "Completed" && conversation.outcome !== TRADE_OUTCOME.COMPLETED) return false;
      if (filter === "Declined" && conversation.outcome !== TRADE_OUTCOME.DECLINED) return false;
      if (q) {
        return (
          conversation.name?.toLowerCase().includes(q) ||
          conversation.offering?.toLowerCase().includes(q) ||
          conversation.lookingFor?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allConversations, query, view, filter]);

  // URL conversation ID always takes priority over defaultId fallback
  const urlConversationId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("conversation");
  }, [location.search]);

  const defaultId = filtered[0]?.id ?? allConversations[0]?.id;
  // If a URL conversation param exists, always honor it; otherwise fall back to first conversation
  const resolvedActiveId = urlConversationId || activeId || defaultId;

  useEffect(() => {
    if (resolvedActiveId && resolvedActiveId !== activeSessionId) {
      setActiveSessionId(resolvedActiveId);
    }
  }, [resolvedActiveId, activeSessionId, setActiveSessionId]);

  const activeConversation =
    allConversations.find((c) => String(c.id) === String(resolvedActiveId)) ||
    (urlConversationId ? null : filtered[0]) ||
    (urlConversationId ? null : allConversations[0]);


  const statusConfig = getTradeStatusConfig(activeConversation?.status, activeConversation?.outcome);
  const isLocked = statusConfig.locked;

  // Determine messages to show: prefer real backend activeMessages, fallback to conversation.messages
  const displayMessages = useMemo(() => {
    if (activeMessages.length > 0) return activeMessages;
    return activeConversation?.messages || [];
  }, [activeMessages, activeConversation]);

  // Determine the OTHER participant's userId (exclude self) for online check
  const otherUserId = useMemo(() => {
    if (!activeConversation) return null;
    // Prefer explicit otherUserId attached by normalization
    if (activeConversation.otherUserId && activeConversation.otherUserId !== backendUserId) {
      return activeConversation.otherUserId;
    }
    // Fallback: pick the participant that is NOT the current user
    const ids = [activeConversation.receiverId, activeConversation.initiatorId].filter(Boolean);
    return String(ids.find(id => String(id) !== String(backendUserId)) || ids[0] || "");
  }, [activeConversation, backendUserId]);
  const isOtherOnline = otherUserId ? Boolean(onlineUsers[otherUserId]) : false;
  const isOtherTyping = activeConversation?.id
    ? Boolean(typingUsers[activeConversation.id] || typingUsers[resolvedActiveId])
    : false;

  // ── Typing emit ────────────────────────────────────────────────────────────
  const handleDraftChange = useCallback((value) => {
    setDraft(value);
    if (!socket || !resolvedActiveId || !backendUserId) return;
    socket.emit("typing_start", { sessionId: resolvedActiveId, userId: backendUserId });
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("typing_stop", { sessionId: resolvedActiveId, userId: backendUserId });
    }, 1500);
  }, [socket, resolvedActiveId, backendUserId]);

  // ── Send message ───────────────────────────────────────────────────────────
  async function handleSend() {
    const text = draft.trim();
    if (!text || isLocked || !activeConversation) return;
    setDraft("");
    clearTimeout(typingTimerRef.current);

    await sendChatMessage(resolvedActiveId, text);
  }

  // ── Meeting scheduler ──────────────────────────────────────────────────────
  async function changeTradeStatus(status, extraData = {}) {
    if (!activeConversation) return;

    if (isDemoMode) {
      setMockConversations((prev) =>
        prev.map((c) =>
          String(c.id) === String(activeConversation.id)
            ? {
                ...c,
                status,
                outcome: status === "completed" ? TRADE_OUTCOME.COMPLETED : (status === "declined" ? TRADE_OUTCOME.DECLINED : c.outcome),
                ...extraData,
              }
            : c
        )
      );
      showToast("Trade Updated", `Status updated to ${status} locally.`);
      return;
    }

    try {
      await api.updateExchangeSessionStatus(activeConversation.id, {
        status,
        ...extraData,
      });
      showToast("Trade Updated", "The counterparty was notified of this change.");
      await loadExchangeSessions();
    } catch (err) {
      showToast("Failed to update status", err.message || "Could not update status.", "error");
    }
  }

  async function saveMeetingSchedule() {
    const timeStr = meetingTime ? new Date(meetingTime).toISOString() : new Date().toISOString();
    await changeTradeStatus("meeting_scheduled", {
      meetingLocation,
      meetingTime: timeStr,
    });
    setShowSchedulerModal(false);
    showToast("Meeting Scheduled", `Handoff coordinates locked at ${meetingLocation}!`);
  }

  async function handleQuickAction(action) {
    if (!activeConversation) return;

    if (action.id === "accept") {
      await changeTradeStatus("offer_accepted");
      return;
    }
    if (action.id === "counter") {
      await changeTradeStatus("counter_offered");
      return;
    }
    if (action.id === "reject") {
      await changeTradeStatus("declined");
      return;
    }
    if (action.id === "schedule") {
      setShowSchedulerModal(true);
      return;
    }
    if (action.id === "handoff") {
      await changeTradeStatus("resources_exchanged");
      return;
    }
    if (action.id === "complete") {
      await changeTradeStatus("completed");
      return;
    }
  }

  function openTraderProfile(conversation) {
    // Use the stable otherUserId already resolved
    const uid = conversation?.otherUserId ||
      [conversation?.receiverId, conversation?.initiatorId]
        .filter(Boolean)
        .find(id => String(id) !== String(backendUserId));
    if (uid) {
      navigate(`/profile/${uid}`);
      return;
    }
    openTraderProfileDrawer({
      conversationId: conversation.id,
      name: conversation.name,
      tradeOutcome: conversation.outcome,
      tradeResource: `${conversation.offering} ↔ ${conversation.lookingFor}`,
      tradeDate: conversation.completedDate || conversation.time,
    });
  }

  function handleFooterAction(actionId) {
    if (!activeConversation) return;
    if (actionId === "archive") {
      archiveConversation(activeConversation.id);
      return;
    }
    if (actionId === "summary") {
      showToast("Trade Summary", `${activeConversation.offering} ↔ ${activeConversation.lookingFor}`);
      return;
    }
    if (actionId === "feedback") {
      setFeedbackRating(5);
      setFeedbackText("");
      setSelectedTags([]);
      setAccuracyAnswer("Yes");
      setFeedbackError("");
      setShowFeedbackModal(true);
      return;
    }
    if (actionId === "browse") {
      navigate("/dashboard/marketplace");
      return;
    }
  }

  function selectConversation(id) {
    setActiveId(id);
    setMobilePanel("chat");
    setActiveSessionId(id);
  }

  // Date separator tracking
  const messagesWithDates = useMemo(() => {
    const result = [];
    let lastDate = null;
    displayMessages.forEach((msg) => {
      const date = msg.createdAt ? new Date(msg.createdAt).toDateString() : null;
      const showDate = date && date !== lastDate;
      if (showDate) lastDate = date;
      result.push({ msg, showDate, dateLabel: showDate ? getDateLabel(msg.createdAt) : null });
    });
    return result;
  }, [displayMessages]);

  if (!activeConversation && allConversations.length === 0) {
    return (
      <div className="relative min-h-screen text-white">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
        <Navbar />
        <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
          <MessageCircle className="h-14 w-14 text-white/20 mb-4" strokeWidth={1.2} />
          <p className="text-white/50 text-center">No conversations yet.</p>
          <p className="mt-2 text-sm text-white/30 text-center">Start a negotiation from the Marketplace to chat here.</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/marketplace")}
            className="mt-6 rounded-full bg-[#8dcde4] px-6 py-2.5 text-sm font-semibold text-[#081a22]"
          >
            Browse Marketplace
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.34)_0%,rgba(2,7,12,0.24)_18%,rgba(0,0,0,0.32)_54%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(141,205,228,0.06)_0%,transparent_50%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1180px] px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        {/* Header — hidden on mobile chat panel */}
        <motion.section
          {...reveal(shouldReduceMotion, 0)}
          aria-labelledby="negotiations-title"
          className={`mb-6 ${mobilePanel === "chat" ? "hidden lg:block" : ""}`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9ec1d0]">Trade Negotiations</p>
          <h1
            id="negotiations-title"
            className="mt-2 font-serif text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.05em] text-white"
          >
            Discuss every exchange clearly.
          </h1>
          <p className="mt-2 max-w-[36rem] text-[0.98rem] leading-[1.7] text-white/60">
            Negotiate offers, verify details, and schedule safe local handoffs.
          </p>
        </motion.section>

        {/* Two-panel layout */}
        <motion.div
          {...reveal(shouldReduceMotion, 0.08)}
          className="grid min-h-[calc(100vh-14rem)] gap-4 lg:grid-cols-[0.85fr_1.55fr]"
        >
          {/* LEFT — Conversation List */}
          <GlassCard
            className={`flex flex-col px-4 py-4 ${mobilePanel === "chat" ? "hidden lg:flex" : "flex"}`}
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="Search conversations…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] py-2.5 pl-10 pr-4 text-[0.86rem] text-white outline-none placeholder-white/30 transition-all focus:border-white/20 focus:bg-white/[0.06]"
              />
            </div>

            {/* Filters */}
            <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-[1rem] border border-white/[0.07] bg-white/[0.03] p-1.5">
              {FILTERS.map((item) => {
                const active = filter === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`relative rounded-[0.7rem] px-2 py-1.5 text-[0.74rem] font-medium transition-colors ${active ? "text-white" : "text-white/44 hover:text-white/74"}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="messages-filter"
                        className="absolute inset-0 rounded-[0.7rem] bg-white/[0.09]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative">{item}</span>
                  </button>
                );
              })}
            </div>

            {/* Archive toggle */}
            <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-[1rem] border border-white/[0.07] bg-white/[0.03] p-1.5">
              {["Active Trades", "Archived"].map((item) => {
                const active = view === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setView(item)}
                    className={`relative rounded-[0.7rem] px-2 py-1.5 text-[0.74rem] font-medium transition-colors ${active ? "text-white" : "text-white/44 hover:text-white/74"}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="messages-view"
                        className="absolute inset-0 rounded-[0.7rem] bg-white/[0.09]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative">{item}</span>
                  </button>
                );
              })}
            </div>

            {/* List */}
            <div className="mt-3 flex-1 space-y-1 overflow-y-auto">
              {filtered.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  isOnline={Boolean(onlineUsers[conversation.receiverId] || onlineUsers[conversation.initiatorId])}
                  onClick={() => selectConversation(conversation.id)}
                />
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-[0.82rem] text-white/36">No conversations in this filter.</p>
              )}
            </div>
          </GlassCard>

          {/* RIGHT — Chat Panel */}
          <GlassCard className={`flex flex-col min-h-[42rem] ${mobilePanel === "list" ? "hidden lg:flex" : "flex"}`}>
            {/* Chat Header */}
            <div className="relative border-b border-white/[0.06] px-4 py-4">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <button
                  type="button"
                  onClick={() => setMobilePanel("list")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-white/[0.06] lg:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-4 w-4 text-white/60" strokeWidth={2} />
                </button>

                {/* User info — clickable to profile */}
                <button
                  type="button"
                  onClick={() => openTraderProfile(activeConversation)}
                  className="flex flex-1 items-center gap-3 text-left hover:opacity-90 transition-opacity"
                >
                  <div className="relative shrink-0">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold ${activeConversation?.color || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]"}`}>
                      {activeConversation?.avatarUrl
                        ? <img src={activeConversation.avatarUrl} alt="" className="h-full w-full rounded-2xl object-cover" />
                        : (activeConversation?.avatarInitials || activeConversation?.initials || activeConversation?.name?.[0] || "R")
                      }
                    </div>
                    {isOtherOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#010204] bg-[#c4e0a8]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[0.95rem] font-semibold tracking-tight text-white/94">
                        {activeConversation?.name}
                      </h2>
                      <span className="flex items-center gap-1 rounded-full bg-[rgba(141,205,228,0.1)] px-2 py-0.5 text-[0.62rem] font-semibold text-[#8dcde4]">
                        <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2} />
                        Verified
                      </span>
                    </div>
                    <p className={`mt-0.5 text-[0.74rem] ${isOtherOnline ? "text-[#c4e0a8]" : "text-white/40"}`}>
                      {isOtherOnline ? "● Online" : activeConversation?.status || "Last seen recently"}
                    </p>
                  </div>
                </button>

                {/* View Profile + Exchange pair */}
                <div className="hidden xl:flex items-center gap-2 ml-auto">
                  <div className="rounded-[0.8rem] border border-white/[0.07] bg-white/[0.035] px-3 py-2">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white/34">Exchange</p>
                    <p className="mt-0.5 text-[0.8rem] font-medium text-white/82">
                      {activeConversation?.offering} ↔ {activeConversation?.lookingFor}
                    </p>
                  </div>
                  <TradeTimeline outcome={activeConversation?.outcome} status={activeConversation?.status} compact />
                </div>
              </div>

              {/* Trade status chip below on small xl */}
              <div className="mt-3 flex items-center gap-2 xl:hidden">
                <TradeStatusChip outcome={activeConversation?.outcome} />
                {activeConversation?.offering && (
                  <p className="truncate text-[0.74rem] text-white/40">
                    {activeConversation.offering} ↔ {activeConversation.lookingFor}
                  </p>
                )}
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
              {activeConversation?.status === "meeting_scheduled" && (
                <HandoffMap
                  locationName={activeConversation.meetingLocation}
                  timeText={activeConversation.meetingTime}
                  otherTraderName={activeConversation.name}
                />
              )}

              {messagesWithDates.map(({ msg, showDate, dateLabel }, index) => {
                const isMine =
                  msg.from === "me" ||
                  (backendUserId && String(msg.senderId) === String(backendUserId));

                return (
                  <MessageBubble
                    key={msg._id || index}
                    message={msg}
                    isMine={isMine}
                    showDate={showDate}
                    dateLabel={dateLabel}
                    senderName={!isMine ? activeConversation?.name : null}
                  />
                );
              })}

              {/* Typing indicator */}
              <AnimatePresence>
                {isOtherTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                  >
                    <TypingIndicator name={activeConversation?.name || "Them"} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className="border-t border-white/[0.06] px-4 py-4">
              {/* Quick actions for active negotiations */}
              {activeConversation?.outcome === TRADE_OUTCOME.NEGOTIATION_ACTIVE && statusConfig.quickActions?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {statusConfig.quickActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,199,91,0.16)] bg-[rgba(255,199,91,0.08)] px-3 py-1.5 text-[0.72rem] font-medium text-[#ffc75b] transition-colors hover:bg-[rgba(255,199,91,0.14)]"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {isLocked ? (
                <div className="rounded-[1.15rem] border border-white/[0.08] bg-white/[0.03] px-4 py-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[0.9rem] font-semibold text-white/84">{statusConfig.footerMessage}</p>
                      {activeConversation?.outcome === TRADE_OUTCOME.COMPLETED && activeConversation.completedDate && (
                        <p className="mt-1 text-[0.76rem] text-white/40">Completed on {activeConversation.completedDate}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statusConfig.footerActions?.map((action) => {
                        const isFeedback = action.id === "feedback";
                        const hasReviewed = activeConversation?.hasReviewed || submittedFeedbackIds[activeConversation?.id];
                        const label = isFeedback && hasReviewed ? "Feedback Submitted" : action.label;
                        const disabled = isFeedback && hasReviewed;

                        return (
                          <button
                            key={action.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleFooterAction(action.id)}
                            className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-[0.74rem] font-medium transition-colors ${
                              disabled
                                ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                                : activeConversation?.outcome === TRADE_OUTCOME.COMPLETED
                                ? "border-[rgba(196,224,168,0.18)] bg-[rgba(196,224,168,0.08)] text-[#c4e0a8] hover:bg-[rgba(196,224,168,0.14)]"
                                : "border-white/[0.08] bg-white/[0.04] text-white/58 hover:bg-white/[0.07]"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-2 rounded-[1.15rem] border border-white/[0.09] bg-white/[0.04] px-3 py-2">
                  <button
                    type="button"
                    aria-label="Emoji"
                    onClick={() => showToast("Emoji", "Emoji reactions coming soon.")}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80"
                  >
                    <Smile className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    aria-label="Attach"
                    onClick={() => showToast("Attachment", "File attachments coming soon.")}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80"
                  >
                    <Paperclip className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    aria-label="Image"
                    onClick={() => showToast("Images", "Image upload coming soon.")}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80"
                  >
                    <ImagePlus className="h-4 w-4" strokeWidth={1.8} />
                  </button>

                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={draft}
                    onChange={(e) => {
                      handleDraftChange(e.target.value);
                      // Auto-resize
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Message about this trade… (Enter to send, Shift+Enter for new line)"
                    className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-[0.88rem] text-white outline-none placeholder-white/28 leading-relaxed"
                    style={{ maxHeight: 120 }}
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim() || sendingMessage}
                    aria-label="Send"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] text-[#081a22] shadow-[0_8px_20px_rgba(112,152,174,0.2)] transition-opacity disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </main>

      {/* Meeting Scheduler Modal */}
      <AnimatePresence>
        {showSchedulerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0e1624] p-6 shadow-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold text-white">Schedule Safe Handoff</h3>
              <p className="mt-2 text-xs text-white/50">Choose a public place (e.g. library, cafe) for direct value verification.</p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40 block">Handoff Location</label>
                  <input
                    type="text"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#8dcde4] focus:outline-none"
                    placeholder="e.g. MVP Colony Library"
                  />
                </div>
                <div>
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40 block">Meeting Time</label>
                  <input
                    type="datetime-local"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#c4e0a8]/20 bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-[#8dcde4] focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSchedulerModal(false)}
                  className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveMeetingSchedule}
                  className="rounded-xl bg-[#8dcde4] px-5 py-2 text-sm font-semibold text-[#081a22] hover:bg-[#aee0f2]"
                >
                  Schedule Coordinates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Leave Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0e1624] p-6 shadow-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold text-white">How was your exchange with {activeConversation?.name}?</h3>
              <p className="mt-1 text-xs text-white/50 font-medium">Your rating helps verify members and keep the community secure.</p>

              {feedbackError && (
                <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-400">
                  {feedbackError}
                </div>
              )}

              <div className="mt-4 space-y-4">
                {/* Clickable Star Rating */}
                <div>
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40 block mb-1.5">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= feedbackRating ? "text-[#ffc75b]" : "text-white/20 hover:text-white/40"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-semibold text-[#ffc75b]">
                      {feedbackRating === 1 && "1 — Poor"}
                      {feedbackRating === 2 && "2 — Fair"}
                      {feedbackRating === 3 && "3 — Good"}
                      {feedbackRating === 4 && "4 — Very Good"}
                      {feedbackRating === 5 && "5 — Excellent"}
                    </span>
                  </div>
                </div>

                {/* Feedback Tags */}
                <div>
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40 block mb-1.5 font-bold">Feedback Tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Friendly", "Quick Response", "Item as Described", "Reliable",
                      "Easy Handoff", "Good Communication", "On Time", "Trustworthy"
                    ].map((tag) => {
                      const selected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (selected) {
                              setSelectedTags((prev) => prev.filter((t) => t !== tag));
                            } else {
                              setSelectedTags((prev) => [...prev, tag]);
                            }
                          }}
                          className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium border transition-colors ${
                            selected
                              ? "bg-[#8dcde4]/10 border-[#8dcde4]/30 text-[#8dcde4]"
                              : "bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white/70"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description Accuracy Confirmation */}
                <div>
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40 block mb-1.5">Was the resource accurately described?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yes", "Mostly", "No"].map((option) => {
                      const selected = accuracyAnswer === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setAccuracyAnswer(option)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition-colors ${
                            selected
                              ? "bg-[#c4e0a8]/10 border-[#c4e0a8]/30 text-[#c4e0a8]"
                              : "bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.06]"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Written review textarea */}
                <div>
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40 block mb-1.5">Written Review (Optional)</label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Share your experience with this Relay member..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#8dcde4] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setFeedbackError("");
                    setSubmittingFeedback(true);
                    try {
                      const otherUserId = activeConversation?.receiverId || activeConversation?.initiatorId;
                      if (!otherUserId) {
                        throw new Error("Could not resolve reviewed user ID.");
                      }
                      
                      await submitTraderFeedback(otherUserId, {
                        starRating: feedbackRating,
                        comment: feedbackText,
                        tags: selectedTags,
                        accuracy: accuracyAnswer,
                        tradeId: activeConversation.id,
                        conversationId: activeConversation.id,
                        title: "Completed Swap Review"
                      });

                      setSubmittedFeedbackIds((prev) => ({ ...prev, [activeConversation.id]: true }));
                      setShowFeedbackModal(false);
                      showToast("Feedback Submitted", "Your review and rating updates are now live.");
                    } catch (err) {
                      setFeedbackError(err.message || "Failed to submit review. Try again.");
                    } finally {
                      setSubmittingFeedback(false);
                    }
                  }}
                  disabled={submittingFeedback}
                  className="rounded-xl bg-[#8dcde4] px-5 py-2 text-sm font-semibold text-[#081a22] hover:bg-[#aee0f2] disabled:opacity-50"
                >
                  {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
