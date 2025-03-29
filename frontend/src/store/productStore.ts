import { create } from "zustand";
import { api } from "../util/axios";
import { Product } from "../types/product";

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  fetchProductById: (productId: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,


  fetchProductById: async (productId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<Product>(`/products/product/${productId}`);
      set({ product: res.data });
    } catch (err) {
      console.error("Error fetching product:", err);
      set({ error: "Failed to load product" });
    } finally {
      set({ loading: false });
    }
  },
}));
