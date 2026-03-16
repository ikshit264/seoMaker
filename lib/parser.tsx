import React from 'react';
import { HeadingBlock } from '@/components/blocks/HeadingBlock';
import { ParagraphBlock } from '@/components/blocks/ParagraphBlock';
import { ImageBlock } from '@/components/blocks/ImageBlock';
import { TableBlock } from '@/components/blocks/TableBlock';
import { EmbedBlock } from '@/components/blocks/EmbedBlock';
import { CodeBlock } from '@/components/blocks/CodeBlock';
import { QuoteBlock } from '@/components/blocks/QuoteBlock';
import { ListBlock } from '@/components/blocks/ListBlock';
import { FaqBlock } from '@/components/blocks/FaqBlock';
import { NavigationBlock } from '@/components/blocks/NavigationBlock';
import { SectionBlock } from '@/components/blocks/SectionBlock';

interface BlockData {
    id: string;
    type: string;
    content: any;
}

export function RenderBlocks({ blocks, depth = 0 }: { blocks: BlockData[], depth?: number }) {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className={`space-y-12 ${depth > 0 ? 'ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l-2 border-zinc-100' : ''}`}>
            {blocks.filter(b => b && b.id).map((block) => {
                const commonProps = {
                    key: block.id,
                    id: block.id,
                    isEditMode: false,
                    content: block.content,
                    depth: depth
                };

                switch (block.type) {
                    case 'section':
                        return <SectionBlock {...commonProps} />;
                    case 'heading':
                        return <HeadingBlock {...commonProps} />;
                    case 'paragraph':
                    case 'rich-text':
                        return <ParagraphBlock {...commonProps} />;
                    case 'image':
                        return <ImageBlock {...commonProps} />;
                    case 'table':
                        return <TableBlock {...commonProps} onChange={() => {}} />;
                    case 'embed':
                        return <EmbedBlock {...commonProps} onChange={() => {}} />;
                    case 'code':
                        return <CodeBlock {...commonProps} />;
                    case 'quote':
                        return <QuoteBlock {...commonProps} />;
                    case 'list':
                        return <ListBlock {...commonProps} />;
                    case 'faq':
                        return <FaqBlock {...commonProps} />;
                    case 'navigation':
                        return <NavigationBlock {...commonProps} />;
                    default:
                            <div key={block.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-400 italic text-xs">
                                Unsupported block type: {block.type}
                            </div>
                }
            })}
        </div>
    );
}
