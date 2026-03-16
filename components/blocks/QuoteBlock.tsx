'use client';

import React, { useRef, useEffect } from 'react';
import { BlockProps } from '@/lib/blocks/registry';
import { Quote as QuoteIcon } from 'lucide-react';

export const QuoteBlock: React.FC<BlockProps<string>> = ({ id, isEditMode, content, depth, onChange }) => {
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

    if (!isEditMode) {
        return (
            <blockquote className="pl-8 border-l-4 border-indigo-600 my-8">
                <p className="text-2xl font-bold italic text-zinc-700 leading-relaxed break-words overflow-wrap-anywhere">
                    "{content || ''}"
                </p>
            </blockquote>
        );
    }

    return (
        <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 space-y-4 relative">
            <QuoteIcon className="absolute top-4 right-4 w-12 h-12 text-indigo-100 opacity-50" />
            <textarea
                ref={textareaRef}
                rows={1}
                className="w-full h-auto resize-none outline-none text-2xl font-bold italic text-indigo-900 leading-relaxed bg-transparent border-none p-0 focus:ring-0 overflow-hidden break-words transition-all duration-300"
                placeholder="Enter quote here..."
                value={content || ''}
                onChange={(e) => {
                    onChange?.({ content: e.target.value });
                    adjustHeight();
                }}
            />
        </div>
    );
};
