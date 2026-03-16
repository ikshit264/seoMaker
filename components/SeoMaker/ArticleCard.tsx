'use client';

import Link from 'next/link';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    seo_title?: string | null;
    seo_description?: string | null;
    featured_image?: string | null;
    createdAt: Date | string;
  };
  baseUrl: string; // e.g., '/blogs'
  className?: string;
}

/**
 * Article Card Component
 * 
 * Displays a single article preview in a card format.
 * Used in blog list pages.
 */
export function ArticleCard({ article, baseUrl, className = '' }: ArticleCardProps) {
  const href = `${baseUrl}/${article.slug}`;
  
  return (
    <article className={`bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden ${className}`}>
      {article.featured_image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.seo_title || article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-2">
          {article.seo_title || article.title}
        </h3>
        
        <p className="text-zinc-600 mb-4 line-clamp-3">
          {article.seo_description}
        </p>
        
        <div className="flex items-center justify-between">
          <time className="text-sm text-zinc-500">
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          
          <Link
            href={href}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 group"
          >
            Read More
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Article Grid Component
 * 
 * Displays a responsive grid of article cards.
 * Use this on your /blogs page to show all articles.
 */
interface ArticleGridProps {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    seo_title?: string | null;
    seo_description?: string | null;
    featured_image?: string | null;
    createdAt: Date | string;
  }>;
  baseUrl: string;
  emptyMessage?: string;
}

export function ArticleGrid({ articles, baseUrl, emptyMessage = 'No articles found yet.' }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-zinc-200">
        <svg className="w-16 h-16 mx-auto text-zinc-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p className="text-zinc-500 text-lg">{emptyMessage}</p>
        <p className="text-zinc-400 mt-2 text-sm">Create your first article in the SEO Maker dashboard!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id || article.slug}
          article={article}
          baseUrl={baseUrl}
        />
      ))}
    </div>
  );
}
