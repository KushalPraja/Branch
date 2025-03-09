'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Demo from './demo-profile.png';

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-zinc-900 to-black"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[30%] max-w-96 aspect-square rounded-full bg-purple-700/30 blur-[100px]"></div>
        <div className="absolute top-1/2 right-1/3 w-[25%] max-w-80 aspect-square rounded-full bg-blue-700/20 blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left w-full"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              <span className="block">One link for</span> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">all your content</span>
            </h1>
            <p className="text-lg sm:text-xl mt-4 sm:mt-6 text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Create your stunning link page in seconds. Bring together your socials, content, and more in one beautiful destination.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 lg:justify-start justify-center">
              <Button asChild size="lg" className="text-base sm:text-lg py-5 sm:py-6 px-6 sm:px-8 bg-white text-black hover:bg-white/90 w-full sm:w-auto">
                <Link href="/signup">Start for free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base sm:text-lg py-5 sm:py-6 px-6 sm:px-8 w-full sm:w-auto">
                <Link href="#demo">Watch demo</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative mt-12 lg:mt-0 w-full max-w-[320px] md:max-w-md mx-auto"
          >
            <div className="relative w-full">
              <div className="aspect-[9/16] w-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-1 bg-black rounded-3xl overflow-hidden">
                  <Image
                  src={Demo}
                  alt="Branch Demo Profile"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  quality={100}
                  placeholder="blur"
                  />
                </div>
              </div>
              {/* Floating badges - more responsive positioning */}
              <div className="absolute -right-6 sm:-right-12 top-1/4 p-2 sm:p-3 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg">
                <p className="text-xs sm:text-sm font-medium text-white">200+ clicks today</p>
              </div>
              <div className="absolute -left-4 sm:-left-8 bottom-1/3 p-2 sm:p-3 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg">
                <p className="text-xs sm:text-sm font-medium text-white">+23% engagement</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Trusted by brands */}
        <div className="mt-14 sm:mt-20 text-center">
          <p className="text-zinc-500 mb-4 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">Trusted by creators worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-8 opacity-70">
            {['Spotify', 'YouTube', 'Instagram', 'TikTok', 'Twitter'].map((brand) => (
              <div key={brand} className="text-zinc-400 text-sm sm:text-base font-semibold">{brand}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 sm:w-8 h-10 sm:h-12 border-2 border-white/20 rounded-full flex items-start justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
}
