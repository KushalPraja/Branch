'use client' 

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export function FAQSection() {
  const faqs = [
    {
      question: "What is Branch?",
      answer: "Branch is a platform that allows you to create custom link pages to share all your content in one place. It's perfect for creators, influencers, businesses, and anyone looking to centralize their online presence."
    },
    {
      question: "How does the free plan work?",
      answer: "Our free plan allows you to create one custom link page with up to 5 link blocks. You'll have access to basic analytics and your page will include Branch branding. It's perfect for getting started and testing the platform."
    },
    {
      question: "Can I use my own custom domain?",
      answer: "Yes! With our Pro and Business plans, you can connect your own custom domain to your Branch page, giving your link hub a more professional and branded appearance."
    },
    {
      question: "What kind of analytics do you provide?",
      answer: "We provide comprehensive analytics including page views, link clicks, geographic location of visitors, referral sources, device types, and more. Our Pro and Business plans include advanced analytics with more detailed insights."
    },
    {
      question: "How does Branch compare to other link in bio tools?",
      answer: "Branch offers more customization options, better analytics, and a more intuitive user interface than most competitors. Our platform is designed with performance and aesthetics in mind, giving your audience a seamless experience."
    },
    {
      question: "Can I have multiple pages or profiles?",
      answer: "Yes, our Pro and Business plans allow you to create multiple link pages for different purposes or brands. You can manage them all from a single dashboard."
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-black relative">
      {/* Background elements */}
      <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-blue-600/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Frequently asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">questions</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto"
          >
            Everything you need to know about Branch and how it can help you grow your audience
          </motion.p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden border ${
                activeIndex === index 
                  ? 'bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border-purple-500/30' 
                  : 'bg-zinc-900/30 border-zinc-800/50'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
              >
                <h3 className="text-xl font-medium text-white">{faq.question}</h3>
                <div className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-45' : 'rotate-0'}`}>
                  <Plus className={`w-6 h-6 ${activeIndex === index ? 'text-purple-400' : 'text-zinc-500'}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 border-t border-zinc-800">
                      <p className="text-zinc-400">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-zinc-400">
            Still have questions? <a href="#contact" className="text-purple-400 hover:text-purple-300">Contact our support team</a>
          </p>
        </div>
      </div>
    </section>
  );
}
