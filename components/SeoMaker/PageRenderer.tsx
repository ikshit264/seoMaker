import LayoutEngine from '@/components/grid-editor/LayoutEngine';
import { normalizeLayoutContent } from '@/lib/editor-content';

interface PageRendererProps {
  content: any;
  className?: string;
}

function normalizeRendererContent(content: any) {
  if (Array.isArray(content)) {
    return normalizeLayoutContent({ blocks: content });
  }

  if (content && typeof content === 'object') {
    if (Array.isArray(content.blocks)) {
      return normalizeLayoutContent(content);
    }

    if (content.layout && Array.isArray(content.blocks)) {
      return normalizeLayoutContent({ blocks: content.blocks });
    }
  }

  return null;
}

export function PageRenderer({ content, className = '' }: PageRendererProps) {
  if (!content) {
    return <div className={`text-zinc-500 italic ${className}`}>No content available</div>;
  }

  if (typeof content === 'string') {
    return <div className={`prose prose-lg max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  const normalizedContent = normalizeRendererContent(content);

  if (!normalizedContent) {
    return (
      <div className={`prose prose-lg max-w-none ${className}`}>
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className={className}>
      <LayoutEngine mode="view" value={normalizedContent} />
    </div>
  );
}
