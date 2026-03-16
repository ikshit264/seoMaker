'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Eye, Share2, Globe, Image as ImageIcon, Twitter } from 'lucide-react';
import LayoutEngine, { LayoutEngineContent } from '@/components/grid-editor/LayoutEngine';
import PreviewOverlay from '@/components/grid-editor/PreviewOverlay';

export default function EditItem() {
  const { section, id } = useParams() as { section: string, id: string };
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  
  // Basic SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  
  // Open Graph
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  
  // Twitter
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  
  // Featured Image
  const [featuredImage, setFeaturedImage] = useState('');

  const [gridContent, setGridContent] = useState<LayoutEngineContent | null>(null);
  const [loading, setLoading] = useState(id !== 'new');
  const [saving, setSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id === 'new') {
        setGridContent({ blocks: [] });
        return;
    }

    const url = localStorage.getItem('cms_db_url');
    if (!url) {
      router.push('/');
      return;
    }

    fetch(`/api/db/items?section=${section}&id=${id}`, {
      headers: { 'x-db-url': url }
    })
      .then(res => res.json())
      .then(data => {
        if (data.item) {
          setTitle(data.item.title || '');
          setSlug(data.item.slug || '');
          setSeoTitle(data.item.seo_title || '');
          setSeoDescription(data.item.seo_description || '');
          setSeoKeywords(data.item.seo_keywords || '');
          
          setOgTitle(data.item.og_title || '');
          setOgDescription(data.item.og_description || '');
          setOgImage(data.item.og_image || '');
          
          setTwitterTitle(data.item.twitter_title || '');
          setTwitterDescription(data.item.twitter_description || '');
          setTwitterImage(data.item.twitter_image || '');
          
          setFeaturedImage(data.item.featured_image || '');

          let parsedContent: any = null;
          try {
            const rawContent = data.item.draft_layout_json || data.item.content;
            parsedContent = typeof rawContent === 'string'
              ? JSON.parse(rawContent)
              : rawContent;
          } catch (e) { }

          // Migration helper
          const mapBlock = (b: any) => {
            if (!b || typeof b !== 'object' || !b.id) return null;
            return {
              ...b,
              type: b.type === 'rich-text' ? 'paragraph' : b.type
            };
          };

          if (Array.isArray(parsedContent)) {
            setGridContent({ blocks: parsedContent.map(mapBlock).filter(Boolean) as any });
          } else if (parsedContent && parsedContent.blocks && Array.isArray(parsedContent.blocks)) {
            setGridContent({ blocks: parsedContent.blocks.map(mapBlock).filter(Boolean) as any });
          } else {
            setGridContent({ blocks: [] });
          }
        } else {
          setGridContent({ blocks: [] });
        }
        setLoading(false);
      });
  }, [section, id, router]);

  const handleSave = async () => {
    setSaving(true);
    const url = localStorage.getItem('cms_db_url');
    if (!url) return;

    const data = {
      title,
      slug,
      seo_title: seoTitle,
      seo_description: seoDescription,
      seo_keywords: seoKeywords,
      og_title: ogTitle,
      og_description: ogDescription,
      og_image: ogImage,
      twitter_title: twitterTitle,
      twitter_description: twitterDescription,
      twitter_image: twitterImage,
      featured_image: featuredImage,
      content: gridContent
    };

    try {
      const method = id === 'new' ? 'POST' : 'PUT';
      const body = id === 'new' ? { section, data } : { section, id, data };

      const res = await fetch('/api/db/items', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-db-url': url
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      const result = await res.json();
      
      // If creating a new item, redirect to the edit page with the new ID
      if (id === 'new' && result.item?.id) {
        router.push(`/dashboard/${section}/${result.item.id}`);
      } else {
        router.refresh();
      }
      
      setSaving(false);
    } catch (err: any) {
      alert(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-24 px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div className="flex items-center gap-6">
          <Link
            href={`/dashboard/${section}`}
            className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              {id === 'new' ? 'Create New' : 'Edit Entry'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                {section}
              </span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-400 text-xs font-medium">{slug || 'no-slug'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="bg-white border-2 border-zinc-100 hover:border-indigo-100 hover:bg-zinc-50 text-zinc-700 px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-3 shadow-xl shadow-zinc-100/50"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-3 disabled:opacity-70 shadow-2xl shadow-zinc-200"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Section 1: Basic & Media */}
        <div className="bg-white rounded-[2.5rem] border-2 border-zinc-50 shadow-sm p-10 space-y-10">
          <div className="flex items-center gap-4 border-b border-zinc-50 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Primary Information</h2>
              <p className="text-zinc-400 text-sm font-medium">Core details and identification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Display Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (id === 'new') {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }
                }}
                className="w-full px-6 py-4 bg-zinc-50 border-2 border-zinc-50 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-200"
                placeholder="Enter main title..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-6 py-4 bg-zinc-50 border-2 border-zinc-50 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none transition-all font-mono text-xs text-indigo-600 placeholder:text-zinc-200"
                placeholder="url-path-segment"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Featured Image URL</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 border-2 border-zinc-50 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm font-medium"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {featuredImage && (
                <div className="w-16 h-16 rounded-2xl border-2 border-zinc-100 overflow-hidden shrink-0 shadow-lg shadow-indigo-50">
                  <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: SEO & Social Suite (Moved from sidebar) */}
        <div className="bg-white rounded-[2.5rem] border-2 border-zinc-50 shadow-sm p-10 space-y-10">
          <div className="flex items-center gap-4 border-b border-zinc-50 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">SEO & Social Suite</h2>
              <p className="text-zinc-400 text-sm font-medium">Manage visibility on Search & Social</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Search SEO */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-l-4 border-zinc-100 pl-3">Search SEO</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1">Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-indigo-400 outline-none transition-all text-xs font-bold"
                  placeholder="Google search title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1">Meta Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-indigo-400 outline-none transition-all text-xs font-medium min-h-[120px] leading-relaxed"
                  placeholder="Search engine snippet..."
                />
              </div>
            </div>

            {/* Open Graph */}
            <div className="space-y-6 border-l md:border-l border-zinc-50 md:pl-8">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Open Graph</h3>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1">OG Title</label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-indigo-400 outline-none transition-all text-xs font-bold"
                  placeholder="Share title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1">OG Image URL</label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-indigo-400 outline-none transition-all text-xs font-medium"
                  placeholder="Custom share image..."
                />
              </div>
            </div>

            {/* Twitter */}
            <div className="space-y-6 border-l md:border-l border-zinc-50 md:pl-8">
              <div className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-sky-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Twitter Card</h3>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1">Twitter Title</label>
                <input
                  type="text"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-indigo-400 outline-none transition-all text-xs font-bold"
                  placeholder="Twitter specific title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300 ml-1">Twitter Image URL</label>
                <input
                  type="text"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:bg-white focus:border-indigo-400 outline-none transition-all text-xs font-medium"
                  placeholder="Twitter image..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-[3rem] border-2 border-zinc-50 shadow-sm p-4 md:p-12">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 block">Visual Builder</span>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Post Content</h2>
            <div className="w-12 h-1 bg-indigo-600 mx-auto mt-4 rounded-full opacity-20"></div>
          </div>
          <div className="min-h-[800px]">
            <LayoutEngine mode="edit" value={gridContent} onChange={setGridContent} />
          </div>
        </div>
      </div>

      <PreviewOverlay
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        content={gridContent}
        title={title || 'Untitled'}
      />
    </div>
  );
}
