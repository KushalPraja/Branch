'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-zinc-900 to-black"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-700/30 blur-[100px]"></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-blue-700/20 blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              <span className="block">One link for</span> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">all your content</span>
            </h1>
            <p className="text-xl mt-6 text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Create your stunning link page in seconds. Bring together your socials, content, and more in one beautiful destination.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
              <Button asChild size="lg" className="text-lg py-6 px-8 bg-white text-black hover:bg-white/90">
                <Link href="/signup">Start for free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg py-6 px-8">
                <Link href="#demo">Watch demo</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-[9/16] w-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-1 bg-black rounded-3xl overflow-hidden">
                  <Image
                    src="/demo-profile.png" 
                    alt="Branch Demo Profile"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -right-12 top-1/4 p-3 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg">
                <p className="text-sm font-medium text-white">200+ clicks today</p>
              </div>
              <div className="absolute -left-8 bottom-1/3 p-3 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg">
                <p className="text-sm font-medium text-white">+23% engagement</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Trusted by brands */}
        <div className="mt-20 text-center">
          <p className="text-zinc-500 mb-6 uppercase tracking-wider text-sm">Trusted by creators worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70">
            {['Spotify', 'YouTube', 'Instagram', 'TikTok', 'Twitter'].map((brand) => (
              <div key={brand} className="text-zinc-400 font-semibold">{brand}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-8 h-12 border-2 border-white/20 rounded-full flex items-start justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
}
