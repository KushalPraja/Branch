'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-gradient-to-br from-zinc-800/50 via-zinc-900/50 to-black/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-zinc-700/30 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-3/5">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              >
                Ready to create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">perfect link hub?</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-zinc-400 mt-6"
              >
                Join thousands of creators who trust Branch to connect with their audience. Start for free and upgrade anytime.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="text-lg py-6 px-10 bg-white text-black hover:bg-white/90 shadow-lg shadow-purple-500/20">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg py-6 px-8">
                  <Link href="#demo">Schedule a Demo</Link>
                </Button>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-zinc-500 text-sm mt-6"
              >
                No credit card required. Cancel anytime.
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:w-2/5 flex justify-center"
            >
              <div className="w-56 h-56 md:w-64 md:h-64 relative">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border-4 border-blue-500/20 animate-spin-slow-reverse"></div>
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">14k+</span>
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg py-2 px-4 shadow-xl">
                  <p className="text-white font-medium">Creators</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
