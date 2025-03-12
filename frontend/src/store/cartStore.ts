import { create } from "zustand";
import { CartItem, Product } from "../types/product";
import { api } from "../util/axios";

interface CartState {
  items: CartItem[];
  addedToCart: CartItem[];
  updatedCount: { productId: string; quantity: number }[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  fetchCart: () => Promise<void>;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  saveCartToDB: () => Promise<void>;
  total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addedToCart: [],
  updatedCount: [],
  total: 0,

  fetchCart: async () => {
    try {
      const response = await api.get("/products/cart");
      const items_ = response.data.items;

      
      const cartItems = items_.map((item: any) => ({
        productId: item.product_Id.productId,
        name: item.product_Id.name,
        description: item.product_Id.description,
        price: item.product_Id.price,
        image: item.product_Id.image,
        rating: item.product_Id.rating,
        reviews: item.product_Id.reviews,
        quantity: item.quantity,
      }));

      
      const totalPrice = items_.reduce((total: number, item: any) => {
        return total + item.product_Id.price * item.quantity;
      }, 0);

      set({ items: cartItems, total: totalPrice });
      console.log("Cart fetched successfully!", cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  },

  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.productId === product.productId);

      if (existingItem) {
        const updatedCount = state.updatedCount.filter((u) => u.productId !== product.productId);
        updatedCount.push({ productId: product.productId, quantity: existingItem.quantity + quantity });

        return {
          items: state.items.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          total: state.total + product.price * quantity,
          updatedCount,
        };
      }

      return {
        items: [...state.items, { ...product, quantity }],
        total: state.total + product.price * quantity,
        addedToCart: [...state.addedToCart, { ...product, quantity }],
      };
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => {
      const item = state.items.find((i) => i.productId === productId);
      if (!item) return state;

      const quantityDiff = quantity - item.quantity;

    
      const updatedCount = state.updatedCount.filter((u) => u.productId !== productId);
      updatedCount.push({ productId, quantity });

      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        ),
        total: state.total + item.price * quantityDiff,
        updatedCount,
      };
    });
  },

  removeItem: (productId: string) => {
    set((state) => {
      const item = state.items.find((i) => i.productId === productId);
      if (!item) return state;
  
      const updatedCount = state.updatedCount.filter((u) => u.productId !== productId);
      updatedCount.push({ productId, quantity: 0 });
  
      return {
        items: state.items.filter((i) => i.productId !== productId),
        total: state.total - item.price * item.quantity,
        updatedCount,
      };
    });
  },

  clearCart: () => {
    set({ items: [], addedToCart: [], updatedCount: [], total: 0 });
  },

  saveCartToDB: async () => {
    const { addedToCart, updatedCount } = get();

    if (addedToCart.length || updatedCount.length) {
      try {
        console.log(addedToCart, updatedCount);
        await api.post("/products/cart/update", { addedToCart, updatedCount });
        console.log("Cart changes saved to DB!");

        set({ addedToCart: [], updatedCount: [] });
      } catch (error) {
        console.error("Error saving cart data:", error);
      }
    }
  },
}));
