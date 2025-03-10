export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    tokenRefreshing: boolean; // ✅ Prevents multiple refresh calls
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    checkToken: () => Promise<void>; // ✅ Check token on page load
    scheduleTokenRefresh: () => void; // ✅ Auto-refresh token before expiry
  }
  
  