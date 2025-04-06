import { create } from 'zustand';
import { api } from '../util/axios';
import { Admin, AdminStore, Order, Product } from '../types/admin';
import { useAuthStore } from './authStore';


export const useAdminStore = create<AdminStore>((set) => ({
    admin: null,
  
    fetchAdmin: async () => {
      try {
        const res = await api.get<Admin>('/admin/profile');
        set({ admin: res.data });
      } catch (error) {
        useAuthStore.getState().logout();
      }
    },
  
    fetchAllOrders: async () => {
      const res = await api.get<Order[]>('/admin/orders');
      return res.data;
    },
  
    updateOrderStatus: async (orderId, updates) => {
      await api.patch(`/admin/orders/${orderId}`, updates);
    },
  
    fetchAllProducts: async () => {
      const res = await api.get<Product[]>('/admin/products');
      return res.data;
    },
  
    addProduct: async (productData) => {
      await api.post('/admin/products', productData);
    },
  
    updateProduct: async (productId, updates) => {
      await api.patch(`/admin/products/${productId}`, updates);
    },
  
    deleteProduct: async (productId) => {
      await api.delete(`/admin/products/${productId}`);
    },
  }));