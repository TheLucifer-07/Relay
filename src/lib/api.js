const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function request(path, options = {}) {
  let token = localStorage.getItem("relay-auth-token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !options._retry) {
    const refreshToken = localStorage.getItem("relay-refresh-token");
    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem("relay-auth-token", data.token);
            localStorage.setItem("relay-refresh-token", data.refreshToken);
            isRefreshing = false;
            onRefreshed(data.token);
          } else {
            isRefreshing = false;
            localStorage.removeItem("relay-auth-user");
            localStorage.removeItem("relay-auth-token");
            localStorage.removeItem("relay-refresh-token");
            window.dispatchEvent(new Event("relay-unauthorized"));
            throw new Error("Session expired. Please sign in again.");
          }
        } catch (err) {
          isRefreshing = false;
          throw err;
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          const nextOptions = { ...options };
          nextOptions.headers = {
            ...(nextOptions.headers || {}),
            "Authorization": `Bearer ${newToken}`
          };
          nextOptions._retry = true;
          resolve(request(path, nextOptions));
        });
      });
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Request failed");
  }

  return response.json().catch(() => ({}));
}

export const api = {
  ensureUser: (payload) => request("/auth/ensure-user", { method: "POST", body: JSON.stringify(payload) }),
  getListings: () => request("/listings"),
  createListing: (payload) => request("/listings", { method: "POST", body: JSON.stringify(payload) }),
  getBookmarks: (userId) => request(`/bookmarks/${userId}`),
  createBookmark: (userId, listingId) => request(`/bookmarks/${userId}`, { method: "POST", body: JSON.stringify({ listingId }) }),
  deleteBookmark: (userId, listingId) => request(`/bookmarks/${userId}/${listingId}`, { method: "DELETE" }),
  getNotifications: (userId) => request(`/notifications/${userId}`),
  updateNotification: (notificationId, payload) => request(`/notifications/${notificationId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  updateProfile: (userId, payload) => request(`/profiles/${userId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  getExchangeSessions: () => request("/exchanges"),
  createExchangeSession: (payload) => request("/exchanges", { method: "POST", body: JSON.stringify(payload) }),
  updateExchangeSessionStatus: (sessionId, payload) => request(`/exchanges/${sessionId}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
  getExchangeMessages: (sessionId) => request(`/exchanges/${sessionId}/messages`),
  sendExchangeMessage: (sessionId, payload) => request(`/exchanges/${sessionId}/messages`, { method: "POST", body: JSON.stringify(payload) }),
  getAuctions: () => request("/auctions"),
  placeAuctionBid: (auctionId, amount) => request(`/auctions/${auctionId}/bid`, { method: "POST", body: JSON.stringify({ amount }) }),
  analyzeListingDraft: (formData) => request("/listings/analyze", { method: "POST", body: formData }),
  submitTraderFeedback: (payload) => request("/profiles/feedback", { method: "POST", body: JSON.stringify(payload) }),
  getGoogleMapsKey: () => request("/config/google-maps-key"),
  // Public profile (no auth required)
  getPublicProfile: (userId) => request(`/profiles/${userId}/public`),
  getUserListings: (userId) => request(`/profiles/${userId}/listings`),
};
