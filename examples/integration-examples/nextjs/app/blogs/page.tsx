/**
 * Example Blog List Page - Next.js App Router
 * 
 * This demonstrates how to use fetchAllArticles() function
 * to display a list of blog posts with SSR.
 * 
 * Location: app/blogs/page.tsx
 */

import { fetchAllArticles } from '@/lib/seo-maker-integration';
import { ArticleGrid } from '@/components/SeoMaker/ArticleCard';

export default async function BlogsPage() {
  // Function 1: Fetch all articles (basic data)
  const articles = await fetchAllArticles('blogs');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-zinc-900 mb-4">
          Blog Posts
        </h1>
        <p className="text-xl text-zinc-600">
          Latest articles, tutorials, and insights
        </p>
      </header>

      {/* Article Grid - Uses the UI component */}
      <ArticleGrid 
        articles={articles}
        baseUrl="/blogs"
        emptyMessage="No blog posts found yet."
      />
    </div>
  );
}

/**
 * Optional: Add pagination
 * 
 * import { fetchAllArticles } from '@/lib/seo-maker-integration';
 * 
 * export default async function BlogsPage({ 
 *   searchParams 
 * }: { 
 *   searchParams: Promise<{ page?: string }> 
 * }) {
 *   const page = Number((await searchParams).page) || 1;
 *   const limit = 9;
 *   
 *   const articles = await fetchAllArticles('blogs');
 *   const totalPages = Math.ceil(articles.length / limit);
 *   const paginatedArticles = articles.slice(
 *     (page - 1) * limit,
 *     page * limit
 *   );
 *   
 *   return (
 *     <div>
 *       <ArticleGrid articles={paginatedArticles} baseUrl="/blogs" />
 *       
 *       {/* Pagination Controls *}/}
 *       <div className="flex justify-center gap-2 mt-8">
 *         {page > 1 && (
 *           <Link href="/blogs?page={page - 1}">Previous</Link>
 *         )}
 *         <span>Page {page} of {totalPages}</span>
 *         {page < totalPages && (
 *           <Link href="/blogs?page={page + 1}">Next</Link>
 *         )}
 *       </div>
 *     </div>
 *   );
 * }
 */
