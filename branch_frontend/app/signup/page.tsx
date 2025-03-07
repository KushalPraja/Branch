'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading && typeof window !== 'undefined') {
    router.push('/dashboard');
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Username validation (alphanumeric, underscores, no spaces)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    
    // Password validation (at least 6 characters)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    console.log('Attempting signup with:', { username, email, password: '***' });
    
    try {
      // Use only the signup function from context - REMOVED direct fetch to avoid duplicate requests
      await signup(username, email, password);
      console.log('Signup successful, redirecting...');
      
    } catch (err: any) {
      console.error('Signup error details:', err);
      
      // More detailed error handling
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        console.log('Error status:', err.response.status);
        console.log('Error headers:', err.response.headers);
        console.log('Error data:', err.response.data);
        
        if (err.response.status === 400) {
          if (typeof err.response.data === 'object' && err.response.data.detail) {
            const detail = err.response.data.detail;
            if (detail.includes('username')) {
              setError('Username already exists');
            } else if (detail.includes('email')) {
              setError('Email already registered');
            } else {
              setError(detail);
            }
          } else {
            setError('Registration failed: Bad request');
          }
        } else {
          setError(`Server error (${err.response.status}). Please try again.`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.log('No response received:', err.request);
        setError('Cannot connect to server. Please check server status and try again.');
      } else {
        // Something happened in setting up the request
        console.log('Error message:', err.message);
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
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
          <h1 className="text-4xl font-bold">Sign Up</h1>
          <p className="mt-2 text-zinc-400">Create your Branch account</p>
        </div>
        
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
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md"
                placeholder="you@example.com"
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
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-zinc-400">Already have an account? </span>
            <Link href="/signin" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
