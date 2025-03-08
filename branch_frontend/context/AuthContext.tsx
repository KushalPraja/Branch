'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Define user type
type User = {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  links?: Array<{
    id: string;
    title: string;
    url: string;
    icon?: string;
  }>;
  theme?: {
    pageBackground?: string;
    buttonStyle?: 'solid' | 'outline' | 'gradient';
  };
};

// Define context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// API base URL - make sure this matches your backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';  // Changed from 127.0.0.1 to localhost
const API_PREFIX = '/api/v1'; // This should match your backend's API_PREFIX

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Changed to false as your backend doesn't seem to handle credentials
  timeout: 10000, // Add timeout to prevent hanging requests
});

// Helper to set auth token on axios requests
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

// Ensure token is set on startup (client-side only)
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('authToken');
  if (token) setAuthToken(token);
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for stored auth token
        const token = localStorage.getItem('authToken');
        
        if (token) {
          setAuthToken(token); // Ensure token is set in axios headers
          
          // Fetch current user data
          const response = await api.get(`${API_PREFIX}/me/`);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthToken(null); // Clear invalid token
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Use URLSearchParams for API that expects x-www-form-urlencoded data
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      
      // FastAPI OAuth2 endpoint expects x-www-form-urlencoded data
      const response = await api.post(`${API_PREFIX}/auth/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Store the token in axios headers & localStorage
      const token = response.data.access_token;
      setAuthToken(token);
      
      // Get user data with token
      const userResponse = await api.get(`${API_PREFIX}/me/`);
      setUser(userResponse.data);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Sending signup request to:', `${API_URL}${API_PREFIX}/users/`);
      
      // Register the user - with more debugging info
      const signupResponse = await api.post(`${API_PREFIX}/users/`, 
        { username, email, password },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000 // Longer timeout for signup
        }
      );
      
      console.log('Signup response received:', signupResponse.status, signupResponse.data);
      
      // After registration, log them in
      try {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        
        console.log('Attempting login after signup');
        
        const loginResponse = await api.post(`${API_PREFIX}/auth/token`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        
        // Store the token
        const token = loginResponse.data.access_token;
        setAuthToken(token);
        
        // Get user data with token
        const userResponse = await api.get(`${API_PREFIX}/me/`);
        setUser(userResponse.data);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (loginError: any) {
        console.error('Auto-login after signup failed:', loginError.message);
        router.push('/signin?registered=true');
      }
    } catch (error: any) {
      console.error('Signup failed with error:', error.message);
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setAuthToken(null); // Clear token from headers & localStorage
    setUser(null);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export the api and helper for use in API functions
export { api, setAuthToken };
