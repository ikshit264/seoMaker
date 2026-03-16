'use client';

import React, { useRef, useEffect } from 'react';
import { BlockProps } from '@/lib/blocks/registry';

interface HeadingData {
    text: string;
    level?: 2 | 3 | 4 | 5 | 6;
}

export const HeadingBlock: React.FC<BlockProps<HeadingData | string>> = ({ id, isEditMode, content, depth, onChange }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Normalize content
    const data: HeadingData = typeof content === 'string' 
        ? { text: content } 
        : (content as HeadingData) || { text: '' };

    // Default level based on depth
    const currentLevel = data.level || (Math.min(6, depth + 2) as any);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (isEditMode) {
            adjustHeight();
        }
    }, [isEditMode, data.text, currentLevel]);

    const fontSizes = {
        2: 'text-3xl md:text-5xl',
        3: 'text-2xl md:text-4xl',
        4: 'text-xl md:text-3xl',
        5: 'text-lg md:text-2xl',
        6: 'text-base md:text-xl'
    };

    if (!isEditMode) {
        const Tag = `h${currentLevel}` as keyof JSX.IntrinsicElements;
        return (
            <Tag className={`${fontSizes[currentLevel]} font-black text-zinc-900 tracking-tight mb-8 break-words overflow-wrap-anywhere`}>
                {data.text || ''}
            </Tag>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                {[2, 3, 4, 5, 6].map((l) => (
                    <button
                        key={l}
                        type="button"
                        onClick={() => onChange?.({ content: { ...data, level: l as any } })}
                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg border transition-all ${
                            currentLevel === l 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                                : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'
                        }`}
                    >
                        H{l}
                    </button>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                rows={1}
                className={`w-full h-auto resize-none outline-none font-black text-zinc-900 tracking-tight bg-transparent placeholder:text-zinc-200 border-none p-0 focus:ring-0 overflow-hidden break-words transition-all duration-300 ${fontSizes[currentLevel]}`}
                placeholder={`Enter H${currentLevel} heading...`}
                value={data.text || ''}
                onChange={(e) => {
                    onChange?.({ content: { ...data, text: e.target.value } });
                    adjustHeight();
                }}
            />
        </div>
    );
};
