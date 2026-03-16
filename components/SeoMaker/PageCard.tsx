import Link from 'next/link';

interface PageCardProps {
  page: {
    title: string;
    slug: string;
    seo_title?: string | null;
    seo_description?: string | null;
    featured_image?: string | null;
    createdAt: Date;
  };
  baseUrl: string; // e.g., '/blogs'
  className?: string; // Optional custom className for styling
}

/**
 * PageCard Component
 * 
 * A beautiful, SEO-friendly card component for displaying page previews.
 * Works with any section type (blogs, problems, solutions, etc.)
 * 
 * @param page - The page data to display
 * @param baseUrl - The base URL for the page link (e.g., '/blogs')
 * @param className - Optional custom CSS classes
 */
export function PageCard({ page, baseUrl, className = '' }: PageCardProps) {
  const href = `${baseUrl}/${page.slug}`;
  
  return (
    <article className={`bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden ${className}`}>
      {page.featured_image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={page.featured_image}
            alt={page.seo_title || page.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-2">
          {page.seo_title || page.title}
        </h3>
        
        <p className="text-zinc-600 mb-4 line-clamp-3">
          {page.seo_description}
        </p>
        
        <div className="flex items-center justify-between">
          <time className="text-sm text-zinc-500">
            {new Date(page.createdAt).toLocaleDateString('en-US', {
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
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
