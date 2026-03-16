'use client';

import { useState } from 'react';
import { Copy, Check, ChevronRight, BookOpen, Zap, Database, Layers, Code, Terminal, FileCode, AlertCircle } from 'lucide-react';

export default function FullDocumentationPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-zinc-900 mb-4">
          Complete Integration Documentation
        </h1>
        <p className="text-xl text-zinc-600">
          The comprehensive guide to integrating SEO Maker with your Next.js application
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100">
          <Zap className="w-8 h-8 text-indigo-600 mb-3" />
          <h3 className="text-lg font-bold text-zinc-900 mb-2">5 Minute Setup</h3>
          <p className="text-sm text-zinc-600">Copy 3 files and you're done</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100">
          <Database className="w-8 h-8 text-emerald-600 mb-3" />
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Direct Database</h3>
          <p className="text-sm text-zinc-600">No APIs, no SDKs, just Prisma</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100">
          <Layers className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Perfect SEO</h3>
          <p className="text-sm text-zinc-600">SSR with auto meta tags</p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 mb-12">
        <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Table of Contents
        </h2>
        <nav className="space-y-2">
          <a href="#why-this-approach" className="block text-zinc-700 hover:text-indigo-600 transition-colors">
            → Why This Approach is Better
          </a>
          <a href="#what-you-get" className="block text-zinc-700 hover:text-indigo-600 transition-colors">
            → What You Get
          </a>
          <a href="#step-by-step-setup" className="block text-zinc-700 hover:text-indigo-600 transition-colors">
            → Step-by-Step Setup
          </a>
          <a href="#functions-reference" className="block text-zinc-700 hover:text-indigo-600 transition-colors">
            → Functions Reference
          </a>
          <a href="#ui-components" className="block text-zinc-700 hover:text-indigo-600 transition-colors">
            → UI Components
          </a>
          <a href="#advanced-examples" className="block text-zinc-700 hover:text-indigo-600 transition-colors">
            → Advanced Examples
          </a>
          <a href="#customization" className="block text-zinc-700 hover:text-indigo-600 transition-colors">
            → Customization
          </a>
          <a href="#troubleshooting" className="block text-zinc-700 hover:text-indigo-600 transition-colors">
            → Troubleshooting
          </a>
        </nav>
      </div>

      {/* Why This Approach */}
      <section id="why-this-approach" className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Why This Approach is Better</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <p className="text-blue-900 mb-4">
            Unlike other solutions that require SDK packages, API calls, and domain verification, 
            this approach is beautifully simple: just copy 3 files and use direct Prisma queries to your own database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'No SDK Packages', desc: 'Nothing to install or update' },
            { title: 'No API Calls', desc: 'Direct database queries' },
            { title: 'No Domain Verification', desc: "It's your own database!" },
            { title: 'No CORS Issues', desc: 'Everything server-side' },
            { title: 'Full Control', desc: 'Access to all your data' },
            { title: 'Better Performance', desc: 'Zero HTTP overhead' },
            { title: 'Simpler Setup', desc: 'Just copy files' },
            { title: 'Perfect SEO', desc: 'True server-side rendering' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-zinc-200">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{item.title}</h3>
                <p className="text-sm text-zinc-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What You Get */}
      <section id="what-you-get" className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">What You Get</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <FileCode className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">lib/seo-maker.ts</h3>
            <p className="text-sm text-zinc-600 mb-3">Data fetching + SEO helpers</p>
            <ul className="text-sm text-zinc-700 space-y-1">
              <li>• getPages()</li>
              <li>• getPage()</li>
              <li>• generateMetadata()</li>
              <li>• generateStructuredData()</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <Code className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">PageCard.tsx</h3>
            <p className="text-sm text-zinc-600 mb-3">Blog list card component</p>
            <ul className="text-sm text-zinc-700 space-y-1">
              <li>• Responsive design</li>
              <li>• Hover effects</li>
              <li>• Image support</li>
              <li>• Date formatting</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <Layers className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">PageRenderer.tsx</h3>
            <p className="text-sm text-zinc-600 mb-3">Content renderer</p>
            <ul className="text-sm text-zinc-700 space-y-1">
              <li>• Block editor support</li>
              <li>• Multiple block types</li>
              <li>• Customizable</li>
              <li>• SEO optimized</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Step-by-Step Setup */}
      <section id="step-by-step-setup" className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Step-by-Step Setup</h2>

        {/* Step 1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Copy the Files</h3>
          </div>
          
          <p className="text-zinc-600 mb-4 ml-11">
            Copy these 3 files from SEO Maker to your Next.js project:
          </p>
          
          <div className="relative ml-11">
            <pre className="bg-zinc-900 rounded-xl p-4 overflow-x-auto text-sm text-green-400 font-mono">
{`lib/seo-maker.ts
components/SeoMaker/PageCard.tsx
components/SeoMaker/PageRenderer.tsx`}
            </pre>
            <button
              onClick={() => copyToClipboard('lib/seo-maker.ts\ncomponents/SeoMaker/PageCard.tsx\ncomponents/SeoMaker/PageRenderer.tsx', 'step1')}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copied === 'step1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'step1' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Create Blog List Page</h3>
          </div>
          
          <p className="text-zinc-600 mb-4 ml-11">
            Create <code className="bg-zinc-100 px-2 py-0.5 rounded">app/blogs/page.tsx</code>:
          </p>
          
          <div className="relative ml-11">
            <pre className="bg-zinc-900 rounded-xl p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`import { getPages } from '@/lib/seo-maker';
import { PageCard } from '@/components/SeoMaker/PageCard';

export default async function BlogsPage() {
  const pages = await getPages('blogs');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <PageCard 
            key={page.slug} 
            page={page}
            baseUrl="/blogs"
          />
        ))}
      </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <PageCard 
            key={page.slug} 
            page={page}
            baseUrl="/blogs"
          />
        ))}
      </div>
    </div>
  );
}`, 'step2')}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copied === 'step2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'step2' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Create Single Post Page</h3>
          </div>
          
          <p className="text-zinc-600 mb-4 ml-11">
            Create <code className="bg-zinc-100 px-2 py-0.5 rounded">app/blogs/[slug]/page.tsx</code>:
          </p>
          
          <div className="relative ml-11">
            <pre className="bg-zinc-900 rounded-xl p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`import { getPage, generateMetadata } from '@/lib/seo-maker';
import { PageRenderer } from '@/components/SeoMaker/PageRenderer';

export async function generateMetadata({ params }) {
  const page = await getPage('blogs', params.slug);
  return generateMetadata(page);
}

export default async function BlogPost({ params }) {
  const page = await getPage('blogs', params.slug);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1>{page.seo_title || page.title}</h1>
      <PageRenderer content={page.published_layout_json} />
    </article>
  );
}`}
            </pre>
            <button
              onClick={() => copyToClipboard(`import { getPage, generateMetadata } from '@/lib/seo-maker';
import { PageRenderer } from '@/components/SeoMaker/PageRenderer';

export async function generateMetadata({ params }) {
  const page = await getPage('blogs', params.slug);
  return generateMetadata(page);
}

export default async function BlogPost({ params }) {
  const page = await getPage('blogs', params.slug);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1>{page.seo_title || page.title}</h1>
      <PageRenderer content={page.published_layout_json} />
    </article>
  );
}`, 'step3')}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copied === 'step3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'step3' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="ml-11 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Done! You're Ready
          </h3>
          <p className="text-green-800">
            You now have a fully functional blog with perfect SEO. Total time: ~5 minutes!
          </p>
        </div>
      </section>

      {/* Functions Reference */}
      <section id="functions-reference" className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Functions Reference</h2>

        {/* getPages */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">getPages(section)</h3>
              <p className="text-sm text-zinc-600">Fetch all pages from a section</p>
            </div>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">Async</span>
          </div>
          
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono mb-4">
{`const blogs = await getPages('blogs');
const problems = await getPages('problems');
const solutions = await getPages('solutions');`}
          </pre>

          <div className="text-sm text-zinc-700">
            <strong>Returns:</strong> Promise&lt;SeoMakerPage[]&gt; - Array of page objects ordered by creation date (newest first)
          </div>
        </div>

        {/* getPage */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">getPage(section, slug)</h3>
              <p className="text-sm text-zinc-600">Fetch single page by slug</p>
            </div>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">Async</span>
          </div>
          
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono mb-4">
{`const post = await getPage('blogs', 'my-first-post');
if (!post) {
  return <div>Post not found</div>;
}`}
          </pre>

          <div className="text-sm text-zinc-700">
            <strong>Returns:</strong> Promise&lt;SeoMakerPage | null&gt; - The page object or null if not found
          </div>
        </div>

        {/* generateMetadata */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">generateMetadata(page)</h3>
              <p className="text-sm text-zinc-600">Generate SEO metadata for Next.js</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">Sync</span>
          </div>
          
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono mb-4">
{`export async function generateMetadata({ params }) {
  const page = await getPage('blogs', params.slug);
  return generateMetadata(page);
}`}
          </pre>

          <div className="text-sm text-zinc-700">
            <strong>Returns:</strong> Metadata object compatible with Next.js App Router<br/>
            Includes: title, description, keywords, openGraph, twitter
          </div>
        </div>

        {/* generateStructuredData */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">generateStructuredData(page, siteUrl)</h3>
              <p className="text-sm text-zinc-600">Generate JSON-LD for search engines</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">Sync</span>
          </div>
          
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono mb-4">
{`<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      generateStructuredData(page, 'https://yoursite.com')
    )
  }}
/>`}
          </pre>

          <div className="text-sm text-zinc-700">
            <strong>Returns:</strong> Schema.org BlogPosting structured data object
          </div>
        </div>

        {/* getPagesWithPagination */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">getPagesWithPagination(section, limit, skip)</h3>
              <p className="text-sm text-zinc-600">Fetch pages with pagination</p>
            </div>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">Async</span>
          </div>
          
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono mb-4">
{`const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const { pages, total } = await getPagesWithPagination('blogs', limit, skip);`}
          </pre>

          <div className="text-sm text-zinc-700">
            <strong>Returns:</strong> Promise&lt;{'{ pages: SeoMakerPage[], total: number }'}&gt;
          </div>
        </div>
      </section>

      {/* UI Components */}
      <section id="ui-components" className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">UI Components</h2>

        {/* PageCard */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">PageCard Component</h3>
          <p className="text-zinc-600 mb-4">Beautiful card component for displaying page previews</p>
          
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono mb-4">
{`<PageCard 
  page={page}
  baseUrl="/blogs"
  className="hover:scale-105"
/>`}
          </pre>

          <div className="text-sm">
            <strong className="text-zinc-900">Props:</strong>
            <ul className="mt-2 space-y-1 text-zinc-700">
              <li><code className="bg-zinc-100 px-2 py-0.5 rounded">page</code> - Page object with title, slug, seo_title, etc.</li>
              <li><code className="bg-zinc-100 px-2 py-0.5 rounded">baseUrl</code> - Base URL for the link (e.g., '/blogs')</li>
              <li><code className="bg-zinc-100 px-2 py-0.5 rounded">className</code> - Optional custom CSS classes</li>
            </ul>
          </div>
        </div>

        {/* PageRenderer */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">PageRenderer Component</h3>
          <p className="text-zinc-600 mb-4">Renders block editor content from published_layout_json</p>
          
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono mb-4">
{`<PageRenderer 
  content={page.published_layout_json}
  className="prose prose-lg"
/>`}
          </pre>

          <div className="text-sm">
            <strong className="text-zinc-900">Props:</strong>
            <ul className="mt-2 space-y-1 text-zinc-700">
              <li><code className="bg-zinc-100 px-2 py-0.5 rounded">content</code> - The published_layout_json from the page</li>
              <li><code className="bg-zinc-100 px-2 py-0.5 rounded">className</code> - Optional custom CSS classes</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This component includes renderers for all block types 
              (Heading, Paragraph, Image, List, Quote, Code, Divider, Table, FAQ, Embed). 
              You can replace them with your existing block components.
            </p>
          </div>
        </div>
      </section>

      {/* Advanced Examples */}
      <section id="advanced-examples" className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Advanced Examples</h2>

        {/* Pagination */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Pagination Example</h3>
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`export default async function BlogsPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const skip = (page - 1) * limit;

  const { pages, total } = await getPagesWithPagination('blogs', limit, skip);

  return (
    <div>
      {pages.map(p => <PageCard key={p.slug} page={p} baseUrl="/blogs" />)}
      
      <nav>
        {page > 1 && (
          <Link href={\`/blogs?page=\${page - 1}\`}>Previous</Link>
        )}
        {skip + limit < total && (
          <Link href={\`/blogs?page=\${page + 1}\`}>Next</Link>
        )}
      </nav>
    </div>
  );
}`}
          </pre>
        </div>

        {/* Search/Filter */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Search by Keywords</h3>
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`export default async function SearchPage({ searchParams }) {
  const allPages = await getPages('blogs');
  
  const filtered = searchParams.q
    ? allPages.filter(p => 
        p.seo_keywords?.toLowerCase().includes(searchParams.q!.toLowerCase())
      )
    : allPages;

  return (
    <div>
      <h1>Results for "{searchParams.q}"</h1>
      {filtered.map(p => <PageCard key={p.slug} page={p} baseUrl="/blogs" />)}
    </div>
  );
}`}
          </pre>
        </div>

        {/* Multiple Sections */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Multiple Sections on One Page</h3>
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`export default async function HomePage() {
  const blogs = await getPages('blogs');
  const problems = await getPages('problems');

  return (
    <div>
      <section>
        <h2>Latest Blogs</h2>
        {blogs.slice(0, 3).map(blog => (
          <div key={blog.slug}>{blog.title}</div>
        ))}
      </section>

      <section>
        <h2>Problems</h2>
        {problems.slice(0, 3).map(problem => (
          <div key={problem.slug}>{problem.title}</div>
        ))}
      </section>
    </div>
  );
}`}
          </pre>
        </div>
      </section>

      {/* Customization */}
      <section id="customization" className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Customization</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-3">Custom Styling</h3>
            <p className="text-zinc-600 mb-4 text-sm">All components accept className prop</p>
            <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`<PageCard 
  page={page}
  baseUrl="/blogs"
  className="hover:scale-105 transition-transform"
/>

<PageRenderer 
  content={page.content}
  className="prose prose-xl dark:prose-invert"
/>`}
            </pre>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-3">Use Your Own Blocks</h3>
            <p className="text-zinc-600 mb-4 text-sm">Replace example renderers with your components</p>
            <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`// In PageRenderer.tsx
import { HeadingBlock } from '@/components/blocks/HeadingBlock';
import { ParagraphBlock } from '@/components/blocks/ParagraphBlock';

switch (block.type) {
  case 'heading':
    return <HeadingBlock key={block.id} data={block.data} />;
  // ... etc
}`}
            </pre>
          </div>
        </div>

        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-2">Enable ISR (Optional)</h3>
          <p className="text-purple-800 mb-4 text-sm">Revalidate pages automatically</p>
          <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`// In your page component
export const revalidate = 3600; // Revalidate every hour`}
          </pre>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="mb-12">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Troubleshooting</h2>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              "Cannot find module '@/lib/seo-maker'"
            </h3>
            <p className="text-zinc-600 mb-3 text-sm">Make sure you copied the file to the correct location and your tsconfig.json has path aliases:</p>
            <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
{`{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}`}
            </pre>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              "Prisma is not defined"
            </h3>
            <p className="text-zinc-600 text-sm">Make sure you have Prisma installed and generated:</p>
            <pre className="bg-zinc-900 rounded-lg p-4 mt-3 overflow-x-auto text-sm text-gray-300 font-mono">
{`npm install @prisma/client
npx prisma generate`}
            </pre>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Content not rendering
            </h3>
            <p className="text-zinc-600 text-sm">Check the structure of published_layout_json. The PageRenderer expects either:</p>
            <ul className="mt-2 text-sm text-zinc-700 space-y-1">
              <li>• {'{'} layout: {'{...}'}, blocks: {'[...]'} {'}'} format</li>
              <li>• Simple [{'{'} type: 'paragraph', data: {'{...}'} {'}'}] array</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <div className="text-center pt-12 border-t border-zinc-200">
        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2">
          <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
          Back to top
        </a>
      </div>
    </div>
  );
}
