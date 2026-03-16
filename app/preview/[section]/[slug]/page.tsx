'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LayoutEngine, { LayoutEngineContent } from '@/components/grid-editor/LayoutEngine';

export default function PreviewPage() {
  const { section, slug } = useParams() as { section: string, slug: string };
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const url = localStorage.getItem('cms_db_url');
    if (!url) {
      router.push('/');
      return;
    }

    // We fetch all items and find the one with the matching slug
    // In a real app, you'd want a dedicated endpoint for fetching by slug
    fetch(`/api/db/items?section=${section}`, {
      headers: { 'x-db-url': url }
    })
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          const found = data.items.find((i: any) => i.slug === slug);
          if (found) {
            let parsedContent = null;
            try {
              const rawContent = found.draft_layout_json || found.content;
              parsedContent = typeof rawContent === 'string'
                ? JSON.parse(rawContent)
                : rawContent;
            } catch (e) { }

            let gridContent: LayoutEngineContent = { layout: { lg: [], md: [], sm: [], xs: [], xxs: [] }, blocks: [] };

            // Migrate old blocks array format to grid format if needed
            if (Array.isArray(parsedContent)) {
              gridContent = {
                layout: { lg: [{ i: 'legacy-block', x: 0, y: 0, w: 12, h: 10 }] as any, md: [], sm: [], xs: [], xxs: [] },
                blocks: [{ id: 'legacy-block', type: 'rich-text', content: parsedContent }]
              };
            } else if (parsedContent && parsedContent.layout) {
              if (Array.isArray(parsedContent.layout)) {
                gridContent = {
                  layout: { lg: parsedContent.layout, md: [], sm: [], xs: [], xxs: [] },
                  blocks: parsedContent.blocks || []
                };
              } else {
                gridContent = parsedContent;
              }
            }

            setItem({ ...found, content: gridContent });
          }
        }
        setLoading(false);
      });
  }, [section, slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Page Not Found</h1>
        <p className="text-zinc-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard" className="text-indigo-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {item.seo_title && <title>{item.seo_title}</title>}
      {item.seo_description && <meta name="description" content={item.seo_description} />}
      {item.seo_keywords && <meta name="keywords" content={item.seo_keywords} />}

      <header className="border-b border-zinc-200 bg-zinc-50/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/dashboard/${section}`}
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-200/50 px-3 py-1 rounded-full">
            Preview Mode
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-0 py-8">
        <article className="px-4 md:px-12">
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
              {item.title}
            </h1>
            <div className="text-zinc-500">
              {new Date(item.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </header>

          <div className="max-w-full mx-auto px-4 md:px-12">
            <LayoutEngine mode="view" value={item.content} />
          </div>
        </article>
      </main>
    </div>
  );
}
