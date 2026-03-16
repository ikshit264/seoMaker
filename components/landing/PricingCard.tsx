'use client';

import { motion } from 'motion/react';
import { PricingCardProps } from './types';
import { Check } from 'lucide-react';

export const PricingCard = ({ 
  tier, 
  price, 
  description, 
  features, 
  highlight = false 
}: PricingCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`p-8 rounded-3xl border transition-all duration-300 ${
      highlight 
        ? 'border-indigo-500 bg-zinc-900/40 relative overflow-hidden scale-105 shadow-[0_30px_60px_rgba(79,70,229,0.15)]' 
        : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700'
    } backdrop-blur-sm`}
  >
    {highlight && (
      <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest z-10">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
    <div className="flex items-baseline gap-1 mb-4">
      <span className="text-4xl font-bold text-white">${price}</span>
      <span className="text-zinc-500 text-sm">/month</span>
    </div>
    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
      {description}
    </p>
    <ul className="space-y-4 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
          <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-indigo-400" />
          </div>
          {feature}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
      highlight 
        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
    }`}>
      Get Started
    </button>
  </motion.div>
);
