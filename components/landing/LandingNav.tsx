'use client';

import { motion, MotionValue, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import Link from 'next/link';
import { LayoutTemplate, Menu, X } from 'lucide-react';

interface NavProps {
  textColor: MotionValue<string>;
  navBg: MotionValue<string>;
  navBorder: MotionValue<string>;
  isAuthenticated: boolean | null;
}

export const LandingNav = ({ textColor, navBg, navBorder, isAuthenticated }: NavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Process', href: '#process' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#docs' },
  ];

  return (
    <motion.nav 
      style={{ backgroundColor: navBg, borderColor: navBorder }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <motion.div 
          style={{ color: textColor }}
          className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tighter shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutTemplate className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          seoMaker
        </motion.div>
        
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              style={{ color: textColor }}
              className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity"
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-4">
            {isAuthenticated === false && (
              <Link href="/login" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
                Log in
              </Link>
            )}
          </div>
          <Link 
            href={isAuthenticated ? "/apps" : "/signup"} 
            className="bg-indigo-600 text-white text-xs sm:text-sm font-black px-4 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
          >
            {isAuthenticated ? "Dashboard" : "Get Started"}
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-zinc-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-zinc-900 hover:text-indigo-600 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="h-px bg-zinc-100 my-2" />
              {isAuthenticated === false && (
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-zinc-500"
                >
                  Log in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
