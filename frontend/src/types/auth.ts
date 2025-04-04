export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    tokenRefreshing: boolean;
    // refreshTimeoutId: null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    checkToken: () => Promise<void>;
    scheduleTokenRefresh: () => void;
    clearTokenRefresh: () => void;
  }
  
  