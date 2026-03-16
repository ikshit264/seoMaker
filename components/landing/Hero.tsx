'use client';

import { motion, MotionValue } from 'motion/react';
import { ArrowRight, Sparkles, Zap, Database, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { Floatie } from './Floatie';
import { DashboardMockup } from './DashboardMockup';

interface HeroProps {
  textColor: MotionValue<string>;
  isAuthenticated: boolean | null;
}

export const Hero = ({ textColor, isAuthenticated }: HeroProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center overflow-visible relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto z-10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black mb-10 tracking-[0.2em] uppercase shadow-sm"
        >
          <Sparkles className="w-3 h-3" />
          The Future of SEO Infrastructure
        </motion.div>
        
        <motion.h1 
          style={{ color: textColor }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.04em] leading-[0.85] mb-6 sm:mb-10 px-2"
        >
          Build SEO <br />
          <span className="text-indigo-600">Masterpieces</span>
        </motion.h1>
        
        <p className="text-lg md:text-2xl text-zinc-500 max-w-3xl mx-auto leading-relaxed font-semibold mb-10 sm:mb-14 px-6 sm:px-4">
          The high-fidelity visual builder for Next.js that syncs directly with your MongoDB. Zero vendor lock-in, just pure performance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-6 sm:px-0">
          <Link href="/signup" className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 sm:px-10 py-5 sm:py-6 rounded-2xl text-lg sm:text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            Start Building Free
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-zinc-900 px-8 sm:px-10 py-5 sm:py-6 rounded-2xl text-lg sm:text-xl font-black border-2 border-zinc-200 hover:bg-white/50 transition-all">
            Book a Demo
          </button>
        </div>
      </motion.div>

      {/* Hero Illustration / Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-20 sm:mt-32 relative w-full max-w-7xl mx-auto px-4 perspective-[2000px]"
      >
        <DashboardMockup />
        
        {/* Animated Floaties around the mockup - Hidden on very small screens for clarity */}
        <div className="hidden sm:block">
        <Floatie className="-top-20 -left-10 lg:-left-20" delay={0.2} duration={6}>
          <Zap className="w-6 h-6 text-amber-500" />
          <div>
            <div className="font-black text-zinc-900 text-sm">ISR Ready</div>
            <div className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">Sub-100ms load</div>
          </div>
        </Floatie>

        <Floatie className="-bottom-16 -right-10 lg:-right-20" delay={0.5} duration={7} yOffset={-30}>
          <Database className="w-6 h-6 text-emerald-500" />
          <div>
            <div className="font-black text-zinc-900 text-sm">Your MongoDB</div>
            <div className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">100% Data ownership</div>
          </div>
        </Floatie>

        <Floatie className="top-1/2 -right-20 hidden xl:flex" delay={0.8} duration={8}>
          <LayoutTemplate className="w-6 h-6 text-indigo-500" />
          <div>
            <div className="font-black text-zinc-900 text-sm">Visual Canvas</div>
            <div className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">Pixel Perfect</div>
          </div>
        </Floatie>
        </div>
      </motion.div>
    </section>
  );
};
