import { create } from "zustand";
import {api} from "../util/axios";
import { AuthState, User } from "../types/auth";




// ✅ Zustand Store with Type Safety
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  tokenRefreshing: false, // ✅ Prevents multiple refresh calls

  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });

      const user = response.data.user;
      set({ user, isAuthenticated: true });
      get().scheduleTokenRefresh(); // ✅ Schedule auto-refresh
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  },

  logout: async () => {
    try {
      await api.get("/logout"); // ✅ Ensures backend clears cookies
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  },

  refreshToken: async () => {
    if (get().tokenRefreshing) return; // ✅ Prevent multiple refresh calls
    set({ tokenRefreshing: true });

    try {
      await api.get("/refresh");
      set({ tokenRefreshing: false });
      get().scheduleTokenRefresh(); // ✅ Reschedule auto-refresh
    } catch (error) {
      console.error("❌ Token refresh failed, logging out...");
      set({ user: null, isAuthenticated: false, tokenRefreshing: false });
    }
  },

  checkToken: async () => {
    try {
      const response = await api.get("/check-auth");
      const user = response.data.user;
      set({ user, isAuthenticated: true });
      get().scheduleTokenRefresh(); // ✅ Schedule token refresh on load
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  scheduleTokenRefresh: () => {
    setTimeout(() => {
      get().refreshToken();
    }, 50 * 1000); // ✅ Refresh 10 sec before expiry (1 min token lifetime)
  },
}));

// ✅ Automatically check token status on page load
useAuthStore.getState().checkToken();
