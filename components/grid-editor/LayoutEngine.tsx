'use client';

import React, { useState } from 'react';
import { 
    Image as ImageIcon, AlignLeft, Layout as LayoutIcon, 
    Code, Quote, Table, Link as LinkIcon, Plus, List, HelpCircle, 
    ArrowRightLeft, Box, X
} from 'lucide-react';
import WidgetWrapper from './WidgetWrapper';
import { blockRegistry } from '@/lib/blocks';
import { GridBlockData, LayoutEngineContent, createBlockId, normalizeLayoutContent } from '@/lib/editor-content';

interface LayoutEngineProps {
  mode: 'edit' | 'view';
  value: LayoutEngineContent | null;
  onChange?: (val: LayoutEngineContent) => void;
  depth?: number;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  onGenerateAiForSection?: (id: string) => void;
}

// Mini Block Picker for nested contexts
function BlockPicker({ onSelect, depth = 0, className = "" }: { onSelect: (type: string) => void, depth?: number, className?: string }) {
    const isSectionAllowed = depth < 4; // Depth 0=H2, 1=H3, 2=H4, 3=H5, 4=H6. If 4, next is H7 (invalid)

    const blocks = [
        { type: 'paragraph', icon: AlignLeft, label: 'Text' },
        { type: 'list', icon: List, label: 'List' },
        { type: 'image', icon: ImageIcon, label: 'Image' },
        { type: 'table', icon: Table, label: 'Table' },
        { type: 'faq', icon: HelpCircle, label: 'FAQ' },
        { type: 'embed', icon: LinkIcon, label: 'Embed' },
        { type: 'quote', icon: Quote, label: 'Quote' },
        { type: 'code', icon: Code, label: 'Code' },
        { type: 'navigation', icon: ArrowRightLeft, label: 'Nav' },
    ];

    return (
        <div className={`flex flex-wrap items-center gap-1.5 p-2 bg-zinc-900 rounded-2xl shadow-2xl ${className}`}>
             {isSectionAllowed && (
                <button 
                    onClick={() => onSelect('section')}
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-95"
                >
                    <Box className="w-3 h-3" /> Section
                </button>
            )}
            {blocks.map(b => (
                <button 
                    key={b.type}
                    onClick={() => onSelect(b.type)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all active:scale-95 group relative"
                    title={b.label}
                >
                    <b.icon className="w-3.5 h-3.5" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {b.label}
                    </span>
                </button>
            ))}
        </div>
    );
}

// Recursive builder component used for nested sections
export function SectionBuilder({ mode, blocks, onChange, depth = 0, selectedBlockId, onSelectBlock, onGenerateAiForSection }: { 
    mode: 'edit' | 'view', 
    blocks: GridBlockData[], 
    onChange: (newBlocks: GridBlockData[]) => void,
    depth?: number,
    selectedBlockId?: string | null,
    onSelectBlock?: (id: string | null) => void,
    onGenerateAiForSection?: (id: string) => void,
}) {
    const [activePicker, setActivePicker] = useState<number | 'bottom' | null>(null);

    const addBlock = (type: string, index?: number) => {
        if (mode === 'view') return;
        const blockDef = blockRegistry.get(type);
        const newBlock: GridBlockData = { 
            id: createBlockId(type), 
            type, 
            content: blockDef?.defaultContent || '' 
        };
        const newBlocks = [...blocks];
        if (typeof index === 'number') {
            newBlocks.splice(index + 1, 0, newBlock);
        } else {
            newBlocks.push(newBlock);
        }
        onChange(newBlocks);
        setActivePicker(null);
    };

    const removeBlock = (id: string) => {
        if (mode === 'view') return;
        onChange(blocks.filter(b => b.id !== id));
    };

    const updateBlock = (id: string, data: Partial<GridBlockData>) => {
        if (mode === 'view') return;
        onChange(blocks.map(b => b.id === id ? { ...b, ...data } : b));
    };

    const moveBlock = (id: string, direction: 'up' | 'down') => {
        const index = blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;
        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[targetIndex];
        newBlocks[targetIndex] = temp;
        onChange(newBlocks);
    };

    const renderBlockContent = (block: GridBlockData) => {
        const blockDef = blockRegistry.get(block.type);
        if (!blockDef) return <div className="text-red-500 p-4 border border-red-100 rounded-xl">Unknown block type: {block.type}</div>;
        const Component = blockDef.component;
        return (
            <Component
                id={block.id}
                isEditMode={mode === 'edit'}
                content={block.content}
                depth={depth}
                onGenerateAiForSection={onGenerateAiForSection}
                onChange={(updates) => updateBlock(block.id, updates)}
            />
        );
    };

    if (blocks.length === 0 && mode === 'edit') {
        return (
            <div className="space-y-4">
                <div className={`py-12 border-2 border-dashed border-zinc-200 rounded-[32px] flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/30`}>
                    <Plus className="w-8 h-8 mb-4 opacity-10" />
                    <button 
                      onClick={() => setActivePicker('bottom')}
                      className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                    >
                        Click to add content
                    </button>
                </div>
                {activePicker === 'bottom' && (
                    <div className="flex justify-center animate-in fade-in zoom-in-95 duration-200">
                        <BlockPicker onSelect={(type) => addBlock(type)} depth={depth} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {blocks.map((block, index) => (
                <div key={block.id} className="relative group/block animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {mode === 'edit' ? (
                        <WidgetWrapper 
                            id={block.id} 
                            title={block.type === 'heading' ? `H${block.content?.level || (depth + 2)}` : block.type} 
                            onRemove={() => removeBlock(block.id)}
                            onMoveUp={index > 0 ? () => moveBlock(block.id, 'up') : undefined}
                            onMoveDown={index < blocks.length - 1 ? () => moveBlock(block.id, 'down') : undefined}
                            mode="edit"
                            selected={selectedBlockId === block.id}
                            onSelect={onSelectBlock}
                            onGenerateAi={block.type === 'section' ? onGenerateAiForSection : undefined}
                        >
                            {renderBlockContent(block)}
                        </WidgetWrapper>
                    ) : (
                        renderBlockContent(block)
                    )}

                    {mode === 'edit' && (
                        <div className="absolute -bottom-3 left-0 right-0 h-6 flex flex-col items-center justify-center z-20">
                            {activePicker === index ? (
                                <div className="bg-white p-1 rounded-2xl shadow-2xl border border-zinc-100 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                    <BlockPicker onSelect={(type) => addBlock(type, index)} depth={depth} />
                                    <button 
                                        onClick={() => setActivePicker(null)}
                                        className="absolute -right-2 -top-2 bg-zinc-900 text-white p-1 rounded-full shadow-lg hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setActivePicker(index)}
                                    className="opacity-0 group-hover/block:opacity-100 bg-zinc-900 text-white p-1.5 rounded-full shadow-2xl hover:bg-indigo-600 transition-all scale-75 group-hover/block:scale-100 ring-4 ring-white"
                                    title="Add block here"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {mode === 'edit' && blocks.length > 0 && (
                <div className="pt-4 flex flex-col items-center gap-4">
                    {activePicker === 'bottom' ? (
                         <div className="relative animate-in fade-in zoom-in-95 duration-200">
                            <BlockPicker onSelect={(type) => addBlock(type)} depth={depth} />
                            <button 
                                onClick={() => setActivePicker(null)}
                                className="absolute -right-2 -top-2 bg-zinc-900 text-white p-1 rounded-full shadow-lg"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setActivePicker('bottom')}
                            className="flex items-center gap-2 px-6 py-3 text-xs font-black text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 border-2 border-dashed border-zinc-100 hover:border-indigo-100 rounded-2xl transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add to Section
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function LayoutEngine({ mode, value, onChange, depth = 0, selectedBlockId, onSelectBlock, onGenerateAiForSection }: LayoutEngineProps) {
  const blocks = normalizeLayoutContent(value).blocks;

  const handleBlocksChange = (newBlocks: GridBlockData[]) => {
      onChange?.({ blocks: newBlocks });
  };

  const addTopLevelBlock = (type: string, initialContent?: any) => {
    const blockDef = blockRegistry.get(type);
    const newBlock: GridBlockData = { 
      id: createBlockId(type), 
      type, 
      content: initialContent || blockDef?.defaultContent || '' 
    };
    onChange?.({ blocks: [...blocks, newBlock] });
  };

  if (mode === 'view') {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <SectionBuilder mode="view" blocks={blocks} onChange={() => {}} depth={depth} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32">
      {/* Enhanced Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-white border border-zinc-200 rounded-[32px] shadow-2xl sticky top-4 z-20 overflow-x-auto custom-scrollbar-horizontal">
        <div className="flex items-center gap-1 border-r border-zinc-100 pr-2 mr-1">
            <button 
                onClick={() => addTopLevelBlock('section')} 
                className="flex items-center gap-2 px-3 py-2 text-xs font-black bg-indigo-600 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
                <Box className="w-4 h-4" /> New Section
            </button>
        </div>

        <button onClick={() => addTopLevelBlock('paragraph')} className="toolbar-btn"><AlignLeft className="w-4 h-4" /> Text</button>
        <button onClick={() => addTopLevelBlock('list')} className="toolbar-btn"><List className="w-4 h-4" /> Bullet Points</button>
        <button onClick={() => addTopLevelBlock('image')} className="toolbar-btn"><ImageIcon className="w-4 h-4" /> Image</button>
        <button onClick={() => addTopLevelBlock('table')} className="toolbar-btn"><Table className="w-4 h-4" /> Table</button>
        <button onClick={() => addTopLevelBlock('faq')} className="toolbar-btn"><HelpCircle className="w-4 h-4" /> FAQ</button>
        <button onClick={() => addTopLevelBlock('embed')} className="toolbar-btn"><LinkIcon className="w-4 h-4" /> Embed</button>
        <button onClick={() => addTopLevelBlock('quote')} className="toolbar-btn"><Quote className="w-4 h-4" /> Quote</button>
        <button onClick={() => addTopLevelBlock('code')} className="toolbar-btn"><Code className="w-4 h-4" /> Code</button>
        <button onClick={() => addTopLevelBlock('navigation')} className="toolbar-btn border-l border-zinc-100 pl-3 ml-1 text-indigo-600"><ArrowRightLeft className="w-4 h-4" /> Nav Links</button>
      </div>

      <div className="min-h-[400px]">
        {blocks.length === 0 ? (
          <div className="py-24 border-2 border-dashed border-zinc-200 rounded-[40px] flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50">
            <LayoutIcon className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm font-medium">Your canvas is empty. Start by adding a New Section.</p>
          </div>
        ) : (
          <SectionBuilder
            mode="edit"
            blocks={blocks}
            onChange={handleBlocksChange}
            depth={depth}
            selectedBlockId={selectedBlockId}
            onSelectBlock={onSelectBlock}
            onGenerateAiForSection={onGenerateAiForSection}
          />
        )}
      </div>

        <style jsx>{`
            .toolbar-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.45rem 1rem;
                font-size: 0.75rem;
                font-weight: 800;
                background-color: #ffffff;
                border: 1px solid #e4e4e7;
                border-radius: 1rem;
                transition: all 0.2s;
                color: #52525b;
                white-space: nowrap;
            }
            .toolbar-btn:hover {
                background-color: #f4f4f5;
                border-color: #d4d4d8;
                transform: translateY(-1px);
            }
            .toolbar-btn:active {
                transform: scale(0.95);
            }
        `}</style>
    </div>
  );
}

export type { GridBlockData, LayoutEngineContent };
