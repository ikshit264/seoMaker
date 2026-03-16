import { getPage, generateMetadata, generateStructuredData } from '@/lib/seo-maker';
import { PageRenderer } from '@/components/SeoMaker/PageRenderer';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

// Generate SEO metadata for this post
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getPage('blogs', slug);
  
  if (!page) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return generateMetadata(page);
}

// Optional: Generate static paths for all blog posts (SSG)
export async function generateStaticParams() {
  // You would fetch all posts here and return their slugs
  // For now, returning empty array - implement based on your needs
  return [];
}

export default async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getPage('blogs', slug);

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Post Not Found</h1>
        <p className="text-zinc-600 mb-6">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/blogs"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Return to Blog →
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-zinc-600 hover:text-indigo-600 mb-8 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Posts
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-4 leading-tight">
          {page.seo_title || page.title}
        </h1>
        
        {page.seo_description && (
          <p className="text-xl text-zinc-600 leading-relaxed">
            {page.seo_description}
          </p>
        )}
        
        <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500 flex-wrap">
          <time dateTime={page.createdAt.toISOString()}>
            {new Date(page.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          
          {page.seo_keywords && (
            <div className="flex gap-2 flex-wrap">
              {page.seo_keywords.split(',').map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {page.featured_image && (
        <figure className="mb-8">
          <img
            src={page.featured_image}
            alt={page.seo_title || page.title}
            className="w-full rounded-2xl shadow-lg"
          />
        </figure>
      )}

      {/* Article Content - Rendered using your block editor components */}
      <div className="prose prose-lg max-w-none">
        <PageRenderer content={page.published_layout_json} />
      </div>

      {/* Structured Data for SEO (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData(page, 'https://your-domain.com')
          )
        }}
      />
    </article>
  );
}
