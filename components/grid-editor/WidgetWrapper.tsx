'use client';

import React from 'react';
import { X, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

interface WidgetWrapperProps {
  id: string;
  title: string;
  onRemove: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onGenerateAi?: (id: string) => void;
  children: React.ReactNode;
  mode?: 'edit' | 'view';
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function WidgetWrapper({ 
  id, 
  title, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onGenerateAi,
  children, 
  mode = 'edit',
  selected = false,
  onSelect,
}: WidgetWrapperProps) {
  if (mode === 'view') {
    return (
      <div className="w-full bg-white mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-white border shadow-sm rounded-2xl flex flex-col group transition-all hover:border-indigo-200 ${
        selected ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-zinc-200'
      }`}
      onClick={() => onSelect?.(id)}
    >
      <div className="h-10 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between px-3 select-none">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white px-2 py-0.5 rounded-md border border-zinc-100">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {onGenerateAi && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onGenerateAi(id); }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 transition-colors hover:bg-white"
              title="Generate content for this section"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </button>
          )}
          {onMoveUp && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoveUp(id); }}
              className="text-zinc-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-white"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoveDown(id); }}
              className="text-zinc-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-white"
              title="Move Down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          <div className="w-px h-4 bg-zinc-200 mx-1" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(id); }}
            className="text-zinc-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
            title="Remove Block"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-6 overflow-x-auto min-w-0">
        {children}
      </div>
    </div>
  );
}
