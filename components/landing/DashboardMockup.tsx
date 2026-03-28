'use client';

import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  BarChart3, 
  Settings, 
  Layout, 
  Zap, 
  Database,
  Globe,
  MousePointer2,
  CheckCircle2
} from 'lucide-react';

export const DashboardMockup = () => {
  return (
    <div className="relative w-full aspect-[16/10] bg-zinc-950 rounded-[2.5rem] border-[12px] border-zinc-900 shadow-2xl overflow-hidden group">
      {/* Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-20 border-r border-zinc-800 bg-zinc-950 flex flex-col items-center py-8 gap-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"><Layout className="w-5 h-5" /></div>
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"><BarChart3 className="w-5 h-5" /></div>
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"><Globe className="w-5 h-5" /></div>
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"><Settings className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-20 p-8 h-full flex flex-col gap-8 bg-zinc-950">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">Project Dashboard</h4>
            <p className="text-sm text-zinc-500">Manage your SEO architectures</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-zinc-900 rounded-lg flex items-center gap-2 border border-zinc-800">
               <Search className="w-4 h-4 text-zinc-500" />
               <span className="text-sm text-zinc-500">Search projects...</span>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" /> New App
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Hits</div>
            <div className="text-2xl font-black text-white">142.8k</div>
            <div className="text-xs text-emerald-500 font-bold">+12.5%</div>
          </div>
          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Avg Performance</div>
            <div className="text-2xl font-black text-white">98/100</div>
            <div className="text-xs text-emerald-500 font-bold">+2.1%</div>
          </div>
          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">ISR Build Time</div>
            <div className="text-2xl font-black text-white">42ms</div>
            <div className="text-xs text-indigo-400 font-bold">Optimal</div>
          </div>
        </div>

        {/* Editor Preview */}
        <div className="flex-1 rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-6 relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                 <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="px-4 py-1 bg-zinc-800 rounded-full text-[10px] text-zinc-400 font-bold tracking-widest uppercase border border-zinc-700">Visual Editor (Draft)</div>
           </div>
           
           <div className="grid grid-cols-12 gap-8">
             <div className="col-span-4 space-y-4">
                <div className="h-40 bg-zinc-800 rounded-2xl" />
                <div className="h-4 bg-zinc-800 rounded-full w-full" />
                <div className="h-4 bg-zinc-800 rounded-full w-2/3" />
             </div>
             <div className="col-span-8 border-2 border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] relative">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center"
                >
                  <Plus className="w-8 h-8 text-indigo-500" />
                </motion.div>
                <div className="mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Drop elements here</div>
                
                {/* Animated Mouse */}
                <motion.div
                  animate={{ 
                    x: [0, 40, -20, 0],
                    y: [0, -30, 20, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute z-20"
                >
                  <MousePointer2 className="w-6 h-6 text-white drop-shadow-xl" />
                </motion.div>
             </div>
           </div>
           
           {/* Success Toast Placeholder */}
           <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="absolute bottom-6 right-6 bg-emerald-500 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-xl"
           >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">Successfully saved to your database</span>
           </motion.div>
        </div>
      </div>
      
      {/* Decorative Blur */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full group-hover:bg-indigo-600/30 transition-colors" />
    </div>
  );
};
