export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    tokenRefreshing: boolean;
    login: (email: string, password: string) => Promise<string | undefined>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    checkToken: () => Promise<void>;
    scheduleTokenRefresh: () => void;
    clearTokenRefresh: () => void;
  }
  
  