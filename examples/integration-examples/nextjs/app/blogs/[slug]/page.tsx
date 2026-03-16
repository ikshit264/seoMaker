/**
 * Example Single Blog Post Page - Next.js App Router
 * 
 * This demonstrates how to use fetchArticle() function
 * to display a complete blog post with SSR and full SEO.
 * 
 * Location: app/blogs/[slug]/page.tsx
 */

import { fetchArticle, generateSeoMetadata, generateStructuredData } from '@/lib/seo-maker-integration';
import { ArticleRenderer } from '@/components/SeoMaker/ArticleRenderer';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

/**
 * Generate SEO metadata automatically from article data
 */
export async function generateMetadata({ params }: { params: Params }) {
  const article = await fetchArticle('blogs', (await params).slug);
  return generateSeoMetadata(article);
}

/**
 * Main blog post component with SSR
 */
export default async function BlogPost({ params }: { params: Params }) {
  // Function 2: Fetch single article (full content)
  const article = await fetchArticle('blogs', (await params).slug);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Post Not Found</h1>
        <p className="text-zinc-600 mb-8">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/blogs" 
          className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2"
        >
          ← Back to All Posts
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8">
        <Link 
          href="/blogs" 
          className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2"
        >
          ← Back to All Posts
        </Link>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-zinc-900 mb-6">
          {article.seo_title || article.title}
        </h1>
        
        {article.featured_image && (
          <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg mb-8">
            <img
              src={article.featured_image}
              alt={article.seo_title || article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <time dateTime={article.createdAt.toISOString()}>
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {article.updatedAt !== article.createdAt && (
            <span>• Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
          )}
        </div>
      </header>

      {/* Article Content - Renders all blocks */}
      <div className="prose prose-lg max-w-none">
        <ArticleRenderer content={article.published_layout_json || article.draft_layout_json} />
      </div>

      {/* Structured Data (JSON-LD) for Rich Search Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData(article, 'https://yoursite.com')
          )
        }}
      />
    </article>
  );
}

/**
 * Optional: Enable Static Site Generation (SSG)
 * 
 * export async function generateStaticParams() {
 *   const articles = await fetchAllArticles('blogs');
 *   
 *   return articles.map((article) => ({
 *     slug: article.slug,
 *   }));
 * }
 * 
 * // Add this to enable Incremental Static Regeneration (ISR)
 * export const dynamicParams = true; // or false if using generateStaticParams
 */
