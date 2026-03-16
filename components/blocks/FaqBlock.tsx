'use client';

import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, ChevronRight } from 'lucide-react';
import { BlockProps } from '@/lib/blocks/registry';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqData {
    title: string;
    items: FaqItem[];
}

export const FaqBlock: React.FC<BlockProps<FaqData>> = ({ id, isEditMode, content, depth, onChange }) => {
    const data: FaqData = content || { 
        title: 'Frequently Asked Questions', 
        items: [{ question: 'What is this about?', answer: 'This is a dedicated FAQ section.' }] 
    };
    
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const updateItem = (index: number, field: keyof FaqItem, value: string) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange?.({ content: { ...data, items: newItems } });
    };

    const addItem = () => {
        onChange?.({ content: { ...data, items: [...data.items, { question: '', answer: '' }] } });
        setOpenIndex(data.items.length);
    };

    const removeItem = (index: number) => {
        if (data.items.length <= 1) return;
        const newItems = data.items.filter((_, i) => i !== index);
        onChange?.({ content: { ...data, items: newItems } });
    };

    if (!isEditMode) {
        return (
            <div className="mb-12 w-full">
                <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-12 tracking-tight break-words overflow-wrap-anywhere">
                    {data.title}
                </h2>
                <div className="space-y-6">
                    {data.items.map((item, i) => (
                        <div 
                            key={i} 
                            className="bg-white border-2 border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-indigo-100 group/item"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full text-left px-8 py-6 flex items-center justify-between gap-6 group"
                            >
                                <span className="font-black text-zinc-800 text-xl group-hover:text-indigo-600 transition-colors">
                                    {item.question}
                                </span>
                                <div className={`shrink-0 w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center transition-all duration-500 group-hover:bg-indigo-600 ${openIndex === i ? 'rotate-90 bg-indigo-600' : ''}`}>
                                    <ChevronRight className={`w-5 h-5 transition-colors ${openIndex === i ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
                                </div>
                            </button>
                            {openIndex === i && (
                                <div className="px-8 pb-8 text-zinc-500 text-lg leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="pt-6 border-t-2 border-zinc-50 break-words overflow-wrap-anywhere">
                                        {item.answer}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-4 opacity-50">
                    <HelpCircle className="w-5 h-5 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">FAQ Engine</span>
                </div>
                <input
                    type="text"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-3xl font-black text-white tracking-tight placeholder:text-zinc-800"
                    placeholder="FAQ Title..."
                    value={data.title}
                    onChange={(e) => onChange?.({ content: { ...data, title: e.target.value } })}
                />
            </div>

            <div className="space-y-6">
                {data.items.map((item, i) => (
                    <div key={i} className="bg-white border-2 border-zinc-100 rounded-[2rem] p-8 shadow-xl relative group">
                        <button
                            type="button"
                            onClick={() => removeItem(i)}
                            className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        
                        <div className="space-y-6 pr-12">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">Question {i + 1}</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-50 border-2 border-zinc-50 focus:border-indigo-400 focus:bg-white px-6 py-4 rounded-2xl text-zinc-900 font-bold outline-none transition-all placeholder:text-zinc-200 text-xl"
                                    value={item.question}
                                    onChange={(e) => updateItem(i, 'question', e.target.value)}
                                    placeholder="Enter question..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">Detailed Answer</label>
                                <textarea
                                    className="w-full bg-zinc-50 border-2 border-zinc-50 focus:border-indigo-400 focus:bg-white px-6 py-4 rounded-2xl text-zinc-600 font-medium outline-none transition-all placeholder:text-zinc-200 min-h-[120px] text-lg leading-relaxed"
                                    value={item.answer}
                                    onChange={(e) => updateItem(i, 'answer', e.target.value)}
                                    placeholder="Enter detailed answer..."
                                />
                            </div>
                        </div>
                    </div>
                ))}
                
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-3 px-8 py-4 mt-6 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-[1.5rem] shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add FAQ Item
                </button>
            </div>
        </div>
    );
};
