const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const listeners = new Set();
let currentUser = null;

try {
  const storedUser = localStorage.getItem("relay-auth-user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Error reading stored user:", error);
}

function emit(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem("relay-auth-user", JSON.stringify(user));
  } else {
    localStorage.removeItem("relay-auth-user");
    localStorage.removeItem("relay-auth-token");
    localStorage.removeItem("relay-refresh-token");
  }
  listeners.forEach((listener) => listener(user));
}

export const authService = {
  subscribe(listener) {
    listeners.add(listener);
    listener(currentUser);

    return () => {
      listeners.delete(listener);
    };
  },

  async loginWithEmail(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || "Failed to sign in");
    }

    const data = await response.json();
    localStorage.setItem("relay-auth-token", data.token);
    localStorage.setItem("relay-refresh-token", data.refreshToken);
    
    const user = {
      id: data.user.id,
      email: data.user.email,
      displayName: data.profile.displayName,
      photoURL: data.profile.avatarUrl || null,
    };

    emit(user);
    return { user, profile: data.profile };
  },

  async registerWithEmail(email, password, displayName) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || "Failed to create account");
    }

    const data = await response.json();
    localStorage.setItem("relay-auth-token", data.token);
    localStorage.setItem("relay-refresh-token", data.refreshToken);

    const user = {
      id: data.user.id,
      email: data.user.email,
      displayName: data.profile.displayName,
      photoURL: data.profile.avatarUrl || null,
    };

    emit(user);
    return { user, profile: data.profile };
  },

  async loginWithGoogle() {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "google.user@example.com",
        displayName: "Google Relay User",
        photoURL: null,
        providerId: `google-${Date.now()}`
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || "Failed to sign in with Google");
    }

    const data = await response.json();
    localStorage.setItem("relay-auth-token", data.token);
    localStorage.setItem("relay-refresh-token", data.refreshToken);

    const user = {
      id: data.user.id,
      email: data.user.email,
      displayName: data.profile.displayName,
      photoURL: data.profile.avatarUrl || null,
    };

    emit(user);
    return { user, profile: data.profile };
  },

  async logout() {
    const refreshToken = localStorage.getItem("relay-refresh-token");
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (err) {
        console.error("Logout request failed:", err);
      }
    }
    emit(null);
  },

  getToken() {
    return localStorage.getItem("relay-auth-token");
  },

  getRefreshToken() {
    return localStorage.getItem("relay-refresh-token");
  }
};
