import { PageBlock } from '@/lib/seo-maker';

interface PageRendererProps {
  content: any; // published_layout_json - the block editor content
  className?: string;
}

/**
 * PageRenderer Component
 * 
 * Renders the block editor content from published_layout_json.
 * This is where you integrate your existing BlockEditor components.
 * 
 * @param content - The published_layout_json from the page
 * @param className - Optional custom CSS classes
 */
export function PageRenderer({ content, className = '' }: PageRendererProps) {
  if (!content) {
    return (
      <div className={`text-zinc-500 italic ${className}`}>
        No content available
      </div>
    );
  }

  // Handle different content formats
  // Your existing BlockEditor likely already has logic for this
  
  // Format 1: Grid layout with blocks array
  if (content.layout && content.blocks) {
    return (
      <div className={className}>
        {renderBlocks(content.blocks)}
      </div>
    );
  }
  
  // Format 2: Simple blocks array (legacy format)
  if (Array.isArray(content)) {
    return (
      <div className={className}>
        {renderBlocks(content)}
      </div>
    );
  }

  // Format 3: Raw HTML (fallback)
  if (typeof content === 'string') {
    return (
      <div 
        className={`prose prose-lg max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Default: Try to render as JSON
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  );
}

/**
 * Render an array of blocks
 * You should replace this with your actual BlockEditor rendering logic
 */
function renderBlocks(blocks: any[]) {
  if (!blocks || !Array.isArray(blocks)) {
    return null;
  }

  return (
    <div className="space-y-8">
      {blocks.map((block: any, index: number) => {
        // You already have these block components in your app!
        // Import and use them here based on block.type
        
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
              <div key={block.id || index} className="text-zinc-400 text-sm">
                Unknown block type: {block.type}
              </div>
            );
        }
      })}
    </div>
  );
}

// ============================================================================
// BLOCK RENDERERS
// These should import your existing block components from /components/blocks/
// For now, here are simple implementations as examples:
// ============================================================================

function HeadingBlock({ data }: { data: any }) {
  const { text, level = 2 } = data || {};
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag className="font-bold text-zinc-900 mt-8 mb-4">
      {text}
    </Tag>
  );
}

function ParagraphBlock({ data }: { data: any }) {
  const { text } = data || {};
  
  return (
    <p className="text-zinc-700 leading-relaxed mb-4">
      {text}
    </p>
  );
}

function ImageBlock({ data }: { data: any }) {
  const { url, caption } = data || {};
  
  if (!url) return null;
  
  return (
    <figure className="my-6">
      <img src={url} alt={caption || ''} className="w-full rounded-xl shadow-lg" />
      {caption && (
        <figcaption className="text-center text-sm text-zinc-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ListBlock({ data }: { data: any }) {
  const { items = [], style = 'unordered' } = data || {};
  
  if (!items.length) return null;
  
  const Tag = style === 'ordered' ? 'ol' : 'ul';
  
  return (
    <Tag className="list-disc list-inside space-y-2 mb-4 text-zinc-700">
      {items.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </Tag>
  );
}

function QuoteBlock({ data }: { data: any }) {
  const { text, citation } = data || {};
  
  return (
    <blockquote className="border-l-4 border-indigo-600 pl-4 py-2 my-6 bg-zinc-50 rounded-r-lg">
      <p className="text-zinc-700 italic mb-2">{text}</p>
      {citation && (
        <cite className="text-zinc-500 text-sm">— {citation}</cite>
      )}
    </blockquote>
  );
}

function CodeBlock({ data }: { data: any }) {
  const { code, language } = data || {};
  
  return (
    <pre className="bg-zinc-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm">
      <code>{code}</code>
    </pre>
  );
}

function DividerBlock() {
  return <hr className="my-8 border-zinc-200" />;
}

function TableBlock({ data }: { data: any }) {
  const { headers = [], rows = [] } = data || {};
  
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse">
        {headers.length > 0 && (
          <thead>
            <tr className="bg-zinc-100">
              {headers.map((header: string, index: number) => (
                <th key={index} className="border border-zinc-300 px-4 py-2 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex} className="even:bg-zinc-50">
              {row.map((cell: string, cellIndex: number) => (
                <td key={cellIndex} className="border border-zinc-300 px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqBlock({ data }: { data: any }) {
  const { question, answer } = data || {};
  
  return (
    <details className="group my-4">
      <summary className="cursor-pointer font-semibold text-zinc-900 hover:text-indigo-600 transition-colors">
        {question}
      </summary>
      <div className="mt-2 text-zinc-700 pl-4 border-l-2 border-zinc-200">
        {answer}
      </div>
    </details>
  );
}

function EmbedBlock({ data }: { data: any }) {
  const { url, service } = data || {};
  
  if (!url) return null;
  
  // Basic embed handling - you can expand this based on your needs
  if (service === 'youtube') {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return (
        <div className="aspect-video my-6">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>
      );
    }
  }
  
  // Generic iframe embed
  return (
    <div className="my-6">
      <iframe src={url} className="w-full aspect-video rounded-xl" title="Embedded content" />
    </div>
  );
}
