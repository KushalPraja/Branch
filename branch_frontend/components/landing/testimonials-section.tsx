'use client' 

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Branch has completely transformed how I manage my online presence. I've seen a 40% increase in engagement across my platforms since switching.",
      author: "Sarah Johnson",
      role: "Content Creator | 500K+ Followers",
      avatar: "https://i.pravatar.cc/150?img=32",
      platform: "Instagram",
      rating: 5,
    },
    {
      quote: "The analytics alone are worth it. Being able to see which links perform best has helped me optimize my content strategy in ways I never could before.",
      author: "David Chen",
      role: "Digital Marketer | Tech Influencer",
      avatar: "https://i.pravatar.cc/150?img=12",
      platform: "YouTube",
      rating: 5,
    },
    {
      quote: "I used to juggle multiple link platforms. Branch is cleaner, faster, and gives me way more customization options. My followers love the new look.",
      author: "Aisha Patel",
      role: "Fashion Blogger | Brand Ambassador",
      avatar: "https://i.pravatar.cc/150?img=28",
      platform: "TikTok",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Fix the dependency warning by using useCallback
  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [nextTestimonial]); // Add missing dependency

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black z-0"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-600/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Loved by creators worldwide</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Thousands of content creators trust Branch to connect with their audience
            </p>
          </motion.div>
        </div>
        
        <div className="relative">
          {/* Navigation arrows */}
          <button 
            onClick={prevTestimonial} 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hidden md:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextTestimonial} 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hidden md:block"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full">
                  <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-zinc-700/50 shadow-xl">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/3">
                          <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-600/20 mx-auto relative">
                              <Image 
                                src={testimonial.avatar} 
                                alt={testimonial.author}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs py-1 px-3 rounded-full">
                              {testimonial.platform}
                            </div>
                          </div>
                          
                          <div className="text-center mt-6">
                            <h3 className="text-xl font-semibold text-white">{testimonial.author}</h3>
                            <p className="text-zinc-500 text-sm mt-1">{testimonial.role}</p>
                            
                            <div className="flex justify-center mt-3">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 mt-6 md:mt-0">
                          <div className="relative">
                            <Quote className="absolute -top-6 -left-6 w-12 h-12 text-purple-600/20" />
                            <p className="text-xl md:text-2xl font-light text-zinc-300 italic leading-relaxed">
                              &ldquo;{testimonial.quote}&rdquo;
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
