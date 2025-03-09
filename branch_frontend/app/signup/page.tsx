'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

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
    
    try {
      await signup(username, email, password);
      console.log('Signup successful, redirecting...');
    } catch (err: Error | unknown) {
      console.error('Signup error details:', err);
      
      if (err instanceof Error) {
        console.log('Error message:', err.message);
        setError('An error occurred during signup. Please try again.');
      } else {
        console.log('Unknown error:', err);
        setError('An unknown error occurred during signup. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-6 overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
        </div>
        <div className="z-10">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
        
        {/* Animated circles/orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{
            x: [0, 15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="z-10 w-full max-w-md">
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50 shadow-xl">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="text-zinc-400 hover:text-white flex items-center"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Back</span>
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-6">Create your account</h1>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-md text-sm mb-6 text-white">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-400 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-zinc-900/70 border border-zinc-700 rounded-md text-white"
                placeholder="yourusername"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-zinc-900/70 border border-zinc-700 rounded-md text-white"
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-zinc-900/70 border border-zinc-700 rounded-md text-white"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700" 
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
    </div>
  );
}
