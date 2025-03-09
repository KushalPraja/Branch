'use client'

import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, BarChart3, Palette, Share2, ShieldCheck } from 'lucide-react';

export function FeaturesSection() {
  const mainFeatures = [
    {
      title: 'Beautiful Themes',
      description: 'Choose from dozens of professionally designed themes or create your own custom look',
      icon: Palette,
      image: '/features/themes.png',
      color: 'from-pink-600 to-purple-600',
    },
    {
      title: 'Detailed Analytics',
      description: 'Track performance with real-time data on clicks, views, and visitor behavior',
      icon: BarChart3,
      image: '/features/analytics.png',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'Social Integration',
      description: 'Connect all your social media platforms and content in one centralized hub',
      icon: Share2,
      image: '/features/social.png',
      color: 'from-green-600 to-teal-600',
    },
  ];

  const secondaryFeatures = [
    {
      title: 'Custom Domains',
      description: 'Use your own domain name for a more professional brand presence',
      icon: ShieldCheck,
    },
    {
      title: 'Mobile Optimization',
      description: 'Your page automatically adjusts to look perfect on any device',
      icon: CheckCircle2,
    },
    {
      title: 'Advanced Customization',
      description: 'Adjust every aspect of your page with our intuitive design tools',
      icon: Sparkles,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Everything you need <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">in one place</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto"
          >
            Powerful tools to help you showcase your content and grow your audience,
            designed with simplicity and performance in mind.
          </motion.p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {mainFeatures.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-700/50 shadow-xl">
              <div className={`aspect-video w-full bg-gradient-to-br ${feature.color} relative overflow-hidden`}>
                {/* This would be replaced with actual feature screenshots/images */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <feature.icon className="h-16 w-16 text-white/80" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm border border-zinc-700/50 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8">
            {secondaryFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-3 rounded-lg mr-4">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-zinc-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
