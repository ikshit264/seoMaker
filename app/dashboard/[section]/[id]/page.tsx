'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Eye, LayoutTemplate, Loader2, Save, Sparkles, X } from 'lucide-react';
import LayoutEngine, { LayoutEngineContent } from '@/components/grid-editor/LayoutEngine';
import PreviewOverlay from '@/components/grid-editor/PreviewOverlay';
import { AiGenerateResponse, AiGenerateResponseSchema, AiGenerationMode } from '@/lib/ai-content';
import {
  buildBlockOutline,
  cloneBlocksWithNewIds,
  insertBlocksAtSelection,
  normalizeLayoutContent,
  replaceBlocksAtSelection,
  summarizeStructure,
  summarizeTargetContext,
} from '@/lib/editor-content';
import { TEMPLATE_CATALOG, importTemplate } from '@/lib/templates';

function OutlineList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-zinc-400">No structured blocks yet.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="rounded-xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-600 whitespace-pre-wrap">
          {item}
        </div>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-indigo-400"
        placeholder={placeholder}
      />
    </div>
  );
}

export default function EditItem() {
  const { section, id } = useParams() as { section: string; id: string };
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');

  const [gridContent, setGridContent] = useState<LayoutEngineContent | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [loading, setLoading] = useState(id !== 'new');
  const [saving, setSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string>(TEMPLATE_CATALOG[0]?.id || '');

  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMode, setAiMode] = useState<AiGenerationMode>('full-page');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPreview, setAiPreview] = useState<AiGenerateResponse | null>(null);

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

    fetch(`/api/db/items?section=${section}&id=${id}`, { headers: { 'x-db-url': url } })
      .then((res) => res.json())
      .then((data) => {
        const item = data.item;
        if (!item) {
          setGridContent({ blocks: [] });
          setLoading(false);
          return;
        }

        setTitle(item.title || '');
        setSlug(item.slug || '');
        setSeoTitle(item.seo_title || '');
        setSeoDescription(item.seo_description || '');
        setSeoKeywords(item.seo_keywords || '');
        setOgTitle(item.og_title || '');
        setOgDescription(item.og_description || '');
        setOgImage(item.og_image || '');
        setTwitterTitle(item.twitter_title || '');
        setTwitterDescription(item.twitter_description || '');
        setTwitterImage(item.twitter_image || '');
        setFeaturedImage(item.featured_image || '');

        let parsedContent: any = null;
        try {
          const rawContent = item.draft_layout_json || item.content;
          parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
        } catch {
          parsedContent = null;
        }

        if (Array.isArray(parsedContent)) {
          setGridContent({ blocks: parsedContent.filter((block) => block?.id) });
        } else {
          setGridContent(normalizeLayoutContent(parsedContent));
        }

        setLoading(false);
      });
  }, [id, router, section]);

  const normalizedContent = useMemo(() => normalizeLayoutContent(gridContent), [gridContent]);
  const currentOutline = useMemo(() => buildBlockOutline(normalizedContent, 16), [normalizedContent]);
  const currentStructure = useMemo(() => summarizeStructure(normalizedContent), [normalizedContent]);
  const selectedTarget = useMemo(() => summarizeTargetContext(normalizedContent, selectedBlockId), [normalizedContent, selectedBlockId]);
  const selectedTemplate = TEMPLATE_CATALOG.find((template) => template.id === pendingTemplateId) || TEMPLATE_CATALOG[0];

  const openAiDialog = (mode: AiGenerationMode, blockId?: string | null) => {
    setAiMode(mode);
    setSelectedBlockId(blockId ?? null);
    setAiError('');
    setAiPreview(null);
    setIsAiDialogOpen(true);
  };

  const closeAiDialog = () => {
    setIsAiDialogOpen(false);
    setAiError('');
    setAiPreview(null);
    setAiLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = localStorage.getItem('cms_db_url');
    if (!url) return;

    const payload = {
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
      content: normalizedContent,
    };

    const res = await fetch('/api/db/items', {
      method: id === 'new' ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-db-url': url,
      },
      body: JSON.stringify(id === 'new' ? { section, data: payload } : { section, id, data: payload }),
    });

    if (!res.ok) {
      const data = await res.json();
      setSaving(false);
      alert(data.error || 'Failed to save');
      return;
    }

    const result = await res.json();
    if (id === 'new' && result.item?.id) {
      router.push(`/dashboard/${section}/${result.item.id}`);
    } else {
      router.refresh();
    }
    setSaving(false);
  };

  const handleGenerateAi = async () => {
    setAiLoading(true);
    setAiError('');
    setAiPreview(null);

    const res = await fetch('/api/ai/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: aiMode,
        prompt: aiPrompt,
        targetContext: aiMode === 'section' ? selectedTarget : undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setAiError(data.error || 'Failed to generate content');
      setAiLoading(false);
      return;
    }

    setAiPreview(
      AiGenerateResponseSchema.parse({
        ...data,
        summary: {
          ...data.summary,
          originalOutline: currentOutline,
        },
      })
    );
    setAiLoading(false);
  };

  const applyAiReplace = () => {
    if (!aiPreview) return;
    const generated = cloneBlocksWithNewIds(aiPreview.mappedContent.blocks);
    setGridContent(aiMode === 'section' && selectedBlockId ? replaceBlocksAtSelection(normalizedContent, selectedBlockId, generated) : { blocks: generated });
    setSelectedBlockId(null);
    closeAiDialog();
  };

  const applyAiInsert = () => {
    if (!aiPreview) return;
    const generated = cloneBlocksWithNewIds(aiPreview.mappedContent.blocks);
    setGridContent(insertBlocksAtSelection(normalizedContent, aiMode === 'section' ? selectedBlockId : null, generated));
    setSelectedBlockId(null);
    closeAiDialog();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-6">
          <Link href={`/dashboard/${section}`} className="p-3 bg-white border border-zinc-200 text-zinc-400 rounded-2xl shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{id === 'new' ? 'Create New' : 'Edit Entry'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{section}</span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-400 text-xs font-medium">{slug || 'no-slug'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsPreviewOpen(true)} className="bg-white border-2 border-zinc-100 text-zinc-700 px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-3 shadow-xl shadow-zinc-100/50">
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
          <button onClick={handleSave} disabled={saving} className="bg-zinc-900 text-white px-8 py-3 rounded-2xl text-sm font-black flex items-center gap-3 disabled:opacity-70 shadow-2xl shadow-zinc-200">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-[2.5rem] border-2 border-zinc-50 shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Display Title" value={title} onChange={setTitle} placeholder="Enter main title..." />
            <Field label="URL Slug" value={slug} onChange={setSlug} placeholder="url-path-segment" />
            <Field label="Featured Image" value={featuredImage} onChange={setFeaturedImage} placeholder="https://example.com/image.jpg" />
            <Field label="SEO Title" value={seoTitle} onChange={setSeoTitle} placeholder="SEO title" />
            <Field label="OG Title" value={ogTitle} onChange={setOgTitle} placeholder="OG title" />
            <Field label="OG Image" value={ogImage} onChange={setOgImage} placeholder="OG image URL" />
            <Field label="Twitter Title" value={twitterTitle} onChange={setTwitterTitle} placeholder="Twitter title" />
            <Field label="Twitter Image" value={twitterImage} onChange={setTwitterImage} placeholder="Twitter image URL" />
          </div>
          <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-indigo-400 min-h-[120px]" placeholder="SEO description" />
          <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-indigo-400 min-h-[90px]" placeholder="OG description" />
          <textarea value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-indigo-400 min-h-[90px]" placeholder="Twitter description" />
          <Field label="SEO Keywords" value={seoKeywords} onChange={setSeoKeywords} placeholder="keyword 1, keyword 2" />
        </div>

        <div className="bg-white rounded-[3rem] border-2 border-zinc-50 shadow-sm p-6 md:p-10 space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 block">Visual Builder</span>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Post Content</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setIsTemplateDialogOpen(true)} className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-zinc-700 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4" />
                Templates
              </button>
              <button type="button" onClick={() => openAiDialog('full-page')} className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Generate
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-1">
            <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50/40 p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600">{currentStructure.totalBlocks} blocks</span>
                <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600">{currentStructure.sectionCount} sections</span>
                <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600">{currentStructure.faqCount} FAQs</span>
                <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600">{currentStructure.tableCount} tables</span>
              </div>
              <p className="mb-4 text-sm text-zinc-500">Use the top button for full-page generation, or click the AI button on any section block to generate content for that specific section.</p>
              <OutlineList items={currentOutline.slice(0, 8)} />
            </div>
          </div>

          <LayoutEngine
            mode="edit"
            value={normalizedContent}
            onChange={setGridContent}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onGenerateAiForSection={(blockId) => openAiDialog('section', blockId)}
          />
        </div>
      </div>

      {isTemplateDialogOpen && selectedTemplate && (
        <div className="fixed inset-0 z-[120] bg-zinc-950/60 backdrop-blur-sm p-4 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 p-6 md:p-10 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Template Library</span>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight mt-3">Import a structured page template</h2>
                <p className="text-zinc-500 mt-3">Choosing a template replaces the current editor content only. Metadata fields stay unchanged.</p>
              </div>
              <button type="button" onClick={() => setIsTemplateDialogOpen(false)} className="p-3 rounded-2xl border border-zinc-200 text-zinc-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {TEMPLATE_CATALOG.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setPendingTemplateId(template.id)}
                    className={`text-left rounded-[2rem] border p-6 transition-all ${
                      pendingTemplateId === template.id ? 'border-indigo-500 bg-indigo-50/50 shadow-lg' : 'border-zinc-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="rounded-full bg-zinc-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">{template.category}</span>
                      {pendingTemplateId === template.id && (
                        <span className="rounded-full bg-indigo-600 text-white p-1">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-zinc-900">{template.name}</h3>
                    <p className="text-sm text-zinc-500 mt-2">{template.description}</p>
                  </button>
                ))}
              </div>

              <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50/60 p-6 space-y-5">
                <h3 className="text-2xl font-black text-zinc-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-zinc-500">{selectedTemplate.useCase}</p>
                <p className="text-sm text-zinc-600">{selectedTemplate.preview.summary}</p>
                <OutlineList items={selectedTemplate.preview.sectionTitles} />
                <button
                  type="button"
                  onClick={() => {
                    const imported = importTemplate(selectedTemplate.id);
                    setGridContent(imported.content);
                    setSelectedBlockId(null);
                    setIsTemplateDialogOpen(false);
                  }}
                  className="w-full rounded-2xl bg-zinc-900 px-5 py-4 text-sm font-black text-white"
                >
                  Replace Content With This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAiDialogOpen && (
        <div className="fixed inset-0 z-[130] bg-zinc-950/60 backdrop-blur-sm p-4 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 p-6 md:p-10 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">AI Studio</span>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight mt-3">Generate structured content with Gemini 2.5 Flash</h2>
                <p className="text-zinc-500 mt-3">The model returns structured JSON only. Review the diff before applying anything to the page.</p>
              </div>
              <button type="button" onClick={closeAiDialog} className="p-3 rounded-2xl border border-zinc-200 text-zinc-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50/60 p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setAiMode('full-page')} className={`rounded-2xl px-4 py-3 text-sm font-black ${aiMode === 'full-page' ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600'}`}>Full Page</button>
                  <button type="button" onClick={() => setAiMode('section')} className={`rounded-2xl px-4 py-3 text-sm font-black ${aiMode === 'section' ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600'}`}>Section</button>
                </div>

                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full rounded-[1.5rem] border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-700 outline-none focus:border-emerald-400 min-h-[220px] leading-relaxed"
                  placeholder="Describe the page or section you want. Mention audience, angle, important sections, FAQs, comparisons, tables, and tone."
                />

                <div className="rounded-[1.5rem] bg-white border border-zinc-200 p-4 space-y-3 text-sm text-zinc-600">
                  {aiMode === 'section' ? (
                    <>
                      <div><strong className="text-zinc-900">Target section:</strong> {selectedTarget.selectedBlockLabel || 'No section selected'}</div>
                      <OutlineList items={selectedTarget.nearbyBlockLabels} />
                      {!selectedBlockId && <p className="text-xs text-amber-600 font-semibold">Choose the AI button on a section block to generate content for that section.</p>}
                    </>
                  ) : (
                    <>
                      <div><strong className="text-zinc-900">Generation scope:</strong> Full page</div>
                      <p className="text-sm text-zinc-500">Gemini will generate the entire article structure from introduction through body sections and FAQs.</p>
                    </>
                  )}
                </div>

                {aiError && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{aiError}</div>}

                <button type="button" onClick={handleGenerateAi} disabled={aiLoading || aiPrompt.trim().length < 10 || (aiMode === 'section' && !selectedBlockId)} className="w-full rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white disabled:opacity-60">
                  {aiLoading ? <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Generating Structured Content</span> : 'Generate JSON Content'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50/50 p-6">
                    <h3 className="text-sm font-black text-zinc-900 mb-4">Current Outline</h3>
                    <OutlineList items={currentOutline} />
                  </div>
                  <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50/50 p-6">
                    <h3 className="text-sm font-black text-zinc-900 mb-4">AI Outline</h3>
                    <OutlineList items={aiPreview?.summary.generatedOutline || []} />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-zinc-100 bg-zinc-50/50 p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600">{aiPreview?.summary.generatedStructure.totalBlocks || 0} generated blocks</span>
                    <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600">{aiPreview?.summary.generatedStructure.sectionCount || 0} sections</span>
                    <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600">{aiPreview?.summary.generatedStructure.faqCount || 0} FAQs</span>
                    <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600">{aiPreview?.summary.generatedStructure.tableCount || 0} tables</span>
                  </div>
                  {aiPreview?.warnings?.length ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                      {aiPreview.warnings.map((warning, index) => (
                        <p key={`${warning}-${index}`} className="text-sm text-amber-700">{warning}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">{aiPreview ? 'Review the generated structure, then keep the original page, replace with AI, or insert the generated blocks.' : 'Generated content will appear here after Gemini returns structured JSON.'}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={closeAiDialog} className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-black text-zinc-600">Keep Original</button>
                  <button type="button" onClick={applyAiReplace} disabled={!aiPreview} className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-black text-white disabled:opacity-50">Replace With AI</button>
                  <button type="button" onClick={applyAiInsert} disabled={!aiPreview} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">Insert AI Result Into Page</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <PreviewOverlay isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} content={normalizedContent} title={title || 'Untitled'} />
    </div>
  );
}
