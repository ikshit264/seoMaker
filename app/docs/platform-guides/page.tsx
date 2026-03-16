'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function PlatformGuidesPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<'nextjs' | 'react' | 'astro'>('nextjs');

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const platforms = [
    { id: 'nextjs', name: 'Next.js', icon: '⚡' },
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'astro', name: 'Astro', icon: '🚀' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-zinc-900 mb-4">
          Platform-Specific Integration Guides
        </h1>
        <p className="text-xl text-zinc-600">
          Two simple functions. Direct database access. Perfect SEO.
        </p>
      </div>

      {/* Platform Selector */}
      <div className="flex gap-4 mb-12 justify-center">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setActivePlatform(platform.id as any)}
            className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activePlatform === platform.id
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <span className="text-2xl">{platform.icon}</span>
            {platform.name}
          </button>
        ))}
      </div>

      {/* Next.js Guide */}
      {activePlatform === 'nextjs' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-8">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Next.js Integration (App Router)</h2>
            <p className="text-zinc-700 mb-6">
              Use fetchAllArticles() and fetchArticle() - two simple functions that handle everything.
            </p>
            
            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
              <h3 className="font-bold text-zinc-900 mb-4">Step 1: Add Database URL to .env</h3>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-green-400 font-mono">
{`DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/seoMaker"`}
              </pre>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
              <h3 className="font-bold text-zinc-900 mb-4">Step 2: The 2 Core Functions</h3>
              <p className="text-sm text-zinc-600 mb-4">Copy these to lib/seo-maker-integration.ts:</p>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono relative">
{`import { listItems, getItem } from './db';

const dbUrl = process.env.DATABASE_URL!;

// Function 1: Fetch all articles (basic data)
export async function fetchAllArticles(section: string) {
  const articles = await listItems(dbUrl, section);
  return articles.map((article: any) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    featured_image: article.featured_image,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  }));
}

// Function 2: Fetch single article (full content)
export async function fetchArticle(section: string, slug: string) {
  const article = await getItem(dbUrl, section, slug);
  if (!article) return null;
  
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    seo_keywords: article.seo_keywords,
    og_title: article.og_title,
    og_description: article.og_description,
    og_image: article.og_image,
    featured_image: article.featured_image,
    draft_layout_json: article.draft_layout_json,
    published_layout_json: article.published_layout_json,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}`}
              </pre>
              <button
                onClick={() => copyToClipboard(`import { listItems, getItem } from './db';

const dbUrl = process.env.DATABASE_URL!;

export async function fetchAllArticles(section: string) {
  const articles = await listItems(dbUrl, section);
  return articles.map((article: any) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    featured_image: article.featured_image,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  }));
}

export async function fetchArticle(section: string, slug: string) {
  const article = await getItem(dbUrl, section, slug);
  if (!article) return null;
  
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    seo_keywords: article.seo_keywords,
    og_title: article.og_title,
    og_description: article.og_description,
    og_image: article.og_image,
    featured_image: article.featured_image,
    draft_layout_json: article.draft_layout_json,
    published_layout_json: article.published_layout_json,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}`, 'functions')}
                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                {copied === 'functions' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
              <h3 className="font-bold text-zinc-900 mb-4">Step 3: List Page (/blogs/page.tsx)</h3>
              <p className="text-sm text-zinc-600 mb-4">Function 1 + UI Grid Component</p>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono relative">
{`import { fetchAllArticles } from '@/lib/seo-maker-integration';
import { ArticleGrid } from '@/components/SeoMaker/ArticleCard';

export default async function BlogsPage() {
  const articles = await fetchAllArticles('blogs');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-8">Blog Posts</h1>
      <ArticleGrid articles={articles} baseUrl="/blogs" />
    </div>
  );
}`}
              </pre>
              <button
                onClick={() => copyToClipboard(`import { fetchAllArticles } from '@/lib/seo-maker-integration';
import { ArticleGrid } from '@/components/SeoMaker/ArticleCard';

export default async function BlogsPage() {
  const articles = await fetchAllArticles('blogs');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-8">Blog Posts</h1>
      <ArticleGrid articles={articles} baseUrl="/blogs" />
    </div>
  );
}`, 'nextjs-list')}
                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                {copied === 'nextjs-list' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
              <h3 className="font-bold text-zinc-900 mb-4">Step 4: Single Post (/blogs/[slug]/page.tsx)</h3>
              <p className="text-sm text-zinc-600 mb-4">Function 2 + Full UI with Auto SEO</p>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono relative">
{`import { fetchArticle, generateSeoMetadata } from '@/lib/seo-maker-integration';
import { ArticleRenderer } from '@/components/SeoMaker/ArticleRenderer';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const article = await fetchArticle('blogs', (await params).slug);
  return generateSeoMetadata(article);
}

export default async function BlogPost({ params }: { params: Params }) {
  const article = await fetchArticle('blogs', (await params).slug);

  if (!article) return <div>Post Not Found</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/blogs" className="text-indigo-600 mb-8 inline-block">← Back to Posts</Link>
      <h1 className="text-4xl font-bold mb-4">{article.seo_title || article.title}</h1>
      {article.featured_image && (
        <img src={article.featured_image} alt={article.title} className="w-full rounded-2xl shadow-lg mb-8" />
      )}
      <ArticleRenderer content={article.published_layout_json} />
    </article>
  );
}`}
              </pre>
              <button
                onClick={() => copyToClipboard(`import { fetchArticle, generateSeoMetadata } from '@/lib/seo-maker-integration';
import { ArticleRenderer } from '@/components/SeoMaker/ArticleRenderer';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const article = await fetchArticle('blogs', (await params).slug);
  return generateSeoMetadata(article);
}

export default async function BlogPost({ params }: { params: Params }) {
  const article = await fetchArticle('blogs', (await params).slug);

  if (!article) return <div>Post Not Found</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/blogs" className="text-indigo-600 mb-8 inline-block">← Back to Posts</Link>
      <h1 className="text-4xl font-bold mb-4">{article.seo_title || article.title}</h1>
      {article.featured_image && (
        <img src={article.featured_image} alt={article.title} className="w-full rounded-2xl shadow-lg mb-8" />
      )}
      <ArticleRenderer content={article.published_layout_json} />
    </article>
  );
}`, 'nextjs-single')}
                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                {copied === 'nextjs-single' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Done! You're Ready
              </h3>
              <p className="text-green-800">
                ✅ Function 1: fetchAllArticles() - List pages<br/>
                ✅ Function 2: fetchArticle() - Single posts<br/>
                ✅ SSR rendering for perfect SEO<br/>
                ✅ Auto-generated metadata & structured data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* React Guide */}
      {activePlatform === 'react' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">React Integration</h2>
            <p className="text-zinc-700 mb-6">
              Client-side rendering with API endpoint using the same functions.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-2">⚠️ Note for React</h3>
              <p className="text-blue-800 text-sm mb-4">
                React runs on the client, so you need an API endpoint. For better SEO, use Next.js instead.
              </p>
              <p className="text-blue-700 text-sm">
                Create an API route that uses fetchAllArticles(), then call it from your React component with useEffect or React Query.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Astro Guide */}
      {activePlatform === 'astro' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-8">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Astro Integration (SSG)</h2>
            <p className="text-zinc-700 mb-6">
              Static site generation with zero JavaScript by default.
            </p>
            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
              <h3 className="font-bold text-zinc-900 mb-4">Example: src/pages/blogs/index.astro</h3>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`---
import { fetchAllArticles } from '../../lib/seo-maker-integration';

const articles = await fetchAllArticles('blogs');
---

<html>
  <head><title>My Blog</title></head>
  <body>
    <h1>Blog Posts</h1>
    {articles.map(article => (
      <a href={\`/blogs/\${article.slug}\`}>
        <h2>{article.seo_title}</h2>
      </a>
    ))}
  </body>
</html>`}
              </pre>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-2">✅ Perfect for SEO!</h3>
              <p className="text-green-800 text-sm">
                Zero JavaScript, maximum performance!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
