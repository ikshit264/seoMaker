'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import LayoutEngine, { LayoutEngineContent } from './LayoutEngine';

interface PreviewOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    content: LayoutEngineContent | null;
    title: string;
}

export default function PreviewOverlay({ isOpen, onClose, content, title }: PreviewOverlayProps) {
    const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const getPreviewWidth = () => {
        switch (previewDevice) {
            case 'mobile': return 'max-w-[375px]';
            case 'tablet': return 'max-w-[768px]';
            case 'desktop': return 'max-w-full';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[100] bg-zinc-50 flex flex-col"
                >
                    {/* Header */}
                    <div className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="font-bold text-zinc-900 truncate max-w-[200px] md:max-w-md">{title} — Preview</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setPreviewDevice('desktop')}
                                    className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    title="Desktop View"
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPreviewDevice('tablet')}
                                    className={`p-2 rounded-lg transition-all ${previewDevice === 'tablet' ? 'bg-white shadow-sm text-indigo-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    title="Tablet View"
                                >
                                    <Tablet className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPreviewDevice('mobile')}
                                    className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    title="Mobile View"
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-zinc-100/50">
                        <div className={`bg-white w-full ${getPreviewWidth()} transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden flex flex-col`}>
                            {/* Browser chrome mockup */}
                            <div className="h-10 bg-zinc-50 border-b border-zinc-100 flex items-center px-4 gap-2 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                                </div>
                                <div className="flex-1 max-w-md mx-auto h-6 bg-white border border-zinc-100 rounded-md"></div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                <div className="max-w-4xl mx-auto px-8 pt-16 pb-8">
                                    <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight mb-4 break-words">
                                        {title}
                                    </h1>
                                    <div className="h-1 w-20 bg-indigo-600 rounded-full mb-12"></div>
                                </div>
                                <LayoutEngine mode="view" value={content} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
