'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BlockProps } from '@/lib/blocks/registry';

interface ListData {
    title: string;
    level?: 2 | 3 | 4 | 5 | 6;
    items: string[];
}

export const ListBlock: React.FC<BlockProps<ListData>> = ({ id, isEditMode, content, depth, onChange }) => {
    const data: ListData = content || { title: 'Highlights', items: [''] };
    const currentLevel = data.level || (Math.min(6, (depth || 0) + 2) as 2 | 3 | 4 | 5 | 6);

    const updateItem = (index: number, value: string) => {
        const newItems = [...data.items];
        newItems[index] = value;
        onChange?.({ content: { ...data, items: newItems } });
    };

    const addItem = () => {
        onChange?.({ content: { ...data, items: [...data.items, ''] } });
    };

    const removeItem = (index: number) => {
        if (data.items.length <= 1) return;
        const newItems = data.items.filter((_, i) => i !== index);
        onChange?.({ content: { ...data, items: newItems } });
    };

    const fontSizes = {
        2: 'text-3xl md:text-5xl',
        3: 'text-2xl md:text-4xl',
        4: 'text-xl md:text-3xl',
        5: 'text-lg md:text-2xl',
        6: 'text-base md:text-xl'
    };

    if (!isEditMode) {
        const Tag = `h${currentLevel}` as keyof React.JSX.IntrinsicElements;
        return (
            <div className="mb-8 w-full">
                <Tag className={`${fontSizes[currentLevel]} font-black text-zinc-900 tracking-tight mb-6 break-words overflow-wrap-anywhere`}>
                    {data.title}
                </Tag>
                <ul className="space-y-4">
                    {data.items.map((item, i) => (
                        <li key={i} className="flex gap-4 text-zinc-600 text-lg leading-relaxed group">
                            <span className="flex-shrink-0 w-8 h-8 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-black mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                {i + 1}
                            </span>
                            <span className="break-words overflow-wrap-anywhere flex-1 pt-0.5">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    {[2, 3, 4, 5, 6].map((l) => (
                        <button
                            key={l}
                            type="button"
                            onClick={() => onChange?.({ content: { ...data, level: l as any } })}
                            className={`px-3 py-1.5 text-[10px] font-black rounded-lg border transition-all ${
                                currentLevel === l 
                                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                                    : 'bg-white border-zinc-200 text-zinc-400'
                            }`}
                        >
                            H{l}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    className={`w-full bg-transparent border-none p-0 focus:ring-0 font-black text-zinc-900 tracking-tight placeholder:text-zinc-300 ${fontSizes[currentLevel]}`}
                    placeholder="List Title..."
                    value={data.title}
                    onChange={(e) => onChange?.({ content: { ...data, title: e.target.value } })}
                />
            </div>

            <div className="space-y-3 pl-4">
                {data.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs font-black shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            {i + 1}
                        </div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-b border-zinc-100 focus:border-indigo-400 py-3 text-zinc-600 outline-none transition-all font-medium text-lg"
                            value={item}
                            onChange={(e) => updateItem(i, e.target.value)}
                            placeholder={`Point ${i + 1}...`}
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(i)}
                            className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-6 py-3 mt-4 text-sm font-black text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 rounded-2xl transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>
        </div>
    );
};
