'use client' 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">Branch</Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-white/80 hover:text-white transition-colors">Features</Link>
          <Link href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</Link>
          <Link href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link>
          <Link href="#faq" className="text-white/80 hover:text-white transition-colors">FAQ</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="hidden md:inline-flex text-white">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild className="bg-white text-black hover:bg-white/90">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
