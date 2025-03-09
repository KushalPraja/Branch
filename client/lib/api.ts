import { api } from '@/context/AuthContext';

// API prefix that matches your backend
const API_PREFIX = '/api/v1';

// Authentication endpoints
export const login = async (username: string, password: string) => {
  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    const response = await api.post(`${API_PREFIX}/auth/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Define proper interfaces for API error responses
interface ApiErrorResponse {
  status?: number;
  data?: unknown;
}

interface ApiError {
  name?: string;
  response?: ApiErrorResponse;
  request?: unknown;
}

export const signup = async (userData: { username: string; email: string; password: string }) => {
  try {
    console.log('API: Sending signup request to:', `${API_PREFIX}/users/`);
    
    // Try the request with custom settings to help diagnose issues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await api.post(`${API_PREFIX}/users/`, userData, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('API: Signup response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    return response;
  } catch (error: unknown) {
    console.error('API: Signup failed with error:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('API: Request timed out after 15 seconds');
    }
    
    if (error && typeof error === 'object' && 'response' in error) {
      const errorWithResponse = error as ApiError;
      if (errorWithResponse.response) {
        console.error('API: Server responded with status:', errorWithResponse.response.status);
        console.error('API: Response data:', errorWithResponse.response.data);
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      console.error('API: No response received from server');
    }
    
    throw error;
  }
};

// User profile endpoints
export const getCurrentUser = async () => {
  try {
    const response = await api.get(`${API_PREFIX}/me/`);
    return response;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const getUserProfile = async (username: string) => {
  try {
    const response = await api.get(`${API_PREFIX}/users/${username}`);
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateProfile = async (data: { 
  name?: string; 
  bio?: string;
  avatar?: string | null;
  theme?: {
    pageBackground?: string;
    buttonStyle?: string;
    fontFamily?: string;
    customBackground?: string | null;
  }
}) => {
  try {
    const response = await api.put(`${API_PREFIX}/me/`, data);
    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Link management endpoints
export const createLink = async (linkData: { title: string; url: string; icon?: string }) => {
  try {
    const response = await api.post(`${API_PREFIX}/me/links/`, linkData);
    return response;
  } catch (error) {
    console.error('Error creating link:', error);
    throw error;
  }
};

export const updateLink = async (linkId: string, linkData: { title: string; url: string; icon?: string }) => {
  try {
    const response = await api.put(`${API_PREFIX}/me/links/${linkId}`, linkData);
    return response;
  } catch (error) {
    console.error('Error updating link:', error);
    throw error;
  }
};

export const deleteLink = async (linkId: string) => {
  try {
    const response = await api.delete(`${API_PREFIX}/me/links/${linkId}`);
    return response;
  } catch (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
};

// Utility functions
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Utility function to refresh token if needed
export const refreshAuthState = async () => {
  try {
    // Check if token exists and fetch user data
    const token = localStorage.getItem('authToken');
    if (token) {
      const userResponse = await getCurrentUser();
      return userResponse.data;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing auth state:', error);
    // If there's an error (like token expired), clear the token
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    return null;
  }
};

