'use client';

import { motion } from 'motion/react';
import { LayoutTemplate, Globe, Database, Zap } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer className="bg-black pt-40 pb-20 px-6 border-t border-zinc-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 relative z-10">
        <div className="col-span-2 space-y-10">
           <div className="flex items-center gap-2 text-3xl font-black text-white tracking-tighter">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutTemplate className="w-8 h-8 text-white" />
            </div>
            seoMaker
          </div>
          <p className="text-zinc-500 max-w-sm font-bold leading-relaxed text-lg">
            Building the future of SEO infrastructure. Visually designed, natively deployed, and 100% owned by you.
          </p>
          <div className="flex gap-6">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group">
              <Globe className="w-6 h-6 text-zinc-500 group-hover:text-white" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group">
              <Database className="w-6 h-6 text-zinc-500 group-hover:text-white" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group">
              <Zap className="w-6 h-6 text-zinc-500 group-hover:text-white" />
            </div>
          </div>
        </div>
        
        {[
          { title: "Product", links: ["Features", "Changelog", "Pricing", "Docs"] },
          { title: "Resources", links: ["Blog", "Templates", "Help Center", "Community"] },
          { title: "Legal", links: ["Privacy", "Terms", "Cookies", "License"] }
        ].map((col) => (
          <div key={col.title} className="space-y-8">
            <h4 className="text-white font-black text-xs tracking-[0.3em] uppercase">{col.title}</h4>
            <ul className="space-y-5 text-zinc-500 font-bold text-sm">
              {col.links.map((link) => (
                <li key={link} className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto mt-40 pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2026 seoMaker Inc. All rights reserved.
        </div>
        <div className="flex gap-10 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            System Operational
          </span>
          <span>Made for SEO Architects</span>
        </div>
      </div>

      {/* Background Flare */}
      <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
    </footer>
  );
};
