'use client';

import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { BlockProps } from '@/lib/blocks/registry';

interface EmbedData {
    url: string;
}

export const EmbedBlock: React.FC<BlockProps<EmbedData>> = ({ id, isEditMode, content, depth, onChange }) => {
    const data: EmbedData = content || { url: '' };

    if (!isEditMode) {
        if (!data.url) return null;
        
        // Simple YouTube/Vimeo detector
        const isVideo = data.url.includes('youtube.com') || data.url.includes('youtu.be') || data.url.includes('vimeo.com');
        
        if (isVideo) {
            let embedUrl = data.url;
            if (data.url.includes('youtube.com/watch?v=')) {
                embedUrl = data.url.replace('watch?v=', 'embed/');
            } else if (data.url.includes('youtu.be/')) {
                embedUrl = `https://www.youtube.com/embed/${data.url.split('youtu.be/')[1]}`;
            }

            return (
                <div className="my-8 aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-100">
                    <iframe 
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }

        return (
            <div className="my-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center gap-4">
                <LinkIcon className="w-5 h-5 text-zinc-400" />
                <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline truncate">
                    {data.url}
                </a>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 border border-zinc-200 rounded-[2rem] p-8 space-y-4">
            <div className="flex items-center gap-3 opacity-50 mb-2">
                <LinkIcon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">External Embed</span>
            </div>
            <input
                type="text"
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 outline-none text-sm placeholder:text-zinc-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                placeholder="Paste URL (YouTube, Vimeo, etc.)"
                value={data.url}
                onChange={(e) => onChange?.({ content: { ...data, url: e.target.value } })}
            />
            <p className="text-[10px] text-zinc-400 font-medium px-1">Supports YouTube, Vimeo, and direct links.</p>
        </div>
    );
};
