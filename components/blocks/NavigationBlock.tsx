'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { BlockProps } from '@/lib/blocks/registry';

interface NavLink {
    text: string;
    url: string;
}

interface NavigationData {
    prev?: NavLink;
    next?: NavLink;
}

export const NavigationBlock: React.FC<BlockProps<NavigationData>> = ({ id, isEditMode, content, depth, onChange }) => {
    const data: NavigationData = content || {
        prev: { text: 'Previous Post', url: '#' },
        next: { text: 'Next Post', url: '#' }
    };

    const updateLink = (type: 'prev' | 'next', field: keyof NavLink, value: string) => {
        const link = data[type] || { text: '', url: '' };
        onChange?.({ content: { ...data, [type]: { ...link, [field]: value } } });
    };

    if (!isEditMode) {
        return (
            <div className="mt-24 pt-16 border-t-2 border-zinc-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.prev && (
                    <a 
                        href={data.prev.url}
                        className="group flex flex-col p-10 bg-zinc-50 hover:bg-white border-2 border-zinc-50 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:border-indigo-100"
                    >
                        <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Previous
                        </span>
                        <span className="text-zinc-900 font-black text-2xl group-hover:text-indigo-600 transition-colors tracking-tight">
                            {data.prev.text}
                        </span>
                    </a>
                )}
                {data.next && (
                    <a 
                        href={data.next.url}
                        className="group flex flex-col p-10 bg-zinc-50 hover:bg-white border-2 border-zinc-50 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:border-indigo-100 text-right items-end"
                    >
                        <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                            Next <ArrowRight className="w-3 h-3" />
                        </span>
                        <span className="text-zinc-900 font-black text-2xl group-hover:text-indigo-600 transition-colors tracking-tight">
                            {data.next.text}
                        </span>
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-10 p-10 bg-zinc-900 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-4 opacity-50">
                <LinkIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-black text-lg uppercase tracking-widest">Blog Navigation</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest ml-1">Previous Anchor</h4>
                    <input
                        type="text"
                        className="w-full bg-zinc-800 border-2 border-zinc-800 focus:border-indigo-500 focus:bg-zinc-900 p-5 rounded-2xl text-white outline-none placeholder:text-zinc-700 transition-all font-bold text-xl"
                        placeholder="Link Text..."
                        value={data.prev?.text || ''}
                        onChange={(e) => updateLink('prev', 'text', e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full bg-zinc-800/50 border-2 border-transparent focus:border-indigo-500 p-4 rounded-xl text-zinc-500 outline-none placeholder:text-zinc-700 transition-all text-xs font-mono"
                        placeholder="URL..."
                        value={data.prev?.url || ''}
                        onChange={(e) => updateLink('prev', 'url', e.target.value)}
                    />
                </div>

                <div className="space-y-6 lg:text-right">
                    <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mr-1">Next Anchor</h4>
                    <input
                        type="text"
                        className="w-full bg-zinc-800 border-2 border-zinc-800 focus:border-indigo-500 focus:bg-zinc-900 p-5 rounded-2xl text-white outline-none placeholder:text-zinc-700 transition-all font-bold text-xl lg:text-right"
                        placeholder="Link Text..."
                        value={data.next?.text || ''}
                        onChange={(e) => updateLink('next', 'text', e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full bg-zinc-800/50 border-2 border-transparent focus:border-indigo-500 p-4 rounded-xl text-zinc-500 outline-none placeholder:text-zinc-700 transition-all text-xs lg:text-right font-mono"
                        placeholder="URL..."
                        value={data.next?.url || ''}
                        onChange={(e) => updateLink('next', 'url', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};
