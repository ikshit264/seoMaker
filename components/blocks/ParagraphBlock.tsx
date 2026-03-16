'use client';

import React, { useRef, useEffect } from 'react';
import { BlockProps } from '@/lib/blocks/registry';

export const ParagraphBlock: React.FC<BlockProps<string>> = ({ id, isEditMode, content, depth, onChange }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    }, [isEditMode, content]);

    const displayContent = typeof content === 'string' 
        ? content 
        : Array.isArray(content) 
            ? content.map((c: any) => c.text || JSON.stringify(c)).join(' ') 
            : '';

    if (!isEditMode) {
        return <p className="text-zinc-600 text-lg leading-relaxed whitespace-pre-wrap mb-4 break-words overflow-wrap-anywhere">{displayContent || ''}</p>;
    }

    return (
        <textarea
            ref={textareaRef}
            rows={1}
            className="w-full h-auto resize-none outline-none text-zinc-600 text-lg leading-relaxed bg-transparent placeholder:text-zinc-200 border-none p-0 focus:ring-0 overflow-hidden break-words transition-all duration-300"
            placeholder="Start typing your paragraph..."
            value={displayContent}
            onChange={(e) => {
                onChange?.({ content: e.target.value });
                adjustHeight();
            }}
        />
    );
};
