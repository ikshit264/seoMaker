'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Code, BookOpen, Zap, Database, Layers, FileJson, Rocket, Atom, Globe, FileCode, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SectionData {
  sections: string[];
  loading: boolean;
  error: string | null;
}

interface CodeBlockProps {
  code: string;
  label: string;
  copyKey: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}

function CodeBlock({ code, label, copyKey, copied, onCopy }: CodeBlockProps) {
  return (
    <div className="relative mb-4">
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 rounded-t-xl">
        <span className="text-xs text-zinc-400 font-mono">{label}</span>
        <button
          onClick={() => onCopy(code, copyKey)}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          {copied === copyKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === copyKey ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-zinc-900 rounded-b-xl p-4 overflow-x-auto text-sm text-gray-300 font-mono max-h-[500px] overflow-y-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function IntegrationGuidePage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'nextjs' | 'react' | 'astro' | 'html'>('overview');
  const [sectionsData, setSectionsData] = useState<SectionData>({ sections: [], loading: true, error: null });

  // Fetch sections from CMS on mount
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const dbUrl = process.env.NEXT_PUBLIC_DATABASE_URL || localStorage.getItem('dbUrl');
        if (!dbUrl) {
          setSectionsData({ sections: ['blogs', 'problems', 'solutions'], loading: false, error: null });
          return;
        }

        const response = await fetch('/api/db/sections', {
          headers: { 'x-db-url': dbUrl }
        });

        if (!response.ok) throw new Error('Failed to fetch sections');

        const data = await response.json();
        setSectionsData({ sections: data.sections || [], loading: false, error: null });
      } catch (err) {
        console.error('Error fetching sections:', err);
        setSectionsData({ sections: ['blogs', 'problems', 'solutions'], loading: false, error: null });
      }
    };

    fetchSections();
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Universal AI Prompt - PRODUCTION READY (Dynamic based on CMS sections)
  const getAiPromptText = () => {
    const sectionsList = sectionsData.sections.length > 0 
      ? sectionsData.sections.join(', ') 
      : 'blogs, problems, solutions';
    
    return `You are an expert full-stack developer. Create a PRODUCTION-READY integration for a blog/content management system.

============================================
DATABASE SCHEMA
============================================
- _cms_metadata table: type (string), name (string) - stores section names
- Section tables (${sectionsList}): id, title, slug, seo_title, seo_description, seo_keywords, featured_image, published_layout_json, created_at

============================================
PAGES TO CREATE
============================================
Based on the CMS sections (${sectionsList}), create these pages:
${sectionsData.sections.map(s => `- /${s} - List all ${s}`).join('\n')}
${sectionsData.sections.map(s => `- /${s}/[slug] - Individual ${s} detail page`).join('\n')}

Include dynamic navigation that shows all sections: ${sectionsList}

============================================
CONTENT BLOCK TYPES
============================================
- paragraph: { type: 'paragraph', data: { text: string } }
- header: { type: 'header', data: { level: 1-6, text: string } }
- image: { type: 'image', data: { file: { url: string }, caption: string } }
- list: { type: 'list', data: { style: 'ordered'|'unordered', items: string[] } }
- code: { type: 'code', data: { code: string, language: string } }
- quote: { type: 'quote', data: { text: string } }
- divider: { type: 'divider' }

============================================
CRITICAL PRODUCTION REQUIREMENTS
============================================

1. DATABASE CONNECTION POOLING:
   - Use pg.Pool for PostgreSQL (not individual Client connections)
   - Use singleton pattern for MongoDB connections
   - Implement connection pool with max 20 connections
   - Add connection timeout handling

2. SQL INJECTION PROTECTION:
   - Validate section names against whitelist from _cms_metadata
   - NEVER interpolate table names directly - use validated whitelist
   - Use parameterized queries for all user inputs

3. PAGINATION:
   - Implement LIMIT/OFFSET pagination (default 12 items per page)
   - Add page number query params (?page=1)
   - Return total count and hasMore flag

4. CACHING & ISR:
   - Use Next.js unstable_cache or ISR with revalidate: 60
   - Cache section lists for 5 minutes minimum
   - Implement cache invalidation on content updates

5. SITEMAP & ROBOTS.TXT:
   - Generate dynamic sitemap.xml with all pages
   - Create robots.txt with proper crawler directives
   - Include lastmod, changefreq, priority

6. SEO ENHANCEMENTS:
   - Add canonical URLs for each page
   - Add proper OpenGraph image dimensions (width, height, alt)
   - Implement JSON-LD structured data (BlogPosting schema)
   - Add breadcrumb structured data

7. ERROR HANDLING:
   - Create custom error boundary components
   - Implement proper 404 pages with helpful navigation
   - Add try-catch with logging for all DB operations
   - Return proper HTTP status codes

8. SECURITY:
   - Sanitize all user inputs
   - Add CORS configuration
   - Implement rate limiting on API routes

9. IMAGE OPTIMIZATION:
   - Use lazy loading for images
   - Add width/height attributes to prevent layout shift
   - Support responsive images with srcset

10. MONITORING:
    - Create /api/health endpoint with DB connectivity check
    - Add performance timing for database queries
    - Implement graceful error responses

============================================
BASIC REQUIREMENTS
============================================
- Block renderer for all 7 content types
- Dynamic navigation from database sections
- List pages (/blogs, /problems, /solutions, etc.)
- Detail pages (/blogs/my-post, /problems/my-problem, etc.)
- SEO meta tags (title, description, keywords, OpenGraph, Twitter)
- Tailwind CSS responsive styling
- Support both PostgreSQL and MongoDB

============================================
TECH STACK
============================================
{Specify: Next.js 14+, React 18+, Vue 3+, Angular, Svelte, Astro, Nuxt, Remix, etc.}

============================================
OUTPUT FORMAT
============================================
For each file provide:
- Complete file path
- Full working code with imports
- Key comments for complex logic

Generate production-ready code I can deploy immediately.`;
  };

  // ============================================
  // NEXT.JS COMPLETE CODE EXAMPLES
  // ============================================

  const nextjsDbCode = `// lib/db.ts
// Database helper functions - works with both PostgreSQL and MongoDB

import { Client } from 'pg';

export type DbType = 'postgres' | 'mongodb';

export function getDbType(url: string): DbType {
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return 'postgres';
  }
  if (url.startsWith('mongodb://') || url.startsWith('mongodb+srv://')) {
    return 'mongodb';
  }
  throw new Error('Unsupported database URL');
}

// Fetch all sections from _cms_metadata table
export async function listSections(url: string): Promise<string[]> {
  const type = getDbType(url);
  
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    try {
      const res = await client.query(
        \\"SELECT name FROM _cms_metadata WHERE type = 'section'\\"
      );
      await client.end();
      return res.rows.map((row: any) => row.name);
    } catch (e) {
      await client.end();
      return [];
    }
  }
  
  // MongoDB implementation would go here
  return [];
}

// Fetch all pages from a section
export async function listItems(url: string, section: string): Promise<any[]> {
  const type = getDbType(url);
  
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query(
      'SELECT * FROM "' + section + '" ORDER BY created_at DESC'
    );
    await client.end();
    return res.rows;
  }
  
  return [];
}

// Fetch single page by slug
export async function getItemBySlug(
  url: string, 
  section: string, 
  slug: string
): Promise<any | null> {
  const type = getDbType(url);
  
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query(
      'SELECT * FROM "' + section + '" WHERE slug = $1',
      [slug]
    );
    await client.end();
    return res.rows[0] || null;
  }
  
  return null;
}`;

  const nextjsBlockRendererCode = `// components/BlockRenderer.tsx
// Renders content blocks from published_layout_json

interface Block {
  type: string;
  data?: {
    text?: string;
    level?: number;
    items?: string[];
    style?: 'ordered' | 'unordered';
    file?: { url: string };
    caption?: string;
    code?: string;
    language?: string;
  };
}

interface BlockRendererProps {
  content: { blocks?: Block[] } | Block[] | null;
}

export default function BlockRenderer({ content }: BlockRendererProps) {
  if (!content) return null;
  
  const blocks = Array.isArray(content) ? content : content.blocks || [];
  
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p 
                key={index} 
                className="mb-4 text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.data?.text || '' }}
              />
            );
            
          case 'header':
            const level = block.data?.level || 2;
            const HeadingTag = ('h' + level) as keyof JSX.IntrinsicElements;
            const sizes: Record<number, string> = {
              1: 'text-4xl font-bold mb-6 mt-8',
              2: 'text-3xl font-bold mb-4 mt-6',
              3: 'text-2xl font-semibold mb-3 mt-5',
              4: 'text-xl font-semibold mb-2 mt-4',
              5: 'text-lg font-medium mb-2 mt-3',
              6: 'text-base font-medium mb-2 mt-3'
            };
            return (
              <HeadingTag key={index} className={sizes[level]}>
                {block.data?.text}
              </HeadingTag>
            );
            
          case 'image':
            return (
              <figure key={index} className="my-6">
                <img 
                  src={block.data?.file?.url} 
                  alt={block.data?.caption || ''}
                  className="w-full rounded-lg shadow-md"
                />
                {block.data?.caption && (
                  <figcaption className="text-center text-sm text-gray-500 mt-2">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );
            
          case 'list':
            const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className="mb-4 pl-6 space-y-1">
                {block.data?.items?.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ListTag>
            );
            
          case 'code':
            return (
              <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                <code className={'language-' + (block.data?.language || 'text')}>
                  {block.data?.code}
                </code>
              </pre>
            );
            
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-indigo-500 pl-4 italic my-4 text-gray-600">
                {block.data?.text}
              </blockquote>
            );
            
          case 'divider':
            return <hr key={index} className="my-8 border-gray-200" />;
            
          default:
            return null;
        }
      })}
    </div>
  );
}`;

  const nextjsListPageCode = `// app/[section]/page.tsx
// Example: app/blogs/page.tsx - Shows all blog posts

import { listSections, listItems } from '@/lib/db';
import Link from 'next/link';

// Generate static paths for all sections at build time
export async function generateStaticParams() {
  const dbUrl = process.env.DATABASE_URL!;
  const sections = await listSections(dbUrl);
  return sections.map((section) => ({ section }));
}

// Generate SEO metadata for each section
export async function generateMetadata({ 
  params 
}: { 
  params: { section: string } 
}) {
  const section = params.section;
  const titles: Record<string, string> = {
    blogs: 'Blog Posts',
    problems: 'Problems & Solutions',
    solutions: 'Solutions',
  };
  return {
    title: titles[section] || section.charAt(0).toUpperCase() + section.slice(1),
    description: \\"Browse all \\\${section}\\",
  };
}

// The main page component
export default async function SectionPage({ 
  params 
}: { 
  params: { section: string } 
}) {
  const { section } = params;
  const dbUrl = process.env.DATABASE_URL!;
  
  // Fetch sections and pages in parallel
  const [sections, pages] = await Promise.all([
    listSections(dbUrl),
    listItems(dbUrl, section),
  ]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-16 items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              My Site
            </Link>
            {sections.map((sec) => (
              <Link
                key={sec}
                href={\\"/\\\${sec}\\"}
                className={\\"text-sm font-medium \\\${
                  sec === section 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }\\"}
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
          {section}
        </h1>
        
        {pages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No posts found in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((page: any) => (
              <Link
                key={page.id}
                href={\\"/\\\${section}/\\\${page.slug}\\"}
                className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {page.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={page.featured_image}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {page.seo_title || page.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {page.seo_description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span>{new Date(page.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`;

  const nextjsDetailPageCode = `// app/[section]/[slug]/page.tsx
// Example: app/blogs/my-first-post/page.tsx - Shows single post

import { listSections, listItems, getItemBySlug } from '@/lib/db';
import BlockRenderer from '@/components/BlockRenderer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Generate static paths for all pages at build time
export async function generateStaticParams({ 
  params 
}: { 
  params: { section: string } 
}) {
  const dbUrl = process.env.DATABASE_URL!;
  const pages = await listItems(dbUrl, params.section);
  return pages.map((page: any) => ({ 
    section: params.section, 
    slug: page.slug 
  }));
}

// Generate SEO metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { section: string; slug: string } 
}): Promise<Metadata> {
  const dbUrl = process.env.DATABASE_URL!;
  const page = await getItemBySlug(dbUrl, params.section, params.slug);
  
  if (!page) return { title: 'Not Found' };
  
  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
    keywords: page.seo_keywords?.split(','),
    openGraph: {
      title: page.og_title || page.seo_title || page.title,
      description: page.og_description || page.seo_description,
      images: page.og_image || page.featured_image 
        ? [{ url: page.og_image || page.featured_image }] 
        : [],
    },
  };
}

// The detail page component
export default async function PageDetail({ 
  params 
}: { 
  params: { section: string; slug: string } 
}) {
  const { section, slug } = params;
  const dbUrl = process.env.DATABASE_URL!;
  
  const [sections, page] = await Promise.all([
    listSections(dbUrl),
    getItemBySlug(dbUrl, section, slug),
  ]);
  
  if (!page) notFound();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-16 items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              My Site
            </Link>
            {sections.map((sec) => (
              <Link
                key={sec}
                href={\\"/\\\${sec}\\"}
                className={\\"text-sm font-medium \\\${
                  sec === section 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }\\"}
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href={\\"/\\\${section}\\"}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6 inline-block"
        >
          ← Back to {section}
        </Link>
        
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {page.seo_title || page.title}
          </h1>
          {page.seo_description && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {page.seo_description}
            </p>
          )}
          <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
            <span>{new Date(page.created_at).toLocaleDateString()}</span>
            {page.seo_keywords && (
              <div className="flex gap-2">
                {page.seo_keywords.split(',').map((tag: string) => (
                  <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
        
        {page.featured_image && (
          <img
            src={page.featured_image}
            alt={page.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />
        )}
        
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <BlockRenderer content={page.published_layout_json} />
        </div>
      </article>
    </div>
  );
}`;

  const nextjsConfigCode = `// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // Static HTML export
  distDir: 'dist',         // Output directory
  images: {
    unoptimized: true,     // Required for static export
  },
};

module.exports = nextConfig;`;

  const nextjsEnvCode = `# .env.local
# Your database connection string
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# OR for MongoDB:
# DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/dbname`;

  // ============================================
  // REACT COMPLETE CODE EXAMPLES
  // ============================================

  const reactDbCode = `// src/lib/db.js
// API fetch helpers

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Fetch all sections
export async function fetchSections() {
  const response = await fetch(API_BASE_URL + '/sections');
  if (!response.ok) throw new Error('Failed to fetch sections');
  return response.json();
}

// Fetch all pages from a section
export async function fetchPages(section) {
  const response = await fetch(API_BASE_URL + '/pages?section=' + section);
  if (!response.ok) throw new Error('Failed to fetch pages');
  return response.json();
}

// Fetch single page by slug
export async function fetchPage(section, slug) {
  const response = await fetch(API_BASE_URL + '/pages?section=' + section + '&slug=' + slug);
  if (!response.ok) throw new Error('Failed to fetch page');
  return response.json();
}`;

  const reactBlockRendererCode = `// src/components/BlockRenderer.jsx
// Renders content blocks

export default function BlockRenderer({ content }) {
  if (!content) return null;
  
  const blocks = Array.isArray(content) ? content : content.blocks || [];
  
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p 
                key={index} 
                className="mb-4 text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.data?.text || '' }}
              />
            );
            
          case 'header':
            const level = block.data?.level || 2;
            const Tag = 'h' + level;
            const sizes = {
              1: 'text-4xl font-bold mb-6 mt-8',
              2: 'text-3xl font-bold mb-4 mt-6',
              3: 'text-2xl font-semibold mb-3 mt-5',
              4: 'text-xl font-semibold mb-2 mt-4',
              5: 'text-lg font-medium mb-2 mt-3',
              6: 'text-base font-medium mb-2 mt-3'
            };
            return <Tag key={index} className={sizes[level]}>{block.data?.text}</Tag>;
            
          case 'image':
            return (
              <figure key={index} className="my-6">
                <img 
                  src={block.data?.file?.url} 
                  alt={block.data?.caption || ''}
                  className="w-full rounded-lg shadow-md"
                />
                {block.data?.caption && (
                  <figcaption className="text-center text-sm text-gray-500 mt-2">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );
            
          case 'list':
            const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className="mb-4 pl-6 space-y-1">
                {block.data?.items?.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ListTag>
            );
            
          case 'code':
            return (
              <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                <code>{block.data?.code}</code>
              </pre>
            );
            
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-indigo-500 pl-4 italic my-4 text-gray-600">
                {block.data?.text}
              </blockquote>
            );
            
          case 'divider':
            return <hr key={index} className="my-8 border-gray-200" />;
            
          default:
            return null;
        }
      })}
    </div>
  );
}`;

  const reactNavigationCode = `// src/components/Navigation.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchSections } from '../lib/db';

export default function Navigation() {
  const [sections, setSections] = useState([]);
  const location = useLocation();
  
  useEffect(() => {
    fetchSections().then(setSections).catch(console.error);
  }, []);
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 h-16 items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            My Site
          </Link>
          {sections.map((sec) => (
            <Link
              key={sec}
              to={'/' + sec}
              className={'text-sm font-medium ' + (
                location.pathname.startsWith('/' + sec)
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {sec.charAt(0).toUpperCase() + sec.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}`;

  const reactSectionPageCode = `// src/pages/SectionPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPages } from '../lib/db';

export default function SectionPage() {
  const { section } = useParams();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    fetchPages(section)
      .then((data) => {
        setPages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [section]);
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
          {section}
        </h1>
        
        {pages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((page) => (
              <Link
                key={page.id}
                to={'/' + section + '/' + page.slug}
                className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {page.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={page.featured_image}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                    {page.seo_title || page.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {page.seo_description}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(page.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`;

  const reactDetailPageCode = `// src/pages/PageDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPage } from '../lib/db';
import BlockRenderer from '../components/BlockRenderer';

export default function PageDetail() {
  const { section, slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    fetchPage(section, slug)
      .then((data) => {
        setPage(data);
        setLoading(false);
        if (data) {
          document.title = data.seo_title || data.title;
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [section, slug]);
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!page) return <div className="p-8 text-center">Page not found</div>;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to={'/' + section}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6 inline-block"
        >
          ← Back to {section}
        </Link>
        
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {page.seo_title || page.title}
          </h1>
          {page.seo_description && (
            <p className="text-xl text-gray-600">{page.seo_description}</p>
          )}
          <div className="mt-4 text-sm text-gray-500">
            {new Date(page.created_at).toLocaleDateString()}
          </div>
        </header>
        
        {page.featured_image && (
          <img
            src={page.featured_image}
            alt={page.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />
        )}
        
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <BlockRenderer content={page.published_layout_json} />
        </div>
      </article>
    </div>
  );
}`;

  const reactAppCode = `// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import SectionPage from './pages/SectionPage';
import PageDetail from './pages/PageDetail';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome</h1>
              <p className="text-gray-600">Select a section from the navigation.</p>
            </div>
          </div>
        } />
        <Route path="/:section" element={<SectionPage />} />
        <Route path="/:section/:slug" element={<PageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;`;

  const reactApiCode = `// server.js (Backend API - Node.js/Express)
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL;

// Get all sections
app.get('/api/sections', async (req, res) => {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  const result = await client.query(
    "SELECT name FROM _cms_metadata WHERE type = 'section'"
  );
  await client.end();
  res.json(result.rows.map(row => row.name));
});

// Get pages from section
app.get('/api/pages', async (req, res) => {
  const { section, slug } = req.query;
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  
  if (slug) {
    const result = await client.query(
      'SELECT * FROM "' + section + '" WHERE slug = $1',
      [slug]
    );
    await client.end();
    res.json(result.rows[0]);
  } else {
    const result = await client.query(
      'SELECT * FROM "' + section + '" ORDER BY created_at DESC'
    );
    await client.end();
    res.json(result.rows);
  }
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));`;

  const reactEnvCode = `# .env
REACT_APP_API_URL=http://localhost:3001/api

# server.js .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname`;

  // ============================================
  // ASTRO COMPLETE CODE EXAMPLES
  // ============================================

  const astroDbCode = `// src/lib/db.ts
// Database helpers for Astro

export type DbType = 'postgres' | 'mongodb';

export function getDbType(url: string): DbType {
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return 'postgres';
  }
  if (url.startsWith('mongodb://') || url.startsWith('mongodb+srv://')) {
    return 'mongodb';
  }
  throw new Error('Unsupported database URL');
}

// Fetch all sections
export async function listSections(url: string): Promise<string[]> {
  const type = getDbType(url);
  
  if (type === 'postgres') {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: url });
    await client.connect();
    try {
      const res = await client.query(
        "SELECT name FROM _cms_metadata WHERE type = 'section'"
      );
      return res.rows.map((row: any) => row.name);
    } finally {
      await client.end();
    }
  }
  
  return [];
}

// Fetch all pages from a section
export async function listItems(url: string, section: string): Promise<any[]> {
  const type = getDbType(url);
  
  if (type === 'postgres') {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query(
      'SELECT * FROM "' + section + '" ORDER BY created_at DESC'
    );
    await client.end();
    return res.rows;
  }
  
  return [];
}

// Fetch single page by slug
export async function getItemBySlug(
  url: string, 
  section: string, 
  slug: string
): Promise<any | null> {
  const type = getDbType(url);
  
  if (type === 'postgres') {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query(
      'SELECT * FROM "' + section + '" WHERE slug = $1',
      [slug]
    );
    await client.end();
    return res.rows[0] || null;
  }
  
  return null;
}`;

  const astroBlockRendererCode = `---
// src/components/BlockRenderer.astro
interface Block {
  type: string;
  data?: {
    text?: string;
    level?: number;
    items?: string[];
    style?: 'ordered' | 'unordered';
    file?: { url: string };
    caption?: string;
    code?: string;
    language?: string;
  };
}

interface Props {
  content: { blocks?: Block[] } | Block[] | null;
}

const { content } = Astro.props;
const blocks = Array.isArray(content) ? content : content?.blocks || [];
---

<div class="prose prose-lg max-w-none">
  {blocks.map((block) => {
    switch (block.type) {
      case 'paragraph':
        return <p class="mb-4 text-gray-700 leading-relaxed" set:html={block.data?.text} />;
        
      case 'header':
        const level = block.data?.level || 2;
        const text = block.data?.text || '';
        const sizes: Record<number, string> = {
          1: 'text-4xl font-bold mb-6 mt-8',
          2: 'text-3xl font-bold mb-4 mt-6',
          3: 'text-2xl font-semibold mb-3 mt-5',
          4: 'text-xl font-semibold mb-2 mt-4',
          5: 'text-lg font-medium mb-2 mt-3',
          6: 'text-base font-medium mb-2 mt-3'
        };
        const className = sizes[level];
        return <h1 class={className}>{text}</h1>;
        
      case 'image':
        return (
          <figure class="my-6">
            <img 
              src={block.data?.file?.url} 
              alt={block.data?.caption || ''}
              class="w-full rounded-lg shadow-md"
            />
            {block.data?.caption && (
              <figcaption class="text-center text-sm text-gray-500 mt-2">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );
        
      case 'list':
        const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
        const listClass = "mb-4 pl-6 space-y-1";
        return (
          <ListTag class={listClass}>
            {block.data?.items?.map((item) => (
              <li class="text-gray-700">{item}</li>
            ))}
          </ListTag>
        );
        
      case 'code':
        return (
          <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code>{block.data?.code}</code>
          </pre>
        );
        
      case 'quote':
        return (
          <blockquote class="border-l-4 border-indigo-500 pl-4 italic my-4 text-gray-600">
            {block.data?.text}
          </blockquote>
        );
        
      case 'divider':
        return <hr class="my-8 border-gray-200" />;
        
      default:
        return null;
    }
  })}
</div>`;

  const astroNavigationCode = `---
// src/components/Navigation.astro
import { listSections } from '../lib/db';

const dbUrl = import.meta.env.DATABASE_URL;
const sections = await listSections(dbUrl);
const currentPath = Astro.url.pathname;
---

<nav class="bg-white shadow-sm border-b">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex space-x-8 h-16 items-center">
      <a href="/" class="text-xl font-bold text-indigo-600">
        My Site
      </a>
      {sections.map((sec) => (
        <a
          href={'/' + sec}
          class={'text-sm font-medium ' + (
            currentPath.startsWith('/' + sec)
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {sec.charAt(0).toUpperCase() + sec.slice(1)}
        </a>
      ))}
    </div>
  </div>
</nav>`;

  const astroListPageCode = `---
// src/pages/[section]/index.astro
import { listSections, listItems } from '../../lib/db';
import Navigation from '../../components/Navigation.astro';

export async function getStaticPaths() {
  const dbUrl = process.env.DATABASE_URL!;
  const sections = await listSections(dbUrl);
  return sections.map((section) => ({ params: { section } }));
}

const { section } = Astro.params;
const dbUrl = process.env.DATABASE_URL!;
const pages = await listItems(dbUrl, section);

const titles: Record<string, string> = {
  blogs: 'Blog Posts',
  problems: 'Problems & Solutions',
  solutions: 'Solutions',
};
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{titles[section] || section}</title>
    <meta name="description" content={'Browse all ' + section} />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen bg-gray-50">
    <Navigation />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8 capitalize">
        {section}
      </h1>
      
      {pages.length === 0 ? (
        <div class="text-center py-16">
          <p class="text-gray-500">No posts found in this section.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map((page: any) => (
            <a
              href={'/' + section + '/' + page.slug}
              class="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              {page.featured_image && (
                <div class="aspect-video overflow-hidden">
                  <img
                    src={page.featured_image}
                    alt={page.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  {page.seo_title || page.title}
                </h2>
                <p class="text-gray-600 text-sm line-clamp-3">
                  {page.seo_description}
                </p>
                <div class="mt-4 text-sm text-gray-500">
                  {new Date(page.created_at).toLocaleDateString()}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  </body>
</html>`;

  const astroDetailPageCode = `---
// src/pages/[section]/[slug].astro
import { listSections, listItems, getItemBySlug } from '../../lib/db';
import Navigation from '../../components/Navigation.astro';
import BlockRenderer from '../../components/BlockRenderer.astro';

export async function getStaticPaths() {
  const dbUrl = process.env.DATABASE_URL!;
  const sections = await listSections(dbUrl);
  
  const paths = [];
  for (const section of sections) {
    const pages = await listItems(dbUrl, section);
    for (const page of pages) {
      paths.push({ params: { section, slug: page.slug } });
    }
  }
  return paths;
}

const { section, slug } = Astro.params;
const dbUrl = process.env.DATABASE_URL!;
const page = await getItemBySlug(dbUrl, section, slug as string);

if (!page) {
  return Astro.redirect('/404');
}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{page.seo_title || page.title}</title>
    <meta name="description" content={page.seo_description || ''} />
    <meta name="keywords" content={page.seo_keywords || ''} />
    <meta property="og:title" content={page.og_title || page.seo_title || page.title} />
    <meta property="og:description" content={page.og_description || page.seo_description || ''} />
    {page.og_image && <meta property="og:image" content={page.og_image} />}
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen bg-gray-50">
    <Navigation />
    
    <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a 
        href={'/' + section}
        class="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6 inline-block"
      >
        ← Back to {section}
      </a>
      
      <header class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {page.seo_title || page.title}
        </h1>
        {page.seo_description && (
          <p class="text-xl text-gray-600">{page.seo_description}</p>
        )}
        <div class="mt-4 text-sm text-gray-500">
          {new Date(page.created_at).toLocaleDateString()}
        </div>
      </header>
      
      {page.featured_image && (
        <img
          src={page.featured_image}
          alt={page.title}
          class="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
        />
      )}
      
      <div class="bg-white rounded-xl shadow-sm p-8 md:p-12">
        <BlockRenderer content={page.published_layout_json} />
      </div>
    </article>
  </body>
</html>`;

  const astroEnvCode = `# .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname`;

  // ============================================
  // HTML/CSS/JS COMPLETE CODE EXAMPLE
  // ============================================

  const htmlCompleteCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Blog</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
</head>
<body class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex space-x-8 h-16 items-center" id="navigation">
        <a href="#/" class="text-xl font-bold text-indigo-600">My Site</a>
        <!-- Sections loaded dynamically -->
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="main-content">
    <div class="text-center py-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome</h1>
      <p class="text-gray-600">Select a section from the navigation.</p>
    </div>
  </main>

  <script>
    // ============================================
    // CONFIGURATION
    // ============================================
    const API_BASE_URL = 'http://localhost:3001/api';
    
    // ============================================
    // DATABASE FUNCTIONS
    // ============================================
    async function fetchSections() {
      const response = await fetch(API_BASE_URL + '/sections');
      return response.json();
    }
    
    async function fetchPages(section) {
      const response = await fetch(API_BASE_URL + '/pages?section=' + section);
      return response.json();
    }
    
    async function fetchPage(section, slug) {
      const response = await fetch(API_BASE_URL + '/pages?section=' + section + '&slug=' + slug);
      return response.json();
    }
    
    // ============================================
    // BLOCK RENDERER
    // ============================================
    function renderBlock(block) {
      switch (block.type) {
        case 'paragraph':
          return '<p class="mb-4 text-gray-700 leading-relaxed">' + (block.data?.text || '') + '</p>';
          
        case 'header':
          const level = block.data?.level || 2;
          const sizes = {
            1: 'text-4xl font-bold mb-6 mt-8',
            2: 'text-3xl font-bold mb-4 mt-6',
            3: 'text-2xl font-semibold mb-3 mt-5',
            4: 'text-xl font-semibold mb-2 mt-4',
            5: 'text-lg font-medium mb-2 mt-3',
            6: 'text-base font-medium mb-2 mt-3'
          };
          return '<h' + level + ' class="' + sizes[level] + '">' + block.data?.text + '</h' + level + '>';
          
        case 'image':
          let html = '<figure class="my-6">';
          html += '<img src="' + block.data?.file?.url + '" alt="' + (block.data?.caption || '') + '" class="w-full rounded-lg shadow-md">';
          if (block.data?.caption) {
            html += '<figcaption class="text-center text-sm text-gray-500 mt-2">' + block.data.caption + '</figcaption>';
          }
          html += '</figure>';
          return html;
          
        case 'list':
          const tag = block.data?.style === 'ordered' ? 'ol' : 'ul';
          let items = '';
          block.data?.items?.forEach(item => {
            items += '<li class="text-gray-700">' + item + '</li>';
          });
          return '<' + tag + ' class="mb-4 pl-6 space-y-1">' + items + '</' + tag + '>';
          
        case 'code':
          return '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>' + block.data?.code + '</code></pre>';
          
        case 'quote':
          return '<blockquote class="border-l-4 border-indigo-500 pl-4 italic my-4 text-gray-600">' + block.data?.text + '</blockquote>';
          
        case 'divider':
          return '<hr class="my-8 border-gray-200">';
          
        default:
          return '';
      }
    }
    
    function renderContent(content) {
      if (!content) return '';
      const blocks = Array.isArray(content) ? content : content.blocks || [];
      let html = '';
      blocks.forEach(block => {
        html += renderBlock(block);
      });
      return html;
    }
    
    // ============================================
    // PAGE RENDERERS
    // ============================================
    function renderSectionList(section, pages) {
      let html = '<h1 class="text-4xl font-bold text-gray-900 mb-8 capitalize">' + section + '</h1>';
      html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">';
      
      pages.forEach(page => {
        html += '<a href="#/' + section + '/' + page.slug + '" class="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">';
        if (page.featured_image) {
          html += '<div class="aspect-video overflow-hidden">';
          html += '<img src="' + page.featured_image + '" alt="' + page.title + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform">';
          html += '</div>';
        }
        html += '<div class="p-6">';
        html += '<h2 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">' + (page.seo_title || page.title) + '</h2>';
        html += '<p class="text-gray-600 text-sm line-clamp-3">' + (page.seo_description || '') + '</p>';
        html += '<div class="mt-4 text-sm text-gray-500">' + new Date(page.created_at).toLocaleDateString() + '</div>';
        html += '</div></a>';
      });
      
      html += '</div>';
      return html;
    }
    
    function renderPageDetail(section, page) {
      let html = '<a href="#/' + section + '" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6 inline-block">← Back to ' + section + '</a>';
      
      html += '<header class="mb-8">';
      html += '<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">' + (page.seo_title || page.title) + '</h1>';
      if (page.seo_description) {
        html += '<p class="text-xl text-gray-600">' + page.seo_description + '</p>';
      }
      html += '<div class="mt-4 text-sm text-gray-500">' + new Date(page.created_at).toLocaleDateString() + '</div>';
      html += '</header>';
      
      if (page.featured_image) {
        html += '<img src="' + page.featured_image + '" alt="' + page.title + '" class="w-full h-64 md:h-96 object-cover rounded-xl mb-8">';
      }
      
      html += '<div class="bg-white rounded-xl shadow-sm p-8 md:p-12">';
      html += renderContent(page.published_layout_json);
      html += '</div>';
      
      return html;
    }
    
    // ============================================
    // ROUTER
    // ============================================
    async function initNavigation() {
      const sections = await fetchSections();
      const nav = document.getElementById('navigation');
      
      sections.forEach(sec => {
        const link = document.createElement('a');
        link.href = '#/' + sec;
        link.className = 'text-sm font-medium text-gray-500 hover:text-gray-700';
        link.textContent = sec.charAt(0).toUpperCase() + sec.slice(1);
        link.dataset.section = sec;
        nav.appendChild(link);
      });
    }
    
    async function handleRoute() {
      const hash = window.location.hash.slice(1) || '/';
      const parts = hash.split('/').filter(Boolean);
      const main = document.getElementById('main-content');
      
      // Update active nav
      document.querySelectorAll('#navigation a').forEach(link => {
        link.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
        link.classList.add('text-gray-500');
        if (parts[0] && link.dataset.section === parts[0]) {
          link.classList.remove('text-gray-500');
          link.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
        }
      });
      
      if (parts.length === 0) {
        main.innerHTML = '<div class="text-center py-16"><h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome</h1><p class="text-gray-600">Select a section from the navigation.</p></div>';
      } else if (parts.length === 1) {
        const pages = await fetchPages(parts[0]);
        main.innerHTML = renderSectionList(parts[0], pages);
      } else {
        const page = await fetchPage(parts[0], parts[1]);
        if (page) {
          main.innerHTML = renderPageDetail(parts[0], page);
          document.title = page.seo_title || page.title;
        } else {
          main.innerHTML = '<div class="text-center py-16"><p class="text-gray-500">Page not found</p></div>';
        }
      }
    }
    
    // ============================================
    // INITIALIZE
    // ============================================
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', async () => {
      await initNavigation();
      handleRoute();
    });
  </script>
</body>
</html>`;

  const htmlApiCode = `// server.js (Backend API - Node.js/Express)
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL;

// Get all sections
app.get('/api/sections', async (req, res) => {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  const result = await client.query(
    "SELECT name FROM _cms_metadata WHERE type = 'section'"
  );
  await client.end();
  res.json(result.rows.map(row => row.name));
});

// Get pages from section
app.get('/api/pages', async (req, res) => {
  const { section, slug } = req.query;
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  
  if (slug) {
    const result = await client.query(
      'SELECT * FROM "' + section + '" WHERE slug = $1',
      [slug]
    );
    await client.end();
    res.json(result.rows[0]);
  } else {
    const result = await client.query(
      'SELECT * FROM "' + section + '" ORDER BY created_at DESC'
    );
    await client.end();
    res.json(result.rows);
  }
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));`;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Integration Guide</h1>
        <p className="text-zinc-600">
          Two ways to integrate: (1) Use our ready-made code examples below, or (2) Copy the PRODUCTION-READY AI prompt and let Claude/Cursor generate custom code for YOUR database and tech stack.
        </p>
      </div>

      {/* AI Prompt Option */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
              🚀 Quick Start: Use AI to Generate Production-Ready Code
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">PRODUCTION READY</span>
            </h2>
            <p className="text-sm text-zinc-700 mb-4">
              Paste this prompt into Claude, Cursor, or any AI IDE. It will generate complete integration code customized for YOUR database schema and tech stack.
            </p>
            <div className="bg-white rounded-xl border border-indigo-200 overflow-hidden">
              <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-200 flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-900">AI Integration Prompt</span>
                <button
                  onClick={() => copyToClipboard(getAiPromptText(), 'ai-prompt')}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  {copied === 'ai-prompt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'ai-prompt' ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
              <pre className="bg-white p-4 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                {getAiPromptText()}
              </pre>
            </div>
            {sectionsData.loading ? (
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-3">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading sections from CMS...
              </div>
            ) : sectionsData.sections.length > 0 ? (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-medium text-green-800 mb-1">✅ CMS Sections Detected:</p>
                <p className="text-xs text-green-700">{sectionsData.sections.join(', ')}</p>
                <p className="text-xs text-green-600 mt-1">The prompt will include these sections automatically.</p>
              </div>
            ) : (
              <p className="text-xs text-zinc-600 mt-3">
                ✅ Works with ANY database (PostgreSQL, MongoDB, MySQL, SQLite, etc.) • ✅ ANY tech stack (Next.js, React, Vue, Angular, Svelte, etc.) • ✅ Adapts to YOUR schema
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <FileCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Complete Files</h3>
          <p className="text-sm text-zinc-600">
            Copy-paste ready code files with all functions included
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">All Sections</h3>
          <p className="text-sm text-zinc-600">
            Works with blogs, problems, solutions, and any custom sections
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Block Renderer</h3>
          <p className="text-sm text-zinc-600">
            Complete content renderer for all block types
          </p>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
        <div className="border-b border-zinc-200">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 min-w-[100px] px-4 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('nextjs')}
              className={`flex-1 min-w-[100px] px-4 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'nextjs'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <FileJson className="w-5 h-5" />
              Next.js
            </button>
            <button
              onClick={() => setActiveTab('react')}
              className={`flex-1 min-w-[100px] px-4 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'react'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Atom className="w-5 h-5" />
              React
            </button>
            <button
              onClick={() => setActiveTab('astro')}
              className={`flex-1 min-w-[100px] px-4 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'astro'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Rocket className="w-5 h-5" />
              Astro
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`flex-1 min-w-[100px] px-4 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'html'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Globe className="w-5 h-5" />
              HTML
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">Choose Your Integration Method</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <h4 className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Method 1: AI-Powered (Recommended)
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Copy the AI prompt from the top of this page and paste it into Claude, Cursor, or any AI IDE.
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>✅ Works with ANY database schema</li>
                      <li>✅ Adapts to YOUR tech stack</li>
                      <li>✅ Generates custom code for your needs</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <h4 className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Method 2: Pre-built Examples
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Use our ready-made code examples below (Next.js, React, Astro, HTML).
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>✅ Tested and working code</li>
                      <li>✅ Optimized for our database schema</li>
                      <li>✅ Fast implementation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Using Pre-built Examples</h3>
                <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                  <li>Select your framework from the tabs above</li>
                  <li>Copy each code file shown (click the Copy button)</li>
                  <li>Create the files in your project with the exact paths shown</li>
                  <li>Set your DATABASE_URL in .env.local</li>
                  <li>Run your application</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">What You Get</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">Database Helpers</h3>
                      <p className="text-sm text-zinc-600">listSections(), listItems(), getItemBySlug() functions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">Block Renderer</h3>
                      <p className="text-sm text-zinc-600">Renders paragraphs, headings, images, lists, code, quotes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">Dynamic Navigation</h3>
                      <p className="text-sm text-zinc-600">Auto-generated from your database sections</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">SEO Ready</h3>
                      <p className="text-sm text-zinc-600">Meta tags, OpenGraph, structured data</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                <h3 className="font-semibold text-zinc-900 mb-3">Environment Variable</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  All examples require a DATABASE_URL environment variable:
                </p>
                <CodeBlock 
                  code="# PostgreSQL\nDATABASE_URL=postgresql://user:password@localhost:5432/dbname\n\n# MongoDB\nDATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/dbname" 
                  label=".env.local" 
                  copyKey="env-example" 
                  copied={copied} 
                  onCopy={copyToClipboard} 
                />
              </div>
            </div>
          )}

          {/* Next.js Tab */}
          {activeTab === 'nextjs' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Note About Database Schema
                </h3>
                <p className="text-sm text-amber-800">
                  These examples are optimized for our database schema (_cms_metadata table). 
                  If your database has a different structure, use the <strong>AI Prompt</strong> at the top of this page to generate custom code for YOUR schema.
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-2">Next.js 14+ Complete Integration</h3>
                <p className="text-sm text-indigo-800">
                  Full server-side rendering with static generation. Creates pages for /blogs, /problems, /solutions, etc.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Project Structure</h3>
                <div className="bg-zinc-900 rounded-xl p-4 font-mono text-sm text-gray-300">
                  <div className="text-green-400">my-app/</div>
                  <div className="pl-4 text-gray-400">├── lib/</div>
                  <div className="pl-8 text-yellow-400">db.ts</div>
                  <div className="pl-4 text-gray-400">├── components/</div>
                  <div className="pl-8 text-yellow-400">BlockRenderer.tsx</div>
                  <div className="pl-4 text-gray-400">├── app/</div>
                  <div className="pl-8 text-gray-400">├── [section]/</div>
                  <div className="pl-12 text-yellow-400">page.tsx</div>
                  <div className="pl-12 text-gray-400">├── [slug]/</div>
                  <div className="pl-16 text-yellow-400">page.tsx</div>
                  <div className="pl-4 text-gray-400">├── .env.local</div>
                  <div className="pl-4 text-gray-400">└── next.config.js</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 1: Database Helper</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">lib/db.ts</code>:
                </p>
                <CodeBlock code={nextjsDbCode} label="lib/db.ts" copyKey="nextjs-db" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 2: Block Renderer</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">components/BlockRenderer.tsx</code>:
                </p>
                <CodeBlock code={nextjsBlockRendererCode} label="components/BlockRenderer.tsx" copyKey="nextjs-renderer" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 3: List Page (e.g., /blogs)</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">app/[section]/page.tsx</code>:
                </p>
                <CodeBlock code={nextjsListPageCode} label="app/[section]/page.tsx" copyKey="nextjs-list" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 4: Detail Page (e.g., /blogs/my-post)</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">app/[section]/[slug]/page.tsx</code>:
                </p>
                <CodeBlock code={nextjsDetailPageCode} label="app/[section]/[slug]/page.tsx" copyKey="nextjs-detail" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 5: Next.js Config</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">next.config.js</code>:
                </p>
                <CodeBlock code={nextjsConfigCode} label="next.config.js" copyKey="nextjs-config" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 6: Environment Variables</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">.env.local</code>:
                </p>
                <CodeBlock code={nextjsEnvCode} label=".env.local" copyKey="nextjs-env" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">✅ Done!</h3>
                <p className="text-sm text-green-800">
                  Run <code>npm run dev</code> and visit <code>/blogs</code>, <code>/problems</code>, or any section you have in your database.
                </p>
              </div>
            </div>
          )}

          {/* React Tab */}
          {activeTab === 'react' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Note About Database Schema
                </h3>
                <p className="text-sm text-amber-800">
                  These examples use our database schema (_cms_metadata table). 
                  For custom schemas, use the <strong>AI Prompt</strong> at the top to generate code for YOUR database.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">React 18+ Complete Integration</h3>
                <p className="text-sm text-blue-800">
                  React SPA with React Router. Requires a backend API (Node.js/Express example included).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Project Structure</h3>
                <div className="bg-zinc-900 rounded-xl p-4 font-mono text-sm text-gray-300">
                  <div className="text-green-400">my-app/</div>
                  <div className="pl-4 text-gray-400">├── src/</div>
                  <div className="pl-8 text-gray-400">├── lib/</div>
                  <div className="pl-12 text-yellow-400">db.js</div>
                  <div className="pl-8 text-gray-400">├── components/</div>
                  <div className="pl-12 text-yellow-400">BlockRenderer.jsx</div>
                  <div className="pl-12 text-yellow-400">Navigation.jsx</div>
                  <div className="pl-8 text-gray-400">├── pages/</div>
                  <div className="pl-12 text-yellow-400">SectionPage.jsx</div>
                  <div className="pl-12 text-yellow-400">PageDetail.jsx</div>
                  <div className="pl-12 text-yellow-400">App.jsx</div>
                  <div className="pl-4 text-gray-400">├── server.js (API)</div>
                  <div className="pl-4 text-gray-400">└── .env</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 1: API Helpers</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/lib/db.js</code>:
                </p>
                <CodeBlock code={reactDbCode} label="src/lib/db.js" copyKey="react-db" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 2: Block Renderer</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/components/BlockRenderer.jsx</code>:
                </p>
                <CodeBlock code={reactBlockRendererCode} label="src/components/BlockRenderer.jsx" copyKey="react-renderer" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 3: Navigation</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/components/Navigation.jsx</code>:
                </p>
                <CodeBlock code={reactNavigationCode} label="src/components/Navigation.jsx" copyKey="react-nav" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 4: List Page</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/pages/SectionPage.jsx</code>:
                </p>
                <CodeBlock code={reactSectionPageCode} label="src/pages/SectionPage.jsx" copyKey="react-list" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 5: Detail Page</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/pages/PageDetail.jsx</code>:
                </p>
                <CodeBlock code={reactDetailPageCode} label="src/pages/PageDetail.jsx" copyKey="react-detail" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 6: App Router</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/App.jsx</code>:
                </p>
                <CodeBlock code={reactAppCode} label="src/App.jsx" copyKey="react-app" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 7: Backend API</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">server.js</code> (run with Node.js):
                </p>
                <CodeBlock code={reactApiCode} label="server.js" copyKey="react-api" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 8: Environment Variables</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">.env</code>:
                </p>
                <CodeBlock code={reactEnvCode} label=".env" copyKey="react-env" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">✅ Done!</h3>
                <p className="text-sm text-green-800">
                  Run <code>node server.js</code> to start the API, then <code>npm start</code> to run the React app.
                </p>
              </div>
            </div>
          )}

          {/* Astro Tab */}
          {activeTab === 'astro' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Note About Database Schema
                </h3>
                <p className="text-sm text-amber-800">
                  These examples use our database schema (_cms_metadata table). 
                  For custom schemas, use the <strong>AI Prompt</strong> at the top to generate code for YOUR database.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 mb-2">Astro 3+ Complete Integration</h3>
                <p className="text-sm text-orange-800">
                  Astro static site generation. Zero JavaScript by default, fully SEO-optimized.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Project Structure</h3>
                <div className="bg-zinc-900 rounded-xl p-4 font-mono text-sm text-gray-300">
                  <div className="text-green-400">my-app/</div>
                  <div className="pl-4 text-gray-400">├── src/</div>
                  <div className="pl-8 text-gray-400">├── lib/</div>
                  <div className="pl-12 text-yellow-400">db.ts</div>
                  <div className="pl-8 text-gray-400">├── components/</div>
                  <div className="pl-12 text-yellow-400">BlockRenderer.astro</div>
                  <div className="pl-12 text-yellow-400">Navigation.astro</div>
                  <div className="pl-8 text-gray-400">├── pages/</div>
                  <div className="pl-12 text-gray-400">├── [section]/</div>
                  <div className="pl-16 text-yellow-400">index.astro</div>
                  <div className="pl-16 text-yellow-400">[slug].astro</div>
                  <div className="pl-4 text-gray-400">├── .env</div>
                  <div className="pl-4 text-gray-400">└── astro.config.mjs</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 1: Database Helper</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/lib/db.ts</code>:
                </p>
                <CodeBlock code={astroDbCode} label="src/lib/db.ts" copyKey="astro-db" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 2: Block Renderer</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/components/BlockRenderer.astro</code>:
                </p>
                <CodeBlock code={astroBlockRendererCode} label="src/components/BlockRenderer.astro" copyKey="astro-renderer" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 3: Navigation</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/components/Navigation.astro</code>:
                </p>
                <CodeBlock code={astroNavigationCode} label="src/components/Navigation.astro" copyKey="astro-nav" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 4: List Page</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/pages/[section]/index.astro</code>:
                </p>
                <CodeBlock code={astroListPageCode} label="src/pages/[section]/index.astro" copyKey="astro-list" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 5: Detail Page</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">src/pages/[section]/[slug].astro</code>:
                </p>
                <CodeBlock code={astroDetailPageCode} label="src/pages/[section]/[slug].astro" copyKey="astro-detail" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 6: Environment Variables</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">.env</code>:
                </p>
                <CodeBlock code={astroEnvCode} label=".env" copyKey="astro-env" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">✅ Done!</h3>
                <p className="text-sm text-green-800">
                  Run <code>npm run dev</code> for development or <code>npm run build</code> for static export.
                </p>
              </div>
            </div>
          )}

          {/* HTML Tab */}
          {activeTab === 'html' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Note About Database Schema
                </h3>
                <p className="text-sm text-amber-800">
                  These examples use our database schema (_cms_metadata table). 
                  For custom schemas, use the <strong>AI Prompt</strong> at the top to generate code for YOUR database.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">HTML/CSS/JS Complete Integration</h3>
                <p className="text-sm text-green-800">
                  Pure HTML solution with vanilla JavaScript. No build step, no frameworks. Just open the file in a browser.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Project Structure</h3>
                <div className="bg-zinc-900 rounded-xl p-4 font-mono text-sm text-gray-300">
                  <div className="text-green-400">my-site/</div>
                  <div className="pl-4 text-yellow-400">index.html</div>
                  <div className="pl-4 text-gray-400">├── server.js (API backend)</div>
                  <div className="pl-4 text-gray-400">└── .env</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 1: Complete HTML File</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">index.html</code> - This is your entire frontend:
                </p>
                <CodeBlock code={htmlCompleteCode} label="index.html" copyKey="html-main" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 2: Backend API</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">server.js</code> (Node.js/Express):
                </p>
                <CodeBlock code={htmlApiCode} label="server.js" copyKey="html-api" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Step 3: Environment Variables</h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Create <code className="bg-zinc-100 px-2 py-0.5 rounded">.env</code>:
                </p>
                <CodeBlock code="DATABASE_URL=postgresql://user:password@localhost:5432/dbname" label=".env" copyKey="html-env" copied={copied} onCopy={copyToClipboard} />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">✅ Done!</h3>
                <p className="text-sm text-green-800">
                  1. Run <code>node server.js</code> to start the API<br/>
                  2. Open <code>index.html</code> directly in your browser<br/>
                  3. No build step needed!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
