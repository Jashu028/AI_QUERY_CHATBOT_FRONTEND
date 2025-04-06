import { create } from "zustand";
import { Order } from "../types/order";
import { api } from "../util/axios";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  returnOrder: (orderId: string, reason: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/products/order");
      set({ orders: response.data.orders, loading: false });
    } catch (error: any) {
      // console.error("Failed to fetch orders:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch orders",
      });
    }
  },

  returnOrder: async (orderId: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      await api.put(`/products/order/${orderId}/return`, { reason });
      await get().fetchOrders();
    } catch (error: any) {
      // console.error("Failed to request return:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to request return",
      });
    }
  },
}));
