'use client';

import React from 'react';
import { BlockProps } from '@/lib/blocks/registry';
import { Image as ImageIcon } from 'lucide-react';

interface ImageData {
    url: string;
    caption?: string;
}

export const ImageBlock: React.FC<BlockProps<ImageData>> = ({ id, isEditMode, content, depth, onChange }) => {
    const data: ImageData = content || { url: '', caption: '' };

    if (!isEditMode) {
        if (!data.url) return null;
        return (
            <figure className="my-8 group">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-100 transition-all duration-500 group-hover:shadow-indigo-100">
                    <img src={data.url} alt={data.caption} className="w-full h-auto object-cover" />
                </div>
                {data.caption && (
                    <figcaption className="mt-4 text-center text-sm font-medium text-zinc-400 italic">
                        {data.caption}
                    </figcaption>
                )}
            </figure>
        );
    }

    return (
        <div className="bg-zinc-50 border border-zinc-200 rounded-[2rem] p-8 space-y-4">
            <div className="flex items-center gap-3 opacity-50 mb-2">
                <ImageIcon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Image Asset</span>
            </div>
            <input
                type="text"
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 outline-none text-sm placeholder:text-zinc-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                placeholder="Paste image URL here..."
                value={data.url}
                onChange={(e) => onChange?.({ content: { ...data, url: e.target.value } })}
            />
            <input
                type="text"
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm italic text-zinc-500"
                placeholder="Add a caption..."
                value={data.caption}
                onChange={(e) => onChange?.({ content: { ...data, caption: e.target.value } })}
            />
        </div>
    );
};
