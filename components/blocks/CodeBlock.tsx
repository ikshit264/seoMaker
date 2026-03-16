'use client';

import React, { useRef, useEffect } from 'react';
import { BlockProps } from '@/lib/blocks/registry';
import { Code as CodeIcon } from 'lucide-react';

export const CodeBlock: React.FC<BlockProps<string>> = ({ id, isEditMode, content, depth, onChange }) => {
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
            <pre className="p-8 bg-zinc-900 text-zinc-300 rounded-[2rem] text-sm overflow-x-auto my-8 border border-zinc-800 shadow-2xl font-mono leading-relaxed break-all">
                <code>{content || ''}</code>
            </pre>
        );
    }

    return (
        <div className="bg-zinc-900 rounded-[2rem] p-8 shadow-2xl space-y-4">
             <div className="flex items-center gap-3 opacity-30 mb-2">
                <CodeIcon className="w-4 h-4 text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Code Snippet</span>
            </div>
            <textarea
                ref={textareaRef}
                rows={1}
                className="w-full h-auto resize-none outline-none font-mono text-sm text-indigo-300 leading-relaxed bg-transparent border-none p-0 focus:ring-0 overflow-hidden break-all"
                placeholder="Paste or write your code here..."
                value={content || ''}
                onChange={(e) => {
                    onChange?.({ content: e.target.value });
                    adjustHeight();
                }}
            />
        </div>
    );
};
