import { getPages } from '@/lib/seo-maker';
import { PageCard } from '@/components/SeoMaker/PageCard';

export default async function BlogsPage() {
  // Fetch all blog posts directly from your database
  const pages = await getPages('blogs');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-zinc-900 mb-4">
          Blog Posts
        </h1>
        <p className="text-xl text-zinc-600">
          Latest articles, tutorials, and insights
        </p>
      </header>

      {/* Empty State */}
      {pages.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-zinc-200">
          <p className="text-zinc-500 text-lg">No posts found yet.</p>
          <p className="text-zinc-400 mt-2">Create your first post in the SEO Maker dashboard!</p>
        </div>
      ) : (
        /* Blog Grid */
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
}
