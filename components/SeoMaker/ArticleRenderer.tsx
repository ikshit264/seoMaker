import { HeadingBlock } from '@/components/blocks/HeadingBlock';
import { ParagraphBlock } from '@/components/blocks/ParagraphBlock';
import { ImageBlock } from '@/components/blocks/ImageBlock';
import { ListBlock } from '@/components/blocks/ListBlock';
import { QuoteBlock } from '@/components/blocks/QuoteBlock';
import { CodeBlock } from '@/components/blocks/CodeBlock';
import { DividerBlock } from '@/components/blocks/DividerBlock';
import { TableBlock } from '@/components/blocks/TableBlock';
import { FaqBlock } from '@/components/blocks/FaqBlock';
import { EmbedBlock } from '@/components/blocks/EmbedBlock';

interface ArticleRendererProps {
  content: any; // published_layout_json or draft_layout_json
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
  if (!content) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No content available
      </div>
    );
  }

  // Handle different content formats
  let blocks: any[] = [];
  
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      return <div className="prose max-w-none"><p>{content}</p></div>;
    }
  }

  // Extract blocks from different possible structures
  if (Array.isArray(content)) {
    blocks = content;
  } else if (content.blocks && Array.isArray(content.blocks)) {
    blocks = content.blocks;
  } else if (content.layout && content.layout.blocks) {
    blocks = content.layout.blocks;
  } else if (content.draft_layout_json) {
    // Recursively handle nested structure
    return <ArticleRenderer content={content.draft_layout_json} />;
  } else if (content.published_layout_json) {
    // Recursively handle nested structure
    return <ArticleRenderer content={content.published_layout_json} />;
  }

  if (blocks.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No content blocks found
      </div>
    );
  }

  // Render each block based on its type
  return (
    <div className="space-y-8">
      {blocks.map((block: any, index: number) => {
        switch (block.type) {
          case 'heading':
            return <HeadingBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'paragraph':
            return <ParagraphBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'image':
            return <ImageBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'list':
            return <ListBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'quote':
            return <QuoteBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'code':
            return <CodeBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'divider':
            return <DividerBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'table':
            return <TableBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'faq':
            return <FaqBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          case 'embed':
            return <EmbedBlock id={block.id || index} key={block.id || index} content={block.content || block.data} isEditMode={false} depth={0} />;
          
          default:
            // Fallback for unknown block types
            return (
              <div key={block.id || index} className="text-zinc-600">
                {block.data?.text || block.data?.content || JSON.stringify(block.data)}
              </div>
            );
        }
      })}
    </div>
  );
}
