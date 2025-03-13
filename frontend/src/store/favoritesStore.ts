import { create } from "zustand";
import { Product } from "../types/product";
import { api } from "../util/axios";

interface FavoritesState {
  favorites: Product[];
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (product: Product) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  fetchFavorites: async () => {
    try {
      const response = await api.get("/products/favorites");
      set({ favorites: response.data });
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  },

  toggleFavorite: async (product: Product) => {
    try {
      const { favorites } = get();
      const isFavorite = favorites.some((fav) => fav.productId === product.productId);

      if (isFavorite) {
        await api.delete(`/products/favorites/${product.productId}`);
        set({ favorites: favorites.filter((fav) => fav.productId !== product.productId) });
      } else {
        await api.post("/products/favorites", { productId: product.productId });
        set({ favorites: [...favorites, product] });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  },
}));
