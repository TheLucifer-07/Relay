/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { authService } from "../lib/auth";
import { api } from "../lib/api";
import { getInitials } from "../utils/initials";
import { TRADE_OUTCOME } from "../data/tradeStatusConfig";
import {
  demoMarketplaceListingsSeed,
  demoConversationsSeed,
  demoIncomingRequestsSeed,
  demoOutgoingRequestsSeed,
  demoCompletedTradesSeed,
  demoNotificationsSeed,
  demoAuctionsSeed,
  demoCurrentUserResourcesSeed,
  demoRequestsSeed,
} from "../data/demoSeeds";

const currentUserProfileSeed = {
  name: "Relay User",
  initials: "RU",
  city: "Your city",
  memberSince: "Just joined",
  trustScore: 0,
  successfulTrades: 0,
  successRate: "0%",
  responseTime: "—",
  aiVerification: "—",
  email: "",
  phone: "",
  preference: "Nearby only",
  notificationsEnabled: true,
};

function getUserId(userLike) {
  return userLike?.id || userLike?._id || userLike?.uid || null;
}

function normalizeListing(listing) {
  const id = String(listing?._id || listing?.id || "");
  return {
    id,
    category: listing?.category || "More",
    title: listing?.title || "Relay Listing",
    desc: listing?.description || `${listing?.condition || "Good"} · AI verified`,
    owner: listing?.ownerProfile?.name || listing?.ownerName || "Relay User",
    distance: listing?.distance || "0.2 km",
    rating: listing?.rating ?? 4.9,
    verified: listing?.verified ?? true,
    availability: listing?.availability || "Available now",
    status: listing?.status || "Ready to Negotiate",
    value: listing?.value || "Open to fair exchange",
    badge: listing?.badge || null,
    detailLabel: listing?.detailLabel || "Condition",
    detailValue: listing?.detailValue || listing?.condition || "Good",
    offering: listing?.title || "Relay Listing",
    lookingFor: listing?.lookingFor || "Open to fair exchange",
    condition: listing?.condition || "Good",
    quality: listing?.quality || listing?.condition || "Good",
    description: listing?.description || "",
    ownerNotes: listing?.ownerNotes || "Ready for a Relay exchange.",
    verificationStatus: listing?.verificationStatus || "AI Verified",
    ownerId: listing?.userId?._id || listing?.userId || listing?.ownerId || null,
    ownerProfile: {
      initials: getInitials(listing?.ownerProfile?.name || listing?.ownerName || "Relay User"),
      avatarColor: listing?.ownerProfile?.avatarColor || "bg-[rgba(255,159,113,0.16)] text-[#ff9f71]",
      joinedSince: listing?.ownerProfile?.joinedSince || "Recently joined",
      completedTrades: listing?.ownerProfile?.completedTrades || 0,
      responseTime: listing?.ownerProfile?.responseTime || "10 min",
      tradeHistory: listing?.ownerProfile?.tradeHistory || "Verified Relay member",
    },
    lookingForDetails: listing?.lookingForDetails || {
      preferredCategories: [listing?.category || "More"],
      estimatedValue: listing?.value || "Open to fair exchange",
      conditionPreference: "Fair or better",
      openToNegotiation: true,
      openToMultipleItems: true,
      nearbyOnly: true,
    },
    __backendId: listing?._id || listing?.id,
  };
}

function normalizeProfile(profile, authUser) {
  const displayName = profile?.name || profile?.displayName || authUser?.displayName || "Relay User";
  const initials = getInitials(displayName);

  return {
    name: displayName,
    initials,
    city: profile?.location || "Visakhapatnam",
    memberSince: profile?.memberSince || "Jan 2025",
    trustScore: profile?.trustScore ?? 98,
    successfulTrades: profile?.successfulTrades ?? 104,
    successRate: profile?.successRate || "98%",
    responseTime: profile?.responseTime || "12m",
    aiVerification: "100%",
    email: profile?.email || authUser?.email || "ananya@relay.app",
    phone: profile?.phone || "+91 98765 43210",
    preference: profile?.preferences?.preference || "Nearby only",
    notificationsEnabled: profile?.preferences?.notificationsEnabled ?? true,
    avatarColor: profile?.avatarColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
  };
}

function normalizeNotification(notification) {
  return {
    id: notification?._id || notification?.id,
    title: notification?.title || "Relay update",
    detail: notification?.detail || "New activity",
    time: notification?.createdAt ? new Date(notification.createdAt).toLocaleString("en", { hour: "numeric", minute: "2-digit" }) : "Now",
    unread: notification?.unread ?? true,
  };
}

function formatRelativeTime(date) {
  if (!date) return "Just now";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getTradeStatusLabel(status) {
  switch (status) {
    case "pending": return "Trade requested";
    case "negotiation_active": return "Negotiation Active";
    case "offer_sent": return "Offer sent";
    case "counter_offered": return "Counter offer";
    case "accepted": return "Offer Accepted";
    case "meeting_scheduled": return "Meeting Scheduled";
    case "completed": return "Completed";
    default: return "In Progress";
  }
}

function normalizeSessionToRequest(session) {
  const otherProfile = session.otherProfile || {};
  const offeredText = session.offeredItems?.length
    ? session.offeredItems.map(i => i.title).join(" + ")
    : "Open value exchange";
  const name = otherProfile.displayName || "Relay User";
  return {
    id: String(session._id || session.id),
    tradeId: String(session.listingId?._id || session.listingId || ""),
    name,
    initials: getInitials(name),
    color: otherProfile.avatarColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
    offering: offeredText,
    lookingFor: session.listingId?.title || "Relay Listing",
    distance: otherProfile.city ? "Nearby" : "0.2 km",
    time: session.updatedAt ? formatRelativeTime(session.updatedAt) : "Just now",
    status: session.status,
  };
}

function normalizeSessionToOngoing(session) {
  return {
    ...normalizeSessionToRequest(session),
    progress: getTradeStatusLabel(session.status),
  };
}

function normalizeSessionToCompleted(session) {
  const otherProfile = session.otherProfile || {};
  const name = otherProfile.displayName || "Relay User";
  return {
    id: String(session._id || session.id),
    name,
    initials: getInitials(name),
    color: otherProfile.avatarColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
    offering: session.offeredItems?.length ? session.offeredItems.map(i => i.title).join(" + ") : "Open exchange",
    lookingFor: session.listingId?.title || "Relay Listing",
    completed: session.completedAt ? new Date(session.completedAt).toLocaleDateString() : "Today",
    rating: "★★★★★",
    feedback: "Trade completed successfully.",
  };
}

function normalizeSessionToConversation(session, currentUserId) {
  const otherProfile = session.otherProfile || {};
  let outcome = TRADE_OUTCOME.NEGOTIATION_ACTIVE;
  if (session.status === "completed") outcome = TRADE_OUTCOME.COMPLETED;
  if (session.status === "declined" || session.status === "cancelled") outcome = TRADE_OUTCOME.DECLINED;

  const fallbackName = session.listingId?.ownerProfile?.name || session.listingId?.ownerName || session.sourceTitle || "Relay User";
  const name = otherProfile.displayName || fallbackName;

  const initId = session.initiatorId?._id || session.initiatorId;
  const recvId = session.receiverId?._id || session.receiverId;
  const otherUserId = otherProfile.userId || otherProfile._id || 
    (String(initId) === String(currentUserId) ? recvId : initId);

  const lookingFor = session.listingId?.title || session.sourceTitle || session.lookingFor || "Relay Listing";
  const fallbackColor = session.listingId?.ownerProfile?.avatarColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]";

  return {
    id: String(session._id || session.id),
    name,
    initials: getInitials(name),
    color: otherProfile.avatarColor || fallbackColor,
    time: session.updatedAt ? formatRelativeTime(session.updatedAt) : "Just now",
    outcome,
    unread: session.unreadCount || 0,
    offering: session.offeredItems?.length ? session.offeredItems.map(i => i.title).join(" + ") : "Open offer",
    lookingFor,
    lastMessage: session.lastMessage || "No messages yet",
    initiatorId: initId,
    receiverId: recvId,
    otherUserId: String(otherUserId || ""),
    otherProfile: otherProfile,
  };
}

function getContextualReply(displayName, lookingForText, offeringText) {
  const nameLower = (displayName || "").toLowerCase();
  const lookingLower = (lookingForText || "").toLowerCase();
  const offeringLower = (offeringText || "").toLowerCase();

  if (nameLower.includes("aditya")) {
    if (offeringLower.includes("clean code") || offeringLower.includes("javascript")) {
      return `Hi! "${offeringText}" sounds really useful. What condition is the book in? Let's negotiate a meetup.`;
    }
    return `Hi! I am indeed looking for a book on UX design or similar tech resources. What specific book are you offering?`;
  }
  
  if (nameLower.includes("meera")) {
    if (offeringLower.includes("ipad") || offeringLower.includes("laptop")) {
      return `Hi! Trading for your "${offeringText}" sounds great. Where would you be available to meet in Visakhapatnam?`;
    }
    return `Yes, the Electric Kick Scooter is still available and ready to trade! What would you like to offer in exchange?`;
  }
  
  if (nameLower.includes("nisha")) {
    return `Hi! I'm looking for a discount coupon or gift voucher. What coupon or voucher do you have available?`;
  }
  
  if (nameLower.includes("vikram")) {
    return `Hi! Yes, I'm looking to borrow a hand drill or other home tools. Do you have a working tool set to offer?`;
  }
  
  if (lookingLower.includes("scooter") || lookingLower.includes("kick")) {
    return `Yes, the scooter is available. What items are you offering for swap?`;
  }
  
  if (lookingLower.includes("book") || lookingLower.includes("habits") || lookingLower.includes("read")) {
    return `Hi! Yes, I am interested in swapping books. Which one do you have?`;
  }
  
  return `Hi! Thanks for the message. That trade sounds interesting. What condition is your item in?`;
}

const RelayContext = createContext(null);

export function RelayProvider({ children }) {
  const navigate = useNavigate();
  // Mode flag selection
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const pathDemo = window.location.pathname.startsWith("/demo") || window.location.pathname.startsWith("/dashboard/demo");
    const storedDemo = localStorage.getItem("relay-demo-mode") === "true";
    return params.get("mode") === "demo" || pathDemo || storedDemo;
  });

  // Base state hook configurations
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [ongoingTrades, setOngoingTrades] = useState([]);
  const [completedTrades, setCompletedTrades] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUserResources, setCurrentUserResources] = useState([]);
  const [mockConversations, setMockConversations] = useState([]);
  const [auctionListings, setAuctionListings] = useState([]);
  const [bookmarkedListingIds, setBookmarkedListingIds] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(currentUserProfileSeed);

  // Non-persisted UI states
  const [exchangeSessions, setExchangeSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isStartingNegotiation, setIsStartingNegotiation] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [negotiationDrawer, setNegotiationDrawer] = useState({ open: false });
  const [declinedTrades] = useState([]);
  const [traderProfiles, setTraderProfiles] = useState({});
  const [traderProfileDrawer, setTraderProfileDrawer] = useState({ open: false });
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [backendUserId, setBackendUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [demoUnlockModalOpen, setDemoUnlockModalOpen] = useState(false);
  // Online presence: userId → true
  const [onlineUsers, setOnlineUsers] = useState({});
  // Typing: sessionId → userId that is typing
  const [typingUsers, setTypingUsers] = useState({});
  // Whether we're currently sending (prevents double-send)
  const [sendingMessage, setSendingMessage] = useState(false);
  const [offerSelectionModalOpen, setOfferSelectionModalOpen] = useState(false);
  const [pendingOfferPayload, setPendingOfferPayload] = useState(null);

  const isAuthenticated = Boolean(authUser);
  const bookmarkedListings = marketplaceListings.filter((listing) => bookmarkedListingIds.includes(listing.id));

  const activeSessionIdRef = useRef(null);
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  const backendUserIdRef = useRef(null);
  useEffect(() => {
    backendUserIdRef.current = backendUserId;
  }, [backendUserId]);

  // Join session room when active conversation changes
  useEffect(() => {
    if (!socket || !activeSessionId) return;
    socket.emit("join-session", activeSessionId);
    return () => {
      socket.emit("leave-session", activeSessionId);
    };
   
  }, [activeSessionId, socket]);

  // Handle unauthorized redirect event from http client
  useEffect(() => {
    const handleUnauthorized = () => {
      void signOutUser();
    };
    window.addEventListener("relay-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("relay-unauthorized", handleUnauthorized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  // ────────────────────────────────────────────────────────────────────────────
  // GUEST DEMO MODE MANAGEMENT
  // ────────────────────────────────────────────────────────────────────────────

  // Reusable function that always seeds fresh demo data (bypasses stale localStorage)
  function seedDemoData() {
    setAuthUser({
      id: "demo-guest-user-id",
      email: "explorer@relay.app",
      displayName: "Relay Explorer",
      photoURL: null,
    });
    setBackendUserId("demo-guest-user-id");
    setAuthLoading(false);
    setMarketplaceListings(demoMarketplaceListingsSeed);
    setMyListings([]);
    setIncomingRequests(demoIncomingRequestsSeed);
    setOutgoingRequests(demoOutgoingRequestsSeed);
    setOngoingTrades(demoConversationsSeed.map(c => ({
      id: c.id,
      tradeId: c.tradeId,
      name: c.name,
      initials: c.initials,
      color: c.color,
      offering: c.offering,
      lookingFor: c.lookingFor,
      distance: c.location,
      time: c.time,
      progress: getTradeStatusLabel(c.outcome === TRADE_OUTCOME.COMPLETED ? "completed" : "negotiation_active"),
      status: "negotiation_active"
    })));
    setCompletedTrades(demoCompletedTradesSeed);
    setNotifications(demoNotificationsSeed);
    setMockConversations(demoConversationsSeed);
    setAuctionListings(demoAuctionsSeed);
    setBookmarkedListingIds([]);
    setCurrentUserProfile({
      name: "Relay Explorer",
      initials: "RE",
      city: "Visakhapatnam",
      memberSince: "Jan 2025",
      trustScore: 98,
      successfulTrades: 47,
      successRate: "98%",
      responseTime: "5 min",
      aiVerification: "100%",
      email: "explorer@relay.app",
      phone: "+91 98765 43210",
      preference: "Nearby only",
      notificationsEnabled: true,
      avatarColor: "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
    });
    setCurrentUserResources(demoCurrentUserResourcesSeed);
  }

  // enterDemoMode: called imperatively from UI (Watch Demo button)
  function enterDemoMode() {
    // Clear any stale demo snapshot so user always gets fresh seed data
    localStorage.removeItem("relay-demo-state-v1");
    localStorage.setItem("relay-demo-mode", "true");
    setIsDemoMode(true);
    seedDemoData();
  }

  useEffect(() => {
    if (isDemoMode) {
      localStorage.setItem("relay-demo-mode", "true");
      
      setTimeout(() => {
        setAuthUser({
          id: "demo-guest-user-id",
          email: "explorer@relay.app",
          displayName: "Relay Explorer",
          photoURL: null,
        });
        setBackendUserId("demo-guest-user-id");
        setAuthLoading(false);

        // Try restoring from localStorage, but only if it has valid data
        const stored = localStorage.getItem("relay-demo-state-v1");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            // Only restore if marketplace has content — otherwise seed fresh
            if ((parsed.marketplaceListings || []).length > 10) {
              setMarketplaceListings(parsed.marketplaceListings);
              setMyListings(parsed.myListings || []);
              setIncomingRequests(parsed.incomingRequests?.length > 0 ? parsed.incomingRequests : demoIncomingRequestsSeed);
              setOutgoingRequests(parsed.outgoingRequests?.length > 0 ? parsed.outgoingRequests : demoOutgoingRequestsSeed);
              setOngoingTrades(parsed.ongoingTrades?.length > 0 ? parsed.ongoingTrades : demoConversationsSeed.map(c => ({
                id: c.id, tradeId: c.tradeId, name: c.name, initials: c.initials, color: c.color,
                offering: c.offering, lookingFor: c.lookingFor, distance: c.location, time: c.time,
                progress: getTradeStatusLabel("negotiation_active"), status: "negotiation_active"
              })));
              setCompletedTrades(parsed.completedTrades?.length > 0 ? parsed.completedTrades : demoCompletedTradesSeed);
              setNotifications(parsed.notifications?.length > 0 ? parsed.notifications : demoNotificationsSeed);
              setMockConversations(parsed.mockConversations?.length > 0 ? parsed.mockConversations : demoConversationsSeed);
              setAuctionListings(parsed.auctionListings?.length > 0 ? parsed.auctionListings : demoAuctionsSeed);
              setBookmarkedListingIds(parsed.bookmarkedListingIds || []);
              setCurrentUserProfile(parsed.currentUserProfile?.name ? parsed.currentUserProfile : {
                name: "Relay Explorer", initials: "RE", city: "Visakhapatnam", memberSince: "Jan 2025",
                trustScore: 98, successfulTrades: 47, successRate: "98%", responseTime: "5 min",
                aiVerification: "100%", email: "explorer@relay.app", phone: "+91 98765 43210",
                preference: "Nearby only", notificationsEnabled: true,
                avatarColor: "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
              });
              setCurrentUserResources(parsed.currentUserResources?.length > 0 ? parsed.currentUserResources : demoCurrentUserResourcesSeed);
              return;
            }
          } catch (e) {
            console.error("Failed to load demo snapshot:", e);
          }
        }

        // Always fall back to full fresh seeds
        seedDemoData();
      }, 0);
    }
   
  }, [isDemoMode]);

  // Auto-persist demo changes to localStorage
  useEffect(() => {
    if (!isDemoMode) return;
    const snapshot = {
      marketplaceListings,
      myListings,
      incomingRequests,
      outgoingRequests,
      ongoingTrades,
      completedTrades,
      notifications,
      mockConversations,
      auctionListings,
      bookmarkedListingIds,
      currentUserProfile,
      currentUserResources
    };
    localStorage.setItem("relay-demo-state-v1", JSON.stringify(snapshot));
  }, [isDemoMode, marketplaceListings, myListings, incomingRequests, outgoingRequests, ongoingTrades, completedTrades, notifications, mockConversations, auctionListings, bookmarkedListingIds, currentUserProfile, currentUserResources]);

  // ────────────────────────────────────────────────────────────────────────────
  // PRODUCTION MERN DATA HANDLING
  // ────────────────────────────────────────────────────────────────────────────

  // Load Exchange sessions
  async function loadExchangeSessions() {
    if (isDemoMode) return;
    try {
      const response = await api.getExchangeSessions();
      if (response?.sessions) {
        setExchangeSessions(response.sessions);
      }
    } catch (err) {
      console.error("Failed to load exchange sessions", err);
    }
  }

  // Load active messages
  async function loadExchangeMessages(sessionId) {
    if (isDemoMode || !sessionId) return;
    try {
      const response = await api.getExchangeMessages(sessionId);
      if (response?.messages) {
        setActiveMessages(response.messages);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  }

  // Load chat messages when activeSessionId changes in production
  useEffect(() => {
    if (!isDemoMode && activeSessionId) {
      setTimeout(() => {
        void loadExchangeMessages(activeSessionId);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId, isDemoMode]);

  // Initialize Socket.IO connection in production
  useEffect(() => {
    if (isDemoMode) return;

    const socketUrl = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") 
      : "http://localhost:4000";
    
    const socketInstance = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });

    setTimeout(() => {
      setSocket(socketInstance);
    }, 0);

    socketInstance.on("listing_created", (newListing) => {
      setMarketplaceListings((current) => {
        const exists = current.some((item) => String(item.id) === String(newListing._id || newListing.id));
        if (exists) return current;
        return [normalizeListing(newListing), ...current];
      });
    });

    socketInstance.on("listing_updated", (updatedListing) => {
      setMarketplaceListings((current) =>
        current.map((item) =>
          String(item.id) === String(updatedListing._id || updatedListing.id)
            ? normalizeListing(updatedListing)
            : item
        )
      );
    });

    socketInstance.on("listing_deleted", (listingId) => {
      setMarketplaceListings((current) =>
        current.filter((item) => String(item.id) !== String(listingId))
      );
    });

    socketInstance.on("auction_created", (newAuction) => {
      setAuctionListings((current) => {
        const exists = current.some((item) => String(item._id || item.id) === String(newAuction._id || newAuction.id));
        if (exists) return current;
        return [newAuction, ...current];
      });
    });

    socketInstance.on("bid_received", ({ auctionId, highestBid }) => {
      setAuctionListings((current) =>
        current.map((item) =>
          String(item._id || item.id) === String(auctionId)
            ? { ...item, highestBid, suggestedBid: highestBid + 50 }
            : item
        )
      );
    });

    socketInstance.on("message_received", (msg) => {
      if (String(msg.sessionId) === String(activeSessionIdRef.current)) {
        setActiveMessages((current) => {
          const exists = current.some((m) => String(m._id || m.id) === String(msg._id || msg.id));
          if (exists) return current;
          return [...current, msg];
        });
        // Emit read receipt back via socket
        const uid = backendUserIdRef.current;
        if (uid) {
          socketInstance.emit("messages_read", {
            sessionId: msg.sessionId,
            readerId: uid
          });
        }
      }
      void loadExchangeSessions();
    });

    socketInstance.on("notification_received", (notif) => {
      setNotifications((current) => [normalizeNotification(notif), ...current]);
    });

    socketInstance.on("session_created", () => {
      void loadExchangeSessions();
    });

    socketInstance.on("session_updated", ({ sessionId }) => {
      void loadExchangeSessions();
      if (String(sessionId) === String(activeSessionIdRef.current)) {
        void loadExchangeMessages(sessionId);
      }
    });

    // ── Presence events ────────────────────────────────────────────────
    socketInstance.on("user_online", ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
    });

    socketInstance.on("user_offline", ({ userId }) => {
      setOnlineUsers((prev) => { const next = { ...prev }; delete next[userId]; return next; });
    });

    // ── Typing events ──────────────────────────────────────────────────
    socketInstance.on("typing_start", ({ sessionId, userId }) => {
      setTypingUsers((prev) => ({ ...prev, [sessionId]: userId }));
    });

    socketInstance.on("typing_stop", ({ sessionId }) => {
      setTypingUsers((prev) => { const next = { ...prev }; delete next[sessionId]; return next; });
    });

    // ── Read receipts ──────────────────────────────────────────────────
    socketInstance.on("messages_read", ({ sessionId, readerId }) => {
      if (String(sessionId) === String(activeSessionIdRef.current)) {
        setActiveMessages((current) =>
          current.map((m) =>
            String(m.senderId) !== String(readerId) ? { ...m, isRead: true } : m
          )
        );
      }
    });

    return () => {
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  // Join User's Private Room
  useEffect(() => {
    if (!isDemoMode && socket && backendUserId) {
      socket.emit("join-user", backendUserId);
    }
  }, [socket, backendUserId, isDemoMode]);

  // Load marketplace listings on mount in production
  useEffect(() => {
    if (isDemoMode) return;
    async function loadMarketplace() {
      try {
        const [listingsResponse, auctionsResponse] = await Promise.all([
          api.getListings(),
          api.getAuctions(),
        ]);
        if (listingsResponse?.listings) {
          setMarketplaceListings(listingsResponse.listings.map(normalizeListing));
        }
        if (auctionsResponse?.auctions) {
          setAuctionListings(auctionsResponse.auctions);
        }
      } catch (err) {
        console.error("Failed to load listings/auctions", err);
      }
    }
    void loadMarketplace();
  }, [isDemoMode]);

  // Sync user with backend in production
  async function syncUserWithBackend(user) {
    if (isDemoMode || !user?.email) {
      setBackendUserId(null);
      return;
    }

    try {
      const { user: backendUser, profile } = await api.ensureUser({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: "email",
      });

      const userId = getUserId(backendUser);
      setBackendUserId(userId);

      if (profile) {
        setCurrentUserProfile((current) => ({ ...current, ...normalizeProfile(profile, user) }));
      }

      try {
        const [listingsResponse, bookmarksResponse, notificationsResponse, exchangesResponse, auctionsResponse] = await Promise.all([
          api.getListings(),
          api.getBookmarks(userId),
          api.getNotifications(userId),
          api.getExchangeSessions(),
          api.getAuctions(),
        ]);

        if (listingsResponse?.listings) {
          setMarketplaceListings(listingsResponse.listings.map(normalizeListing));
        }

        if (bookmarksResponse?.bookmarks) {
          setBookmarkedListingIds(bookmarksResponse.bookmarks.map((bookmark) => String(bookmark.listingId || bookmark.id || "")));
        }

        if (notificationsResponse?.notifications) {
          setNotifications(notificationsResponse.notifications.map(normalizeNotification));
        }

        if (exchangesResponse?.sessions) {
          setExchangeSessions(exchangesResponse.sessions);
        }

        if (auctionsResponse?.auctions) {
          setAuctionListings(auctionsResponse.auctions);
        }
      } catch (error) {
        console.error("Relay sync failed", error);
      }
    } catch (error) {
      console.error("User sync failed", error);
    }
  }

  // Subscribe to auth updates in production
  useEffect(() => {
    if (isDemoMode) return;

    const unsubscribe = authService.subscribe((user) => {
      setTimeout(() => {
        setAuthUser(user);
        setAuthLoading(false);
        setAuthError("");

        if (user) {
          setCurrentUserProfile((current) => ({
            ...current,
            name: current.name || user.displayName || user.email?.split("@")[0] || "Relay User",
            email: current.email || user.email || "",
            initials: getInitials(current.name || user.displayName || user.email?.split("@")[0] || "Relay User"),
          }));
          void syncUserWithBackend(user);
        } else {
          setBackendUserId(null);
          setBookmarkedListingIds([]);
          setNotifications([]);
        }
      }, 0);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  // Dynamic state computations to avoid synchronous setState inside effects
  const derivedIncomingRequests = isDemoMode ? incomingRequests : exchangeSessions
    .filter((s) => String(s.receiverId) === String(backendUserId) && s.status === "pending")
    .map(normalizeSessionToRequest);

  const derivedOutgoingRequests = isDemoMode ? outgoingRequests : exchangeSessions
    .filter((s) => String(s.initiatorId) === String(backendUserId) && s.status === "pending")
    .map(normalizeSessionToRequest);

  const derivedOngoingTrades = isDemoMode ? ongoingTrades : exchangeSessions
    .filter((s) => ["negotiation_active", "accepted", "meeting_scheduled", "offer_sent", "counter_offered"].includes(s.status))
    .map(normalizeSessionToOngoing);

  const derivedCompletedTrades = isDemoMode ? completedTrades : exchangeSessions
    .filter((s) => s.status === "completed")
    .map(normalizeSessionToCompleted);

  const derivedMockConversations = isDemoMode ? mockConversations : exchangeSessions.map((session) => {
    const isCurrent = String(session._id || session.id) === String(activeSessionId);
    const msgs = isCurrent ? activeMessages : [];
    const formatted = msgs.map((m) => ({
      from: String(m.senderId) === String(backendUserId) ? "me" : "them",
      text: m.text,
      time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now",
      type: m.type,
    }));
    return {
      ...normalizeSessionToConversation(session, backendUserId),
      messages: formatted,
      status: session.status,
      meetingLocation: session.meetingLocation || "",
      meetingTime: session.meetingTime ? new Date(session.meetingTime).toLocaleString() : "",
    };
  });

  const displayIncomingRequests = derivedIncomingRequests;
  const displayOutgoingRequests = derivedOutgoingRequests;
  const displayOngoingTrades = derivedOngoingTrades;
  const displayCompletedTrades = derivedCompletedTrades;
  const displayMockConversations = derivedMockConversations;

  // My listings selector
  const myListingsSelector = myListings.length
    ? myListings
    : marketplaceListings.filter(
        (listing) => String(listing.userId || listing.ownerId || "") === String(backendUserId) || listing.owner === currentUserProfile.name
      );

  // ────────────────────────────────────────────────────────────────────────────
  // UNIFIED ACTION HANDLERS
  // ────────────────────────────────────────────────────────────────────────────

  function ensureNegotiation(trade) {
    if (isDemoMode) {
      const existing = mockConversations.find(
        (c) => String(c.tradeId) === String(trade.id)
      );

      if (existing) {
        setActiveSessionId(existing.id);
        return existing;
      }

      const created = {
        id: `demo-session-${trade.id}`,
        tradeId: trade.id,
        listingId: trade.id,
        name: trade.owner,
        initials: trade.ownerProfile?.initials || "RU",
        color: trade.ownerProfile?.avatarColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
        offering: trade.offering,
        lookingFor: trade.lookingFor,
        time: "Just now",
        outcome: TRADE_OUTCOME.NEGOTIATION_ACTIVE,
        unread: 0,
        lastMessage: `Hi! I'm interested in trading.`,
        status: "Online",
        location: trade.distance || "Nearby",
        messages: [
          { from: "them", text: `Hi! I'm interested in trading my "${trade.offering}" for your "${trade.lookingFor}".`, time: "Just now", type: "text" }
        ]
      };

      setMockConversations((current) => [created, ...current]);
      setActiveSessionId(created.id);
      return created;
    }

    const session = exchangeSessions.find(
      (s) => String(s.listingId?._id || s.listingId || "") === String(trade.id)
    );
    if (session) {
      setActiveSessionId(session._id);
      return session;
    }

    // Automatically create a new exchange session in MongoDB if none exists
    if (trade && (trade.id || trade.__backendId)) {
      const listingId = trade.__backendId || trade.id;
      if (!window._creatingSessions) window._creatingSessions = {};
      if (!window._creatingSessions[listingId]) {
        window._creatingSessions[listingId] = true;
        api.createExchangeSession({
          listingId,
          offeredItems: [],
          messageText: `Hi! I am interested in trading your "${trade.title || trade.offering}".`
        })
          .then((res) => {
            void loadExchangeSessions().then(() => {
              const createdSession = res.session || res;
              if (createdSession && createdSession._id) {
                setActiveSessionId(createdSession._id);
              }
            });
          })
          .catch((err) => {
            console.error("Failed to automatically create negotiation session:", err);
          })
          .finally(() => {
            delete window._creatingSessions[listingId];
          });
      }
    }

    setActiveSessionId(null);
    return null;
  }

  async function addNegotiationMessage(sessionId, message) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    const text = typeof message === "string" ? message : message.text;

    if (!sessionId) {
      try {
        const response = await api.createExchangeSession({
          listingId: negotiationDrawer.tradeId,
          messageText: text,
        });
        if (response?.session) {
          setActiveSessionId(response.session._id);
          setNegotiationDrawer((current) => ({ ...current, negotiationId: response.session._id }));
          void loadExchangeSessions();
          showToast("Trade Request Sent", "Exchange session initiated.");
        }
      } catch (err) {
        showToast("Failed to start negotiation", err.message || "An error occurred", "error");
      }
      return;
    }

    try {
      const response = await api.sendExchangeMessage(sessionId, { text });
      if (response?.message) {
        setActiveMessages((current) => [...current, response.message]);
        void loadExchangeSessions();
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }

  async function updateNegotiationOutcome(sessionId, outcome) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }

    const status = outcome === TRADE_OUTCOME.COMPLETED 
      ? "completed" 
      : outcome === TRADE_OUTCOME.DECLINED 
        ? "declined" 
        : "negotiation_active";
    try {
      await api.updateExchangeSessionStatus(sessionId, { status });
      void loadExchangeSessions();
    } catch (err) {
      console.error("Failed to update outcome", err);
    }
  }

  function openNegotiationDrawerForTrade(trade) {
    const session = ensureNegotiation(trade);
    openNegotiationDrawer({ tradeId: trade.id, negotiationId: session?._id || session?.id || null });
  }

  const tradeDetails = marketplaceListings.reduce((details, listing) => {
    details[listing.id] = listing;
    return details;
  }, {});

  async function startOrOpenConversation({
    targetUserId,
    targetUser,
    sourceType,
    sourceId,
    listingId,
    requestId,
    sourceTitle,
    lookingFor,
    selectedResourceIds = [],
    isOfferResolved = false,
  }) {
    const resolvedTargetUserId = targetUserId || targetUser?.id || targetUser?._id;
    const resolvedSourceId = sourceId || listingId || requestId;
    const resolvedSourceType = sourceType || (requestId ? "request" : "listing");

    if (!resolvedTargetUserId) {
      const errorMsg = `Development Error: targetUserId is missing for source: "${sourceTitle || "unknown item"}" (${resolvedSourceType} ID: ${resolvedSourceId})`;
      showToast("Negotiation Unavailable", "Unable to start this negotiation because the owner information is unavailable.", "error");
      throw new Error(errorMsg);
    }

    if (!resolvedSourceId) {
      const errorMsg = `Development Error: sourceId/listingId/requestId is missing.`;
      showToast("Negotiation Unavailable", "Unable to start this negotiation because the item information is unavailable.", "error");
      throw new Error(errorMsg);
    }

    if (!isDemoMode && backendUserId && String(resolvedTargetUserId) === String(backendUserId)) {
      showToast("Invalid Action", "You cannot start a negotiation with yourself.", "error");
      return null;
    }

    if (isStartingNegotiation) return null;
    setIsStartingNegotiation(true);

    try {
      if (resolvedSourceType === "listing" && !isOfferResolved) {
        const targetListing = marketplaceListings.find(l => String(l.id || l._id) === String(resolvedSourceId)) ||
          demoMarketplaceListingsSeed.find(l => String(l.id || l._id) === String(resolvedSourceId));
        
        const isOurListing = targetListing && (
          String(targetListing.userId || targetListing.ownerId || "") === String(backendUserId) ||
          targetListing.owner === currentUserProfile.name
        );

        if (!isOurListing) {
          const userListings = myListings.length
            ? myListings
            : marketplaceListings.filter(
                (l) => String(l.userId || l.ownerId || "") === String(backendUserId) || l.owner === currentUserProfile.name
              );

          if (userListings.length > 0) {
            setPendingOfferPayload({
              targetUserId: resolvedTargetUserId,
              targetUser,
              sourceType: resolvedSourceType,
              sourceId: resolvedSourceId,
              listingId: resolvedSourceId,
              sourceTitle,
              lookingFor,
              isOfferResolved: true
            });
            setOfferSelectionModalOpen(true);
            return null;
          }
        }
      }

      if (isDemoMode) {
        const existing = mockConversations.find((c) =>
          String(c.targetUserId || c.otherUserId || "") === String(resolvedTargetUserId) &&
          String(c.sourceId || c.tradeId || c.listingId || "") === String(resolvedSourceId) &&
          c.sourceType === resolvedSourceType &&
          c.status !== "completed" &&
          c.status !== "declined" &&
          c.status !== "cancelled"
        );

        if (existing) {
          setActiveSessionId(existing.id);
          navigate(`/messages?conversation=${existing.id}`);
          return existing;
        }

        const targetListing = demoMarketplaceListingsSeed.find(l => String(l.id) === String(resolvedSourceId)) ||
          demoRequestsSeed.find(r => String(r.id) === String(resolvedSourceId));

        const name = targetUser?.displayName || targetListing?.owner || targetListing?.name || "Relay Member";
        const initials = targetUser?.avatarInitials || targetListing?.ownerProfile?.initials || getInitials(name);
        const color = targetUser?.avatarColor || targetListing?.ownerProfile?.avatarColor || "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]";
        
        let offering = "Open trade offer";
        if (selectedResourceIds.length > 0) {
          const matchedResources = currentUserResources.filter(r => selectedResourceIds.includes(r.id));
          if (matchedResources.length > 0) {
            offering = matchedResources.map(r => r.title).join(" + ");
          }
        } else {
          offering = targetListing?.lookingFor || lookingFor || "Open trade offer";
        }
        
        const lookingForText = targetListing?.title || sourceTitle || "Relay Resource";
        const distance = targetListing?.distance || "Nearby";

        const newSessionId = `demo-session-${Date.now()}`;
        const newMockConversation = {
          id: newSessionId,
          tradeId: resolvedSourceId,
          listingId: resolvedSourceId,
          sourceId: resolvedSourceId,
          sourceType: resolvedSourceType,
          targetUserId: resolvedTargetUserId,
          otherUserId: resolvedTargetUserId,
          name,
          initials,
          color,
          offering,
          lookingFor: lookingForText,
          time: "Just now",
          outcome: TRADE_OUTCOME.NEGOTIATION_ACTIVE,
          status: "pending",
          location: distance,
          messages: [
            { from: "system", text: `Negotiation started for ${lookingForText}.`, time: "Just now", type: "system" }
          ],
        };

        if (selectedResourceIds.length > 0) {
          newMockConversation.messages.push({
            from: "me",
            type: "text",
            text: `TRADE OFFER\n\nYou offer: ${offering}\nIn exchange for: ${lookingForText}\nStatus: Pending`,
            time: "Just now"
          });
        }

        setMockConversations((prev) => [newMockConversation, ...prev]);
        setActiveSessionId(newSessionId);
        navigate(`/messages?conversation=${newSessionId}`);
        return newMockConversation;
      }

      let existing = exchangeSessions.find((s) => {
        const otherId = s.initiatorId?.toString() === backendUserId ? s.receiverId : s.initiatorId;
        const matchesTarget = String(otherId || "") === String(resolvedTargetUserId);
        const matchesSource = String(s.listingId?._id || s.listingId || "") === String(resolvedSourceId);
        const isActive = !["completed", "declined", "cancelled", "expired"].includes(s.status);
        return matchesTarget && matchesSource && isActive;
      });

      if (existing) {
        const sid = existing._id || existing.id;
        setActiveSessionId(sid);
        if (existing.status === "pending") {
          await api.updateExchangeSessionStatus(sid, { status: "negotiation_active" });
          await loadExchangeSessions();
        }
        navigate(`/messages?conversation=${sid}`);
        return existing;
      }

      const offeredItems = [];
      if (selectedResourceIds.length > 0) {
        const matchedResources = currentUserResources.filter(r => selectedResourceIds.includes(String(r.id || r._id)));
        matchedResources.forEach(res => {
          offeredItems.push({
            listingId: res.id || res._id,
            title: res.title,
            value: res.value || "",
            condition: res.condition || "Good"
          });
        });
      }

      const initMessage = selectedResourceIds.length > 0
        ? `Hi! I want to offer my items in exchange for your "${sourceTitle || "listing"}".`
        : `Hi! I want to start a conversation about "${sourceTitle || "your listing"}".`;

      const response = await api.createExchangeSession({
        listingId: resolvedSourceType === "listing" ? resolvedSourceId : undefined,
        targetUserId: resolvedTargetUserId,
        offeredItems,
        selectedResourceIds,
        messageText: initMessage,
        sourceType: resolvedSourceType,
        sourceId: resolvedSourceId,
        sourceTitle: sourceTitle || null,
        lookingFor: lookingFor || null,
      });

      if (response?.session) {
        const sid = response.session._id || response.session.id;
        if (response.message !== "Active session exists") {
          await api.updateExchangeSessionStatus(sid, { status: "negotiation_started" });
        }
        setActiveSessionId(sid);
        await loadExchangeSessions();
        navigate(`/messages?conversation=${sid}`);
        if (response.message !== "Active session exists") {
          showToast("Trade Request Sent", "Exchange session initiated.");
        }
        return response.session;
      }
    } catch (err) {
      showToast("Negotiation failed", err.message || "Could not start conversation.", "error");
    } finally {
      setIsStartingNegotiation(false);
    }
  }

  async function openNegotiationDrawer(payload = {}) {
    return startOrOpenConversation(payload);
  }

  async function completeNegotiationWithOffer(payload, selectedListing) {
    const resolvedPayload = { ...payload, isOfferResolved: true };
    if (selectedListing) {
      resolvedPayload.selectedResourceIds = [selectedListing.id || selectedListing._id];
    } else {
      resolvedPayload.selectedResourceIds = [];
    }
    await startOrOpenConversation(resolvedPayload);
  }

  function closeNegotiationDrawer() {
    setNegotiationDrawer({ open: false });
    setActiveSessionId(null);
  }

  async function openTraderProfileDrawer(payload = {}) {
    setTraderProfileDrawer({ open: true, ...payload });
    const resolvedId = payload.traderId || payload.conversationId || payload.userId;
    if (!resolvedId || isDemoMode) return;

    try {
      const response = await api.getProfileByUserId(resolvedId);
      if (response?.profile) {
        setTraderProfiles((current) => ({
          ...current,
          [resolvedId]: response.profile,
        }));
      }
    } catch (err) {
      console.error("Failed to load trader profile", err);
    }
  }

  function closeTraderProfileDrawer() {
    setTraderProfileDrawer({ open: false });
  }

  async function submitTraderFeedback(traderId, feedback) {
    if (isDemoMode) {
      showToast("Feedback Submitted", "Your review and rating updates are now live locally.");
      return { success: true };
    }
    try {
      const response = await api.submitTraderFeedback({
        subjectId: traderId,
        starRating: feedback.starRating,
        title: feedback.title,
        description: feedback.description || feedback.comment || "",
        experience: feedback.experience || "Excellent",
        tradeAgain: feedback.tradeAgain || "Yes",
        resource: feedback.resource || "",
        tradeDate: feedback.tradeDate || new Date().toLocaleDateString(),
        tags: feedback.tags || [],
        accuracy: feedback.accuracy || "Yes",
        tradeId: feedback.tradeId || "",
        conversationId: feedback.conversationId || "",
      });

      if (response?.profile) {
        setTraderProfiles((current) => ({
          ...current,
          [traderId]: response.profile,
        }));
        showToast("Feedback Submitted", "Your review and rating updates are now live.");
        await loadExchangeSessions();
        return { success: true };
      }
    } catch (err) {
      showToast("Feedback Submission Failed", err.message || "An error occurred", "error");
      throw err;
    }
  }

  async function markAllNotificationsRead() {
    const unreadNotifications = notifications.filter((n) => n.unread);

    setNotifications((current) =>
      current.map((n) => ({ ...n, unread: false }))
    );

    if (!isDemoMode && backendUserId && unreadNotifications.length) {
      await Promise.allSettled(
        unreadNotifications.map((n) => api.updateNotification(n.id, { unread: false }))
      );
    }
  }

  async function updateCurrentUserProfile(nextProfile) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    const nextState = { ...currentUserProfile, ...nextProfile };
    setCurrentUserProfile(nextState);

    if (!backendUserId) return;

    try {
      const profilePayload = {
        name: nextState.name,
        email: nextState.email,
        location: nextState.city,
        responseTime: nextState.responseTime,
        successfulTrades: nextState.successfulTrades,
        trustScore: nextState.trustScore,
        preferences: {
          preference: nextState.preference,
          notificationsEnabled: nextState.notificationsEnabled,
        },
      };

      await api.updateProfile(backendUserId, profilePayload);
    } catch (error) {
      showToast("Profile update failed", error.message || "Could not sync your profile.", "error");
    }
  }

  async function signInWithEmail(email, password) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const { user } = await authService.loginWithEmail(email, password);
      setAuthUser(user);
      setIsDemoMode(false);
      localStorage.removeItem("relay-demo-mode");
      return user;
    } catch (error) {
      const message = error?.message || "Unable to sign in. Please try again.";
      setAuthError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }

  async function signUpWithEmail(email, password, displayName) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const { user } = await authService.registerWithEmail(email, password, displayName);
      setAuthUser(user);
      setIsDemoMode(false);
      localStorage.removeItem("relay-demo-mode");
      return user;
    } catch (error) {
      const message = error?.message || "Unable to create an account. Please try again.";
      setAuthError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }

  async function signInWithGoogle() {
    setAuthLoading(true);
    setAuthError("");

    try {
      const { user } = await authService.loginWithGoogle();
      setAuthUser(user);
      setIsDemoMode(false);
      localStorage.removeItem("relay-demo-mode");
      return user;
    } catch (error) {
      const message = error?.message || "Google sign-in was interrupted.";
      setAuthError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }

  async function signOutUser() {
    setAuthLoading(true);
    setAuthError("");

    try {
      if (isDemoMode) {
        localStorage.removeItem("relay-demo-mode");
        localStorage.removeItem("relay-demo-state-v1");
        setIsDemoMode(false);
        setAuthUser(null);
        setBackendUserId(null);
        window.location.href = "/";
        return;
      }
      await authService.logout();
      setAuthUser(null);
      setBackendUserId(null);
      window.location.href = "/";
    } catch (error) {
      const message = error?.message || "Unable to sign you out right now.";
      setAuthError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }

  async function toggleBookmark(listingId) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    const isBookmarked = bookmarkedListingIds.includes(listingId);
    const nextIds = isBookmarked
      ? bookmarkedListingIds.filter((id) => id !== listingId)
      : [...bookmarkedListingIds, listingId];

    setBookmarkedListingIds(nextIds);

    if (!backendUserId) return;

    try {
      if (isBookmarked) {
        await api.deleteBookmark(backendUserId, listingId);
      } else {
        await api.createBookmark(backendUserId, listingId);
      }
    } catch (error) {
      setBookmarkedListingIds(bookmarkedListingIds);
      showToast("Bookmark update failed", error.message || "Could not update bookmarks.", "error");
    }
  }

  function showToast(title, detail, type = "success") {
    const toast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      detail,
      type,
    };

    setToasts((current) => [toast, ...current].slice(0, 4));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id));
    }, 3600);
  }

  function dismissToast(toastId) {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }

  async function acceptIncomingRequest(requestId) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    try {
      await api.updateExchangeSessionStatus(requestId, { status: "accepted" });
      void loadExchangeSessions();
      showToast("Trade Accepted", "You accepted the trade request.");
    } catch (err) {
      showToast("Failed to accept trade", err.message || "An error occurred", "error");
    }
  }

  async function declineIncomingRequest(requestId) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    try {
      await api.updateExchangeSessionStatus(requestId, { status: "declined" });
      void loadExchangeSessions();
      showToast("Trade Declined", "You declined the trade request.");
    } catch (err) {
      showToast("Failed to decline trade", err.message || "An error occurred", "error");
    }
  }

  async function completeOngoingTrade(tradeId) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }

    try {
      await api.updateExchangeSessionStatus(tradeId, { status: "completed" });
      void loadExchangeSessions();
      showToast("Trade Completed Successfully", "Exchange completed successfully.");
    } catch (err) {
      showToast("Failed to complete trade", err.message || "An error occurred", "error");
    }
  }

  async function cancelOutgoingRequest(requestId) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    try {
      await api.updateExchangeSessionStatus(requestId, { status: "cancelled" });
      void loadExchangeSessions();
      showToast("Request Cancelled", "Your trade request was cancelled.");
    } catch (err) {
      showToast("Failed to cancel request", err.message || "An error occurred", "error");
    }
  }

  async function sendTradeOffer(trade, selectedResources) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    const resourcesText = selectedResources.length
      ? selectedResources.map((r) => r.title).join(" + ")
      : "Open trade offer";

    const offeredItems = selectedResources.map((resource) => ({
      listingId: resource.id,
      title: resource.title,
      value: resource.value || "",
      condition: resource.condition || "Good",
    }));

    try {
      const response = await api.createExchangeSession({
        listingId: trade.id,
        offeredItems,
        messageText: `Hi! I want to trade my "${resourcesText}" for your "${trade.title}".`
      });

      if (response?.session) {
        void loadExchangeSessions();
        showToast("Trade Request Sent", "Your request is now pending owner approval.");
        return response.session;
      }
    } catch (err) {
      showToast("Failed to send trade offer", err.message || "An error occurred", "error");
    }
  }

  async function archiveConversation(conversationId) {
    if (isDemoMode) {
      setMockConversations((current) =>
        current.map((c) =>
          String(c.id) === String(conversationId) ? { ...c, archived: true, unread: 0 } : c
        )
      );
      showToast("Conversation Archived", "This exchange thread was moved to Archived.");
      return;
    }

    try {
      await api.updateExchangeSessionStatus(conversationId, { status: "expired" });
      void loadExchangeSessions();
      showToast("Conversation Archived", "This exchange thread was moved to Archived.");
    } catch (err) {
      showToast("Failed to archive conversation", err.message || "An error occurred", "error");
    }
  }

  async function updateConversationMessages(conversationId, message) {
    await addNegotiationMessage(conversationId, message);
  }

  // Real-API message send with optimistic rendering + typing emit
  async function sendChatMessage(sessionId, text) {
    if (!text?.trim() || sendingMessage) return;
    if (isDemoMode) {
      const msgText = text.trim();
      const optimistic = {
        _id: `demo-msg-${Date.now()}`,
        sessionId,
        senderId: "demo-me",
        text: msgText,
        type: "text",
        createdAt: new Date().toISOString(),
        from: "me",
        time: "Just now",
        isRead: false,
      };

      // Append user message
      setActiveMessages((current) => [...current, optimistic]);

      // Update mockConversations list preview
      setMockConversations((current) =>
        current.map((c) =>
          String(c.id) === String(sessionId)
            ? {
                ...c,
                lastMessage: msgText,
                time: "Just now",
                messages: [...(c.messages || []), optimistic],
              }
            : c
        )
      );

      // ── Simulate delayed reply ──────────────────────────────────────
      setTimeout(() => {
        // Show typing indicator
        setTypingUsers((prev) => ({ ...prev, [sessionId]: "demo-them" }));

        setTimeout(() => {
          // Hide typing indicator
          setTypingUsers((prev) => {
            const next = { ...prev };
            delete next[sessionId];
            return next;
          });

          // Generate response
          const conv = mockConversations.find(c => String(c.id) === String(sessionId));
          const replyText = getContextualReply(conv?.name, conv?.lookingFor, conv?.offering);

          const demoReply = {
            _id: `demo-reply-${Date.now()}`,
            sessionId,
            senderId: "demo-them",
            text: replyText,
            type: "text",
            createdAt: new Date().toISOString(),
            from: "them",
            time: "Just now",
            isRead: false,
          };

          // Append reply
          setActiveMessages((current) => [...current, demoReply]);

          // Update list preview
          setMockConversations((current) =>
            current.map((c) =>
              String(c.id) === String(sessionId)
                ? {
                    ...c,
                    lastMessage: replyText,
                    time: "Just now",
                    messages: [...(c.messages || []), demoReply],
                  }
                : c
            )
          );
        }, 1800);
      }, 800);
      return;
    }

    setSendingMessage(true);
    const trimmed = text.trim();

    // Optimistic message
    const optimisticId = `opt-${Date.now()}`;
    const optimistic = {
      _id: optimisticId,
      sessionId,
      senderId: backendUserId,
      text: trimmed,
      type: "text",
      createdAt: new Date().toISOString(),
      from: "me",
      time: "Sending…",
      isRead: false,
      _optimistic: true,
    };
    setActiveMessages((current) => [...current, optimistic]);

    // Stop typing
    if (socket) socket.emit("typing_stop", { sessionId, userId: backendUserId });

    try {
      const response = await api.sendExchangeMessage(sessionId, { text: trimmed });
      if (response?.message) {
        // Replace optimistic with real message
        setActiveMessages((current) =>
          current.map((m) => m._id === optimisticId ? { ...response.message, from: "me" } : m)
        );
        void loadExchangeSessions();

        // ── Seed Bot Reply Logic for MERN mode ──────────────────────
        const activeConversation = exchangeSessions.find((s) => String(s._id || s.id) === String(sessionId));
        const isSeedUser = activeConversation?.otherProfile?.isSeedUser || 
                           activeConversation?.otherProfile?.email?.endsWith("@relay.demo");

        if (isSeedUser) {
          const displayName = activeConversation?.otherProfile?.displayName || "Relay Member";
          // Wait 1.2 seconds, trigger typing indicator
          setTimeout(() => {
            setTypingUsers((prev) => ({ ...prev, [sessionId]: displayName }));

            // Wait 2.5 seconds, send simulated reply to MongoDB and remove typing
            setTimeout(async () => {
              setTypingUsers((prev) => {
                const next = { ...prev };
                delete next[sessionId];
                return next;
              });

              const lookingForText = activeConversation?.listingId?.title || "Relay Request";
              const offeringText = activeConversation?.offeredItems?.length ? activeConversation.offeredItems.map(i => i.title).join(" + ") : "Open offer";
              const replyText = getContextualReply(displayName, lookingForText, offeringText);

              try {
                const replyResponse = await api.sendExchangeMessage(sessionId, { text: replyText });
                if (replyResponse?.message) {
                  setActiveMessages((current) => {
                    const exists = current.some((m) => String(m._id || m.id) === String(replyResponse.message._id || replyResponse.message.id));
                    if (exists) return current;
                    return [...current, { ...replyResponse.message, from: "them" }];
                  });
                  void loadExchangeSessions();
                }
              } catch (err) {
                console.error("Failed to send bot response to Mongo", err);
              }
            }, 2500);
          }, 1200);
        }
      }
    } catch (_err) {
      console.error("Error sending message:", _err);
      // Mark as failed
      setActiveMessages((current) =>
        current.map((m) => m._id === optimisticId ? { ...m, _failed: true, time: "Failed" } : m)
      );
      showToast("Message Failed", "Could not send. Tap to retry.", "error");
    } finally {
      setSendingMessage(false);
    }
  }

  async function placeAuctionBid(auctionId, amount) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }

    try {
      const response = await api.placeAuctionBid(auctionId, amount);
      if (response) {
        // Reload auctions
        const auctionsResponse = await api.getAuctions();
        if (auctionsResponse?.auctions) {
          setAuctionListings(auctionsResponse.auctions);
        }
        showToast("Bid Placed Successfully", `Your bid of ₹${amount} was successfully submitted.`);
      }
    } catch (err) {
      showToast("Failed to place bid", err.message || "Could not place bid at this time.", "error");
    }
  }

  async function createListingFromForm(form, images = []) {
    if (isDemoMode) {
      setDemoUnlockModalOpen(true);
      return;
    }
    const title = form.title.trim();
    const lookingFor = form.lookingForSpecific?.trim() || form.lookingFor.join(", ");

    const payload = {
      title,
      description: form.description || `${title} is ready for a verified Relay exchange.`,
      category: form.category,
      condition: form.condition,
      estimatedValue: form.value || "Value not added",
      lookingFor,
      images: images.map((img) => img.url || img),
      verificationStatus: "Verified",
      aiReport: {
        verificationStatus: "Verified",
        recommendedActions: ["Direct verified entry."]
      }
    };

    try {
      const response = await api.createListing(payload);
      if (response?.listing) {
        showToast("Relay Published", `${title} is now live in Marketplace.`);
        const normalized = normalizeListing(response.listing);
        setMarketplaceListings((current) => [normalized, ...current]);
        return normalized;
      }
    } catch (err) {
      showToast("Failed to publish listing", err.message || "An error occurred", "error");
    }
  }

  return (
    <RelayContext.Provider
      value={{
        isDemoMode,
        enterDemoMode,
        demoUnlockModalOpen,
        setDemoUnlockModalOpen,
        negotiations: displayMockConversations,
        ensureNegotiation,
        addNegotiationMessage,
        updateNegotiationOutcome,
        openNegotiationDrawerForTrade,
        marketplaceListings,
        myListings: myListingsSelector,
        incomingRequests: displayIncomingRequests,
        outgoingRequests: displayOutgoingRequests,
        ongoingTrades: displayOngoingTrades,
        completedTrades: displayCompletedTrades,
        notifications,
        toasts,
        currentUserResources,
        currentUserProfile,
        mockConversations: displayMockConversations,
        setMockConversations,
        auctionListings,
        declinedTrades,
        traderProfiles,
        traderProfileDrawer,
        tradeDetails,
        selectedTrade,
        negotiationDrawer,
        setSelectedTrade,
        openNegotiationDrawer,
        closeNegotiationDrawer,
        openTraderProfileDrawer,
        closeTraderProfileDrawer,
        submitTraderFeedback,
        markAllNotificationsRead,
        showToast,
        dismissToast,
        sendTradeOffer,
        updateCurrentUserProfile,
        toggleBookmark,
        bookmarkedListingIds,
        bookmarkedListings,
        createListingFromForm,
        authUser,
        authLoading,
        authError,
        isAuthenticated,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOutUser,
        acceptIncomingRequest,
        declineIncomingRequest,
        completeOngoingTrade,
        cancelOutgoingRequest,
        archiveConversation,
        loadExchangeSessions,
        updateConversationMessages,
        placeAuctionBid,
        activeSessionId,
        setActiveSessionId,
        activeMessages,
        sendChatMessage,
        sendingMessage,
        onlineUsers,
        typingUsers,
        socket,
        backendUserId,
        offerSelectionModalOpen,
        setOfferSelectionModalOpen,
        pendingOfferPayload,
        completeNegotiationWithOffer,
        startOrOpenConversation,
        isStartingNegotiation,
      }}
    >
      {children}
    </RelayContext.Provider>
  );
}

export function useRelay() {
  const context = useContext(RelayContext);

  if (!context) {
    throw new Error("useRelay must be used inside RelayProvider");
  }

  return context;
}
