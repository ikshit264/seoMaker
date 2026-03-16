'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Type, Image as ImageIcon, Heading1, Heading2, List, Table } from 'lucide-react';
import { RenderBlocks } from '@/lib/parser';

export type BlockType = 'h1' | 'h2' | 'p' | 'image' | 'list' | 'table';

export interface Block {
  id: string;
  type: BlockType;
  content: any;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  readOnly?: boolean;
}

function SortableBlock({ block, updateBlock, removeBlock }: { block: Block, updateBlock: (id: string, content: any) => void, removeBlock: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative flex items-start gap-3 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mb-3">
      <div 
        {...attributes} 
        {...listeners}
        className="mt-1 cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        {block.type === 'h1' && (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Heading 1"
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-300"
          />
        )}
        {block.type === 'h2' && (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Heading 2"
            className="w-full text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-zinc-300"
          />
        )}
        {block.type === 'p' && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Paragraph text..."
            className="w-full min-h-[100px] text-zinc-700 bg-transparent border-none outline-none resize-y placeholder:text-zinc-300"
          />
        )}
        {block.type === 'image' && (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content.url || ''}
              onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
              placeholder="Image URL"
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={block.content.alt || ''}
              onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
              placeholder="Alt text"
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-indigo-500"
            />
            {block.content.url && (
              <img src={block.content.url} alt={block.content.alt} className="max-h-64 rounded-lg object-contain mt-2 border border-zinc-200" />
            )}
          </div>
        )}
        {block.type === 'list' && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="List items (one per line)..."
            className="w-full min-h-[100px] text-zinc-700 bg-transparent border-none outline-none resize-y placeholder:text-zinc-300"
          />
        )}
        {block.type === 'table' && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Table CSV (comma separated)..."
            className="w-full min-h-[100px] font-mono text-sm text-zinc-700 bg-zinc-50 p-3 rounded-lg border border-zinc-200 outline-none resize-y placeholder:text-zinc-300"
          />
        )}
      </div>

      <button
        onClick={() => removeBlock(block.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function BlockEditor({ blocks, onChange, readOnly }: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: type === 'image' ? { url: '', alt: '' } : '',
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: any) => {
    onChange(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  if (readOnly) {
    return (
      <div className="h-full w-full">
        <RenderBlocks blocks={blocks} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock 
              key={block.id} 
              block={block} 
              updateBlock={updateBlock}
              removeBlock={removeBlock}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl p-6">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-zinc-500 mr-2">Add Block:</span>
          <button onClick={() => addBlock('h1')} className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
            <Heading1 className="w-4 h-4" /> H1
          </button>
          <button onClick={() => addBlock('h2')} className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
            <Heading2 className="w-4 h-4" /> H2
          </button>
          <button onClick={() => addBlock('p')} className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
            <Type className="w-4 h-4" /> Text
          </button>
          <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
            <ImageIcon className="w-4 h-4" /> Image
          </button>
          <button onClick={() => addBlock('list')} className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
            <List className="w-4 h-4" /> List
          </button>
          <button onClick={() => addBlock('table')} className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
            <Table className="w-4 h-4" /> Table
          </button>
        </div>
      </div>
    </div>
  );
}
