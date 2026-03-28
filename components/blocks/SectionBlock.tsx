'use client';

import React from 'react';
import { BlockProps } from '@/lib/blocks/registry';
import { SectionBuilder } from '../grid-editor/LayoutEngine';
import { Box } from 'lucide-react';

interface SectionData {
    title: string;
    blocks: any[];
}

export const SectionBlock: React.FC<BlockProps<SectionData>> = ({ id, isEditMode, content, depth, onChange, onGenerateAiForSection }) => {
    const data: SectionData = content || { title: 'New Section', blocks: [] };

    const updateTitle = (val: string) => {
        onChange?.({ content: { ...data, title: val } });
    };

    const updateBlocks = (newBlocks: any[]) => {
        onChange?.({ content: { ...data, blocks: newBlocks } });
    };

    const headingLevel = Math.min(6, depth + 2); // Depth 0 -> H2, Depth 1 -> H3, etc.
    const Tag = `h${headingLevel}` as keyof React.JSX.IntrinsicElements;

    if (!isEditMode) {
        return (
            <div className="mb-12">
                <Tag className={`font-bold text-zinc-900 tracking-tight mb-8 ${
                    headingLevel === 2 ? 'text-4xl' : 
                    headingLevel === 3 ? 'text-3xl' : 
                    headingLevel === 4 ? 'text-2xl' : 'text-xl'
                }`}>
                    {data.title}
                </Tag>
                <div className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l-2 border-zinc-100 space-y-12">
                    <SectionBuilder 
                        mode="view" 
                        blocks={data.blocks || []} 
                        onChange={() => {}} 
                        depth={depth + 1} 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-zinc-900 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2 opacity-50">
                    <Box className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Section Bound - H{headingLevel}</span>
                </div>
                <input
                    type="text"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-2xl font-black text-white placeholder:text-zinc-700"
                    placeholder="Section Title..."
                    value={data.title}
                    onChange={(e) => updateTitle(e.target.value)}
                />
            </div>

            <div className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l-2 border-zinc-100/50 rounded-bl-3xl">
                <SectionBuilder 
                    mode="edit" 
                    blocks={data.blocks || []} 
                    onChange={updateBlocks} 
                    depth={depth + 1} 
                    onGenerateAiForSection={onGenerateAiForSection}
                />
            </div>
        </div>
    );
};

