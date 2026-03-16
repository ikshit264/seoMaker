'use client';

import React, { useState, useEffect } from 'react';
import { Responsive, useContainerWidth } from 'react-grid-layout';
import type { Layout, LayoutItem } from 'react-grid-layout';
import { Type, Image as ImageIcon, AlignLeft, Layout as LayoutIcon, Code, Quote, Link as LinkIcon } from 'lucide-react';
import cloneDeep from 'lodash/cloneDeep';
import WidgetWrapper from './WidgetWrapper';
import { BlockEditor } from '../BlockEditor';

export interface GridBlockData {
  id: string;
  type: string;
  content?: any;
  [key: string]: any;
}

export interface GridContent {
  layout: Layout;
  blocks: GridBlockData[];
}

interface BlogLayoutEngineProps {
  value: GridContent | null;
  onChange: (val: GridContent) => void;
}

export default function BlogLayoutEngine({ value, onChange }: BlogLayoutEngineProps) {
  const [layout, setLayout] = useState<Layout>(value?.layout || []);
  const [blocks, setBlocks] = useState<GridBlockData[]>(value?.blocks || []);
  const [isMounted, setIsMounted] = useState(false);
  const { width, containerRef, mounted: gridMounted } = useContainerWidth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Sync to parent when layout or blocks change
  useEffect(() => {
    if (!isMounted) return;
    onChange({ layout, blocks });
  }, [layout, blocks, isMounted, onChange]);

  const addBlock = (type: string) => {
    const id = `block-${Date.now()}`;
    const newBlock: GridBlockData = { id, type, content: type === 'rich-text' ? [] : '' };
    
    // Default layout properties
    let w = 6;
    let h = 4;
    
    if (type === 'rich-text') { w = 12; h = 10; }
    if (type === 'image') { w = 6; h = 8; }
    if (type === 'code') { w = 12; h = 6; }
    if (type === 'quote') { w = 6; h = 4; }

    const newLayoutItem: LayoutItem = { i: id, x: 0, y: Infinity, w, h };

    setBlocks(prev => [...prev, newBlock]);
    setLayout(prev => [...prev, newLayoutItem]);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setLayout(prev => prev.filter(l => l.i !== id));
  };

  const updateBlock = (id: string, data: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const onLayoutChange = (newLayout: Layout) => {
    setLayout(newLayout);
  };

  const renderWidgetContent = (block: GridBlockData) => {
    switch (block.type) {
      case 'rich-text':
        return (
          <div className="h-full overflow-y-auto">
            <BlockEditor 
              blocks={Array.isArray(block.content) ? block.content : []} 
              onChange={(c) => updateBlock(block.id, { content: c })} 
            />
          </div>
        );
      case 'paragraph':
        return (
          <textarea 
            className="w-full h-full resize-none outline-none text-zinc-700 text-sm leading-relaxed"
            placeholder="Start typing your paragraph..."
            value={block.content || ''}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          />
        );
      case 'heading':
        return (
          <input 
            type="text"
            className="w-full h-full outline-none text-zinc-900 text-2xl font-bold placeholder:text-zinc-300"
            placeholder="Heading text..."
            value={block.content || ''}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          />
        );
      case 'quote':
        return (
          <div className="h-full flex flex-col justify-center border-l-4 border-indigo-500 pl-4">
            <textarea 
              className="w-full resize-none outline-none text-zinc-700 italic text-lg placeholder:text-zinc-300"
              placeholder="Quote text..."
              value={block.content || ''}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            />
          </div>
        );
      case 'code':
        return (
          <div className="h-full flex flex-col bg-zinc-900 rounded-lg p-4">
            <textarea 
              className="w-full h-full resize-none outline-none bg-transparent text-zinc-300 font-mono text-sm"
              placeholder="// Write code here..."
              value={block.content || ''}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              spellCheck={false}
            />
          </div>
        );
      case 'image':
        return (
          <div className="flex flex-col h-full gap-3">
            <input 
              type="text" 
              placeholder="Image URL..." 
              className="w-full p-2 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={block.src || ''}
              onChange={(e) => updateBlock(block.id, { src: e.target.value })}
            />
            {block.src ? (
              <div className="flex-1 relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                <img src={block.src} alt="" className="absolute inset-0 w-full h-full object-contain" />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50 text-zinc-400">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              </div>
            )}
          </div>
        );
      case 'embed':
        return (
          <div className="flex flex-col h-full gap-3">
            <input 
              type="text" 
              placeholder="Embed URL (YouTube, Twitter, etc)..." 
              className="w-full p-2 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={block.url || ''}
              onChange={(e) => updateBlock(block.id, { url: e.target.value })}
            />
            <div className="flex-1 flex items-center justify-center border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-400">
              <LinkIcon className="w-8 h-8 mb-2 opacity-50" />
            </div>
          </div>
        );
      default:
        return <div className="text-zinc-500 text-sm">Unknown block type</div>;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-zinc-200 rounded-xl shadow-sm">
        <span className="text-sm font-medium text-zinc-500 px-2 flex items-center gap-2">
          <LayoutIcon className="w-4 h-4" /> Add Widget:
        </span>
        <button onClick={() => addBlock('rich-text')} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-zinc-700"><Type className="w-4 h-4"/> Rich Text</button>
        <button onClick={() => addBlock('heading')} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-zinc-700"><Type className="w-4 h-4"/> Heading</button>
        <button onClick={() => addBlock('paragraph')} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-zinc-700"><AlignLeft className="w-4 h-4"/> Paragraph</button>
        <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-zinc-700"><ImageIcon className="w-4 h-4"/> Image</button>
        <button onClick={() => addBlock('quote')} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-zinc-700"><Quote className="w-4 h-4"/> Quote</button>
        <button onClick={() => addBlock('code')} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-zinc-700"><Code className="w-4 h-4"/> Code</button>
        <button onClick={() => addBlock('embed')} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-zinc-700"><LinkIcon className="w-4 h-4"/> Embed</button>
      </div>
      
      <div ref={containerRef} className="bg-zinc-50/50 border border-zinc-200 rounded-2xl p-4 min-h-[600px]">
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-24">
            <LayoutIcon className="w-12 h-12 mb-4 opacity-20" />
            <p>Your dashboard is empty. Add a widget to start building your layout.</p>
          </div>
        ) : (
          gridMounted && (
            <Responsive
              className="layout"
              width={width}
              layouts={{ lg: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={30}
              onLayoutChange={onLayoutChange}
              dragConfig={{ handle: '.drag-handle', cancel: 'button' }}
              margin={[16, 16]}
            >
              {blocks.map(block => (
                <div key={block.id}>
                  <WidgetWrapper id={block.id} title={block.type.replace('-', ' ')} onRemove={removeBlock}>
                    {renderWidgetContent(block)}
                  </WidgetWrapper>
                </div>
              ))}
            </Responsive>
          )
        )}
      </div>
    </div>
  );
}
