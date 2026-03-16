'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface FloatieProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export const Floatie = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 5,
  yOffset = 20
}: FloatieProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      animate={{ 
        y: [0, yOffset, 0],
      }}
      transition={{ 
        y: {
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay
        },
        opacity: { duration: 0.8, delay },
        y: { duration: 0.8, delay } // Initial reveal
      }}
      className={`absolute z-20 ${className}`}
    >
      <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 rounded-2xl flex items-center gap-4 group hover:scale-105 transition-transform duration-300">
        {children}
      </div>
    </motion.div>
  );
};
