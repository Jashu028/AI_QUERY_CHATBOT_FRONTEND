import { create } from "zustand";
import {api} from "../util/axios";
import { AuthState, User } from "../types/auth";
import { useCartStore } from "./cartStore";





export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  tokenRefreshing: false,

  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      useCartStore.getState().fetchCart();
      const user = response.data.user;
      set({ user, isAuthenticated: true });

      get().scheduleTokenRefresh();
    } catch (error) {
      console.error("Login failed:", error);
    }
  },

  logout: async () => {
    try {
      await useCartStore.getState().saveCartToDB();
      await api.get("/logout");
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  refreshToken: async () => {
    if (get().tokenRefreshing) return;
    set({ tokenRefreshing: true });

    try {
      await api.get("/refresh");
      set({ tokenRefreshing: false });
      get().scheduleTokenRefresh();
    } catch (error) {
      console.error("Token refresh failed, logging out...");
      set({ user: null, isAuthenticated: false, tokenRefreshing: false });
    }
  },

  checkToken: async () => {
    try {
      const response = await api?.get("/check-auth");
      const user = response.data.user;
      set({ user, isAuthenticated: true });
      useCartStore.getState().fetchCart();
      get().scheduleTokenRefresh();
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  scheduleTokenRefresh: () => {
    setTimeout(() => {
      get().refreshToken();
    }, 50 * 1000);
  },
}));

useAuthStore.getState().checkToken();
