'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Check for registration success message in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please sign in.');
    }
  }, []);
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading && typeof window !== 'undefined') {
    router.push('/dashboard');
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(username, password);
      // Successful login will redirect in the login function
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-black text-white">
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Sign In</h1>
          <p className="mt-2 text-zinc-400">Welcome back to Branch</p>
        </div>
        
        {successMessage && (
          <div className="bg-green-900/50 border border-green-800 p-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/50 border border-red-800 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
                placeholder="yourusername"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 bg-zinc-800 border-zinc-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link href="/forgot-password" className="text-indigo-400 hover:text-indigo-300">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-zinc-400">Don't have an account? </span>
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
