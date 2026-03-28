'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Database, FileCode, Globe, Layers, Loader2, Rocket, Sparkles } from 'lucide-react';

interface SectionData {
  sections: string[];
  loading: boolean;
}

type TabKey = 'overview' | 'nextjs' | 'react' | 'astro' | 'html';

interface CodeBlockProps {
  label: string;
  code: string;
  copyKey: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}

function CodeBlock({ label, code, copyKey, copied, onCopy }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <span className="text-xs font-mono text-zinc-400">{label}</span>
        <button
          onClick={() => onCopy(code, copyKey)}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          {copied === copyKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied === copyKey ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="max-h-[520px] overflow-auto p-4 text-sm leading-6 text-zinc-200 whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function buildFrameworkPrompt(framework: string, sections: string[], defaultSection: string) {
  const sectionLines = sections.map((section) => `- ${section}: list page /${section} and detail page /${section}/[slug]`).join('\n');
  const sectionArray = sections.map((section) => `'${section}'`).join(', ');

  return `You are building a production-ready ${framework} integration for a CMS-backed content website.

Use these CMS sections exactly:
${sectionLines}

The CMS item shape returned from the backend is normalized and consistent across PostgreSQL and MongoDB:
{
  id: string,
  title: string | null,
  slug: string | null,
  seo_title: string | null,
  seo_description: string | null,
  seo_keywords: string | null,
  og_title: string | null,
  og_description: string | null,
  og_image: string | null,
  twitter_title: string | null,
  twitter_description: string | null,
  twitter_image: string | null,
  featured_image: string | null,
  draft_layout_json: { blocks: Block[] },
  published_layout_json: { blocks: Block[] } | null,
  content: { blocks: Block[] },
  created_at: string | Date | null,
  updated_at: string | Date | null
}

Important rendering rule:
Use content in this order:
1. published_layout_json
2. draft_layout_json
3. content

Block types that must be supported:
- section
- paragraph
- list
- table
- faq
- image
- quote
- code
- embed
- navigation

Section blocks are recursive:
{
  id: string,
  type: 'section',
  content: {
    title: string,
    blocks: Block[]
  }
}

Implement everything needed so the website works without extra manual steps:
- database helper utilities / API fetch helpers
- reusable recursive BlockRenderer component
- all section list pages for these sections: [${sectionArray}]
- all detail pages for these sections
- navigation that links to every detected section
- SEO metadata using seo_title, seo_description, seo_keywords, og_*, twitter_*
- featured image rendering
- 404 handling
- types/interfaces for the CMS payload
- clean responsive UI

Output requirements:
- Return complete file-by-file code
- Include exact file paths
- Do not leave TODOs
- Do not invent a different schema
- Use the normalized { blocks: [...] } structure exactly as provided above
- Make the detail page for /${defaultSection}/[slug] and then generalize the same implementation for the other sections
- The final code should be directly runnable after pasting into the project

Assume the CMS backend already exists and returns the normalized payload above. Focus on fetching, rendering, routing, and metadata.`;
}

export default function IntegrationGuidePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [copied, setCopied] = useState<string | null>(null);
  const [sectionsData, setSectionsData] = useState<SectionData>({ sections: [], loading: true });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const dbUrl = localStorage.getItem('cms_db_url');
        if (!dbUrl) {
          setSectionsData({ sections: ['blogs', 'problems', 'solutions'], loading: false });
          return;
        }

        const response = await fetch('/api/db/sections', {
          headers: { 'x-db-url': dbUrl },
        });

        if (!response.ok) {
          throw new Error('Failed to load sections');
        }

        const data = await response.json();
        const sections = Array.isArray(data?.sections?.cms)
          ? data.sections.cms
          : Array.isArray(data?.sections)
            ? data.sections
            : ['blogs', 'problems', 'solutions'];

        setSectionsData({ sections, loading: false });
      } catch {
        setSectionsData({ sections: ['blogs', 'problems', 'solutions'], loading: false });
      }
    };

    loadSections();
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const sectionsList = useMemo(() => (sectionsData.sections.length ? sectionsData.sections : ['blogs', 'problems', 'solutions']), [sectionsData.sections]);
  const defaultSection = sectionsList[0] || 'blogs';

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'nextjs', label: 'Next.js' },
    { key: 'react', label: 'React' },
    { key: 'astro', label: 'Astro' },
    { key: 'html', label: 'HTML/JS' },
  ];

  const prompts = {
    nextjs: buildFrameworkPrompt('Next.js App Router', sectionsList, defaultSection),
    react: buildFrameworkPrompt('React SPA', sectionsList, defaultSection),
    astro: buildFrameworkPrompt('Astro', sectionsList, defaultSection),
    html: buildFrameworkPrompt('plain HTML/CSS/JavaScript', sectionsList, defaultSection),
  };

  const contentContractCode = `// Normalized content returned by /api/db/items and stored in SQL + MongoDB
{
  id: '...',
  title: '...',
  slug: '...',
  seo_title: '...',
  seo_description: '...',
  seo_keywords: 'keyword one, keyword two',
  featured_image: 'https://...',
  draft_layout_json: { blocks: [...] },
  published_layout_json: { blocks: [...] },
  content: { blocks: [...] }
}`;

  const notesCode = `Detected CMS sections from this app:
${sectionsList.map((section) => `- ${section}`).join('\n')}

Integration rules:
- Render published_layout_json first.
- Fall back to draft_layout_json.
- Fall back to content.
- The same normalized payload is returned for PostgreSQL and MongoDB.
- The renderer must support recursive section blocks.
- Use slug-based detail pages for every section.`;

  const nextRendererCode = `// components/BlockRenderer.tsx
interface Block {
  id: string;
  type: string;
  content?: any;
}

function renderBlocks(blocks: Block[]): React.ReactNode {
  return blocks.map((block) => {
    switch (block.type) {
      case 'section':
        return (
          <section key={block.id} className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-zinc-900">{block.content?.title}</h2>
            <div className="space-y-6">{renderBlocks(block.content?.blocks || [])}</div>
          </section>
        );
      case 'paragraph':
        return <p key={block.id} className="text-lg leading-8 text-zinc-700 whitespace-pre-wrap">{block.content || ''}</p>;
      case 'list':
        return <ul key={block.id} className="list-disc pl-6 text-zinc-700">{(block.content?.items || []).map((item: string, index: number) => <li key={index}>{item}</li>)}</ul>;
      case 'faq':
        return <div key={block.id} className="space-y-4">{(block.content?.items || []).map((item: any, index: number) => <details key={index}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>;
      case 'table':
        return <table key={block.id}><tbody>{(block.content?.rows || []).map((row: string[], rowIndex: number) => <tr key={rowIndex}>{row.map((cell: string, cellIndex: number) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>;
      default:
        return null;
    }
  });
}

export default function BlockRenderer({ content }: { content: { blocks?: Block[] } | null }) {
  return <div className="space-y-8">{renderBlocks(content?.blocks || [])}</div>;
}`;

  const nextPageCode = `// app/${defaultSection}/[slug]/page.tsx
import { notFound } from 'next/navigation';
import BlockRenderer from '@/components/BlockRenderer';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/db/items?section=${defaultSection}&id=' + slug, {
    headers: { 'x-db-url': process.env.DATABASE_URL! },
    cache: 'no-store',
  });
  const data = await response.json();
  const item = data.item;
  if (!item) notFound();

  const content = item.published_layout_json || item.draft_layout_json || item.content;

  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-4 text-5xl font-bold text-zinc-900">{item.seo_title || item.title}</h1>
      <BlockRenderer content={content} />
    </article>
  );
}`;

  const reactPageCode = `// src/pages/SectionPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SectionPage() {
  const { section } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_CMS_API_BASE + '/api/db/items?section=' + section, {
      headers: { 'x-db-url': import.meta.env.VITE_DATABASE_URL }
    })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []));
  }, [section]);

  return <div>{items.map((item) => <a key={item.id} href={"/" + section + "/" + item.slug}>{item.seo_title || item.title}</a>)}</div>;
}`;

  const astroPageCode = `---
const response = await fetch(import.meta.env.PUBLIC_CMS_API_BASE + '/api/db/items?section=${defaultSection}', {
  headers: { 'x-db-url': import.meta.env.DATABASE_URL }
});
const data = await response.json();
const items = data.items || [];
---
<html><body>{items.map((item) => <a href={'/${defaultSection}/' + item.slug}>{item.seo_title || item.title}</a>)}</body></html>`;

  const htmlCode = `const API_BASE = 'http://localhost:3000';
const DB_URL = 'YOUR_DATABASE_URL';

fetch(API_BASE + '/api/db/items?section=${defaultSection}', {
  headers: { 'x-db-url': DB_URL }
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data.items);
  });`;

  const PromptPanel = ({ title, prompt, copyKey }: { title: string; prompt: string; copyKey: string }) => (
    <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50/60 p-6 shadow-sm">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
        <Sparkles className="h-3.5 w-3.5" />
        One-shot AI IDE Prompt
      </div>
      <h2 className="text-2xl font-black text-zinc-900">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">Copy this once into Cursor, Claude Code, Windsurf, or another AI IDE and it will have the section list plus the exact CMS shape to implement all routes.</p>
      <div className="mt-5">
        <CodeBlock label="Prompt" code={prompt} copyKey={copyKey} copied={copied} onCopy={copyToClipboard} />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-10 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              <Rocket className="h-3.5 w-3.5" /> Integration Guide
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900">Copy once, generate the whole integration</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">Each framework tab now includes a single prompt that already contains the list of sections created in this app, so users can paste it straight into their AI IDE and get all list/detail pages implemented.</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-600">
            {sectionsData.loading ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading sections</span>
            ) : (
              <span><strong className="text-zinc-900">Detected sections:</strong> {sectionsList.join(', ')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-2xl px-5 py-3 text-sm font-black transition-all ${activeTab === tab.key ? 'bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-600"><Database className="h-5 w-5" /></div>
              <h2 className="text-xl font-black text-zinc-900">One storage contract</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">The integration prompt now describes the exact normalized payload returned from the CMS, so AI tools don’t guess the schema.</p>
            </div>
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600"><Layers className="h-5 w-5" /></div>
              <h2 className="text-xl font-black text-zinc-900">All sections included</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">Every detected section from this app is injected into the prompt so the external project can generate all list/detail pages in one go.</p>
            </div>
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-2xl bg-amber-50 p-3 text-amber-600"><Globe className="h-5 w-5" /></div>
              <h2 className="text-xl font-black text-zinc-900">Website-first rendering</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">The guide keeps the same rule as the app itself: render published content first, then fall back safely.</p>
            </div>
          </div>
          <CodeBlock label="Content Contract" code={contentContractCode} copyKey="contract" copied={copied} onCopy={copyToClipboard} />
          <CodeBlock label="Notes" code={notesCode} copyKey="notes" copied={copied} onCopy={copyToClipboard} />
        </div>
      )}

      {activeTab === 'nextjs' && (
        <div className="space-y-6">
          <PromptPanel title="Next.js one-shot prompt" prompt={prompts.nextjs} copyKey="prompt-nextjs" />
          <CodeBlock label="BlockRenderer.tsx example" code={nextRendererCode} copyKey="next-renderer" copied={copied} onCopy={copyToClipboard} />
          <CodeBlock label={`app/${defaultSection}/[slug]/page.tsx example`} code={nextPageCode} copyKey="next-page" copied={copied} onCopy={copyToClipboard} />
        </div>
      )}

      {activeTab === 'react' && (
        <div className="space-y-6">
          <PromptPanel title="React one-shot prompt" prompt={prompts.react} copyKey="prompt-react" />
          <CodeBlock label="SectionPage.jsx example" code={reactPageCode} copyKey="react-page" copied={copied} onCopy={copyToClipboard} />
        </div>
      )}

      {activeTab === 'astro' && (
        <div className="space-y-6">
          <PromptPanel title="Astro one-shot prompt" prompt={prompts.astro} copyKey="prompt-astro" />
          <CodeBlock label="page example" code={astroPageCode} copyKey="astro-page" copied={copied} onCopy={copyToClipboard} />
        </div>
      )}

      {activeTab === 'html' && (
        <div className="space-y-6">
          <PromptPanel title="HTML/JS one-shot prompt" prompt={prompts.html} copyKey="prompt-html" />
          <CodeBlock label="API fetch example" code={htmlCode} copyKey="html-code" copied={copied} onCopy={copyToClipboard} />
        </div>
      )}

      <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="inline-flex rounded-2xl bg-zinc-100 p-3 text-zinc-700"><FileCode className="h-5 w-5" /></div>
        <h2 className="mt-4 text-2xl font-black text-zinc-900">What the prompt now covers</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
          <li>All sections created by the CMS user in this app.</li>
          <li>The exact SQL/Mongo normalized content contract.</li>
          <li>List pages and detail pages for every section.</li>
          <li>Recursive block rendering and metadata usage.</li>
        </ul>
      </div>
    </div>
  );
}

