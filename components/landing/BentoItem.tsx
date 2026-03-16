'use client';

import { BentoItemProps } from './types';

export const BentoItem = ({ 
  title, 
  description, 
  icon: Icon, 
  className = "",
  colorClass = "text-indigo-500"
}: BentoItemProps) => (
  <div className={`p-8 rounded-[2rem] border border-black/5 bg-white/40 backdrop-blur-sm flex flex-col justify-between group hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 ${className}`}>
    <div className="space-y-4">
      <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
        <Icon className={`w-7 h-7 ${colorClass}`} />
      </div>
      <div>
        <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-zinc-600 font-medium leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  </div>
);
