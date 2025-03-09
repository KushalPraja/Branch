'use client' 

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function PricingSection() {
  const [annual, setAnnual] = useState(true);
  
  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: {
        monthly: "$0",
        annually: "$0",
      },
      features: [
        "1 custom link page",
        "5 link blocks",
        "Basic analytics",
        "Branch branding",
        "Mobile-optimized",
      ],
      cta: "Start for Free",
      ctaLink: "/signup",
      popular: false,
      available: true
    },
    {
      name: "Pro",
      description: "For growing creators",
      price: {
        monthly: "$9",
        annually: "$7",
      },
      features: [
        "Unlimited link pages",
        "Unlimited link blocks",
        "Advanced analytics",
        "Remove Branch branding",
        "Custom domains",
        "Priority support",
        "Advanced customization",
      ],
      cta: "Coming Soon",
      ctaLink: "#",
      popular: true,
      available: false
    },
    {
      name: "Business",
      description: "For teams and agencies",
      price: {
        monthly: "$29",
        annually: "$25",
      },
      features: [
        "Everything in Pro",
        "Team management",
        "Multiple admin users",
        "API access",
        "White-label solution",
        "SSO login",
        "Dedicated account manager",
      ],
      cta: "Coming Soon",
      ctaLink: "#",
      popular: false,
      available: false
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-black to-zinc-900 relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">pricing</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto"
          >
            Choose the plan that is right for you and start building your link hub today
          </motion.p>
          
          <div className="mt-10">
            <div className="flex items-center justify-center space-x-4">
              <button 
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-l-lg ${!annual ? 'bg-white text-black font-medium' : 'bg-zinc-800 text-zinc-400'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-r-lg ${annual ? 'bg-white text-black font-medium' : 'bg-zinc-800 text-zinc-400'}`}
              >
                Annual <span className="text-green-500 text-xs font-bold ml-1">SAVE 20%</span>
              </button>
            </div>
          </div>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              className={`bg-zinc-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border relative ${
                plan.popular ? 'border-purple-500/50 shadow-xl shadow-purple-500/10' : 'border-zinc-700/50'
              }`}
            >
              {!plan.available && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-white">
                  <div className="bg-purple-600/80 px-4 py-2 rounded-lg font-bold text-xl mb-2">
                    Not Available Yet
                  </div>
                  <p className="text-zinc-300 px-6 text-center">
                    This plan will be available soon
                  </p>
                </div>
              )}
              
              {plan.popular && (
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-1.5 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-zinc-400 mt-2">{plan.description}</p>
                
                <p className="text-zinc-400 text-sm mb-6">
                  All the essentials you&apos;ll need to get started
                </p>
                
                <div className="mt-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-white">{annual ? plan.price.annually : plan.price.monthly}</span>
                    <span className="text-zinc-500 ml-2">/mo{annual && ', billed annually'}</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  {plan.available ? (
                    <Button 
                      asChild 
                      className={`w-full py-6 ${
                        plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      <Link href={plan.ctaLink}>{plan.cta}</Link>
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="w-full py-6 cursor-not-allowed opacity-70"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  )}
                </div>
                
                <div className="mt-8 space-y-4">
                  <p className="font-medium text-white text-sm uppercase tracking-wider">What&apos;s included:</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-400 mr-3 shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-zinc-500 mt-4 text-center">
                  No credit card required. You&apos;ll only pay when you&apos;re ready to upgrade.
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <p className="text-zinc-500">
            Need something custom? <Link href="/signup" className="text-blue-400 hover:underline">Join the waitlist</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
