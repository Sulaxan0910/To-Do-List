// frontend/src/utils/auth.ts
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// JWT utility functions
export const jwtUtils = {
  // Parse JWT token to extract payload
  parseJwt: (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = jwtUtils.parseJwt(token);
      if (!payload || !payload.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
};

// Local storage utilities for authentication
export const authStorage = {
  // Get token from local storage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Set token in local storage
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Remove token from local storage
  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  // Get user data from local storage
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set user data in local storage
  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Remove user data from local storage
  removeUser: (): void => {
    localStorage.removeItem('user');
  },

  // Clear all authentication data from local storage
  clearAuthData: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated (has valid token)
  isAuthenticated: (): boolean => {
    const token = authStorage.getToken();
    if (!token) return false;
    
    // Check if token is expired
    return !jwtUtils.isTokenExpired(token);
  },

  // Check if token is expired (added to fix the error)
  isTokenExpired: (token: string): boolean => {
    return jwtUtils.isTokenExpired(token);
  },

  // Get authentication headers for API requests
  getAuthHeaders: (): Record<string, string> => {
    const token = authStorage.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

// Authentication helper functions
export const authHelpers = {
  // Validate email format
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Format user display name
  getDisplayName: (user: User | null): string => {
    if (!user) return 'Guest';
    
    if (user.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  },

  // Get user initials for avatar
  getUserInitials: (user: User | null): string => {
    if (!user) return 'GU';
    
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'GU';
  }
};

// Session management
export const sessionManager = {
  // Initialize session monitoring
  initSessionMonitoring: (onSessionExpired: () => void) => {
    const checkSession = () => {
      const token = authStorage.getToken();
      if (token && jwtUtils.isTokenExpired(token)) {
        onSessionExpired();
      }
    };

    // Check session every minute
    const intervalId = setInterval(checkSession, 60000);
    
    // Also check on window focus
    window.addEventListener('focus', checkSession);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', checkSession);
    };
  },

  // Get session info
  getSessionInfo: () => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    
    if (!token || !user) {
      return null;
    }
    
    const payload = jwtUtils.parseJwt(token);
    const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : null;
    const issuedAt = payload?.iat ? new Date(payload.iat * 1000) : null;
    
    return {
      user,
      expiresAt,
      issuedAt,
      token
    };
  }
};

// Export all utilities
export default {
  jwtUtils,
  authStorage,
  authHelpers,
  sessionManager
};