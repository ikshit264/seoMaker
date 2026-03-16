'use client';

import { useState } from 'react';
import { Copy, Check, ArrowRight, Zap, FileCode, Code } from 'lucide-react';
import Link from 'next/link';

export default function QuickStartPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-zinc-900 mb-4">
          Quick Start Guide
        </h1>
        <p className="text-xl text-zinc-600">
          Get your blog running in 5 minutes with perfect SEO
        </p>
      </div>

      {/* Time Estimate */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Total Setup Time</h2>
            <p className="text-zinc-600">Copy 3 files, create 2 pages</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">5 min</div>
            <div className="text-sm text-zinc-500">Approximate</div>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
            1
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Copy the Files</h2>
        </div>

        <p className="text-zinc-600 mb-4 ml-16">
          Copy these 3 files from SEO Maker to your Next.js project:
        </p>

        <div className="relative ml-16">
          <div className="bg-zinc-900 rounded-xl p-6 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono">
              lib/seo-maker.ts<br />
              components/SeoMaker/PageCard.tsx<br />
              components/SeoMaker/PageRenderer.tsx
            </code>
          </div>
          <button
            onClick={() => copyToClipboard('lib/seo-maker.ts\ncomponents/SeoMaker/PageCard.tsx\ncomponents/SeoMaker/PageRenderer.tsx', 'files')}
            className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {copied === 'files' ? <Check className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
            {copied === 'files' ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="mt-4 ml-16 flex items-start gap-2 text-sm text-zinc-600">
          <ArrowRight className="w-4 h-4 mt-0.5" />
          <span>Your project should have Prisma already set up</span>
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
            2
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Create Blog List Page</h2>
        </div>

        <p className="text-zinc-600 mb-4 ml-16">
          Create <code className="bg-zinc-100 px-2 py-0.5 rounded text-sm">app/blogs/page.tsx</code>:
        </p>

        <div className="relative ml-16">
          <pre className="bg-zinc-900 rounded-xl p-6 overflow-x-auto text-sm text-gray-300 font-mono">
{`import { getPages } from '@/lib/seo-maker';
import { PageCard } from '@/components/SeoMaker/PageCard';

export default async function BlogsPage() {
  const pages = await getPages('blogs');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-8">Blog Posts</h1>
      
      {pages.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 rounded-2xl border">
          <p className="text-zinc-500">No posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <PageCard 
              key={page.slug} 
              page={page}
              baseUrl="/blogs"
            />
          ))}
        </div>
      )}
    </div>
  );
}`}
          </pre>
          <button
            onClick={() => copyToClipboard(`import { getPages } from '@/lib/seo-maker';
import { PageCard } from '@/components/SeoMaker/PageCard';

export default async function BlogsPage() {
  const pages = await getPages('blogs');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-8">Blog Posts</h1>
      
      {pages.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 rounded-2xl border">
          <p className="text-zinc-500">No posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <PageCard 
              key={page.slug} 
              page={page}
              baseUrl="/blogs"
            />
          ))}
        </div>
      )}
    </div>
  );
}`, 'step2')}
            className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {copied === 'step2' ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            {copied === 'step2' ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="mt-4 ml-16">
          <Link href="/docs/full-documentation" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium inline-flex items-center gap-1">
            See all available options
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
            3
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Create Single Post Page</h2>
        </div>

        <p className="text-zinc-600 mb-4 ml-16">
          Create <code className="bg-zinc-100 px-2 py-0.5 rounded text-sm">app/blogs/[slug]/page.tsx</code>:
        </p>

        <div className="relative ml-16">
          <pre className="bg-zinc-900 rounded-xl p-6 overflow-x-auto text-sm text-gray-300 font-mono">
{`import { getPage, generateMetadata } from '@/lib/seo-maker';
import { PageRenderer } from '@/components/SeoMaker/PageRenderer';

type Params = Promise<{ slug: string }>;

// Generate SEO metadata
export async function generateMetadata({ params }: { params: Params }) {
  const page = await getPage('blogs', (await params).slug);
  
  if (!page) return { title: 'Not Found' };
  
  return generateMetadata(page);
}

export default async function BlogPost({ params }: { params: Params }) {
  const page = await getPage('blogs', (await params).slug);

  if (!page) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <a href="/blogs" className="text-indigo-600">Return to Blog →</a>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <a href="/blogs" className="text-indigo-600 mb-8 inline-block">
        ← Back to Posts
      </a>

      <h1 className="text-4xl font-bold mb-4">
        {page.seo_title || page.title}
      </h1>
      
      <p className="text-xl text-zinc-600 mb-8">
        {page.seo_description}
      </p>

      {page.featured_image && (
        <img 
          src={page.featured_image} 
          alt={page.title} 
          className="w-full rounded-2xl shadow-lg mb-8"
        />
      )}

      {/* Render block editor content */}
      <PageRenderer content={page.published_layout_json} />

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData(page, 'https://yoursite.com')
          )
        }}
      />
    </article>
  );
}`}
          </pre>
          <button
            onClick={() => copyToClipboard(`import { getPage, generateMetadata } from '@/lib/seo-maker';
import { PageRenderer } from '@/components/SeoMaker/PageRenderer';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const page = await getPage('blogs', (await params).slug);
  if (!page) return { title: 'Not Found' };
  return generateMetadata(page);
}

export default async function BlogPost({ params }: { params: Params }) {
  const page = await getPage('blogs', (await params).slug);

  if (!page) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <a href="/blogs" className="text-indigo-600">Return to Blog →</a>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <a href="/blogs" className="text-indigo-600 mb-8 inline-block">← Back to Posts</a>

      <h1 className="text-4xl font-bold mb-4">{page.seo_title || page.title}</h1>
      <p className="text-xl text-zinc-600 mb-8">{page.seo_description}</p>

      {page.featured_image && (
        <img src={page.featured_image} alt={page.title} className="w-full rounded-2xl shadow-lg mb-8" />
      )}

      <PageRenderer content={page.published_layout_json} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(page, 'https://yoursite.com'))
        }}
      />
    </article>
  );
}`, 'step3')}
            className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {copied === 'step3' ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            {copied === 'step3' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-8 mb-12">
        <div className="text-center">
          <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">✨ Done! You're Ready!</h2>
          <p className="text-zinc-700 mb-6">
            You now have a fully functional blog with perfect SEO
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <span className="text-zinc-700">Server-side rendered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <span className="text-zinc-700">Auto meta tags</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <span className="text-zinc-700">Structured data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <span className="text-zinc-700">100% SEO optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-8">
        <h3 className="text-xl font-bold text-zinc-900 mb-4">What's Next?</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-1">Test Locally</h4>
              <p className="text-zinc-600 text-sm">Run <code className="bg-zinc-100 px-2 py-0.5 rounded">npm run dev</code> and visit <code className="bg-zinc-100 px-2 py-0.5 rounded">/blogs</code></p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-1">Create Content</h4>
              <p className="text-zinc-600 text-sm">Use the SEO Maker dashboard to create your first blog post</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-1">Deploy</h4>
              <p className="text-zinc-600 text-sm">Push to Vercel, Netlify, or your preferred hosting</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200">
          <Link 
            href="/docs/full-documentation"
            className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2"
          >
            View full documentation for advanced features
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Why This Approach */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
        <h3 className="text-xl font-bold text-zinc-900 mb-6">Why This Approach is Better</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'No SDK packages to install',
            'No API calls or HTTP overhead',
            'No domain verification needed',
            'Direct Prisma queries to YOUR database',
            'Full control over your data',
            'Simpler and faster setup',
            'Better performance',
            'Perfect SEO out of the box',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-zinc-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
