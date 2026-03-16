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

/**
 * Article Renderer Component
 * 
 * Renders block editor content from the article's published_layout_json.
 * Automatically handles different block types and renders them with proper UI.
 * 
 * @param content - The article content (published_layout_json)
 * 
 * @example
 * // In your /blogs/[slug]/page.tsx
 * const article = await fetchArticle('blogs', slug);
 * 
 * return (
 *   <article>
 *     <h1>{article.title}</h1>
 *     <ArticleRenderer content={article.published_layout_json} />
 *   </article>
 * );
 */
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
            return <HeadingBlock key={block.id || index} data={block.data} />;
          
          case 'paragraph':
            return <ParagraphBlock key={block.id || index} data={block.data} />;
          
          case 'image':
            return <ImageBlock key={block.id || index} data={block.data} />;
          
          case 'list':
            return <ListBlock key={block.id || index} data={block.data} />;
          
          case 'quote':
            return <QuoteBlock key={block.id || index} data={block.data} />;
          
          case 'code':
            return <CodeBlock key={block.id || index} data={block.data} />;
          
          case 'divider':
            return <DividerBlock key={block.id || index} data={block.data} />;
          
          case 'table':
            return <TableBlock key={block.id || index} data={block.data} />;
          
          case 'faq':
            return <FaqBlock key={block.id || index} data={block.data} />;
          
          case 'embed':
            return <EmbedBlock key={block.id || index} data={block.data} />;
          
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
