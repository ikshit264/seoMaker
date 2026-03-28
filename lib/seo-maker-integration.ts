/**
 * SEO Maker Integration Functions
 * 
 * Use these functions to fetch and render blog posts directly from your database.
 * No SDKs, no external APIs - just direct database access.
 */

import { listItems, getItem } from './db';

const dbUrl = process.env.DATABASE_URL!;

if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

/**
 * Function 1: Fetch All Articles (Basic Data)
 * 
 * Fetches basic information for all articles in a section.
 * Use this on your /blogs or /articles list page.
 * 
 * @param section - The collection/section name (e.g., 'blogs', 'posts', 'articles')
 * @returns Array of article basic data
 * 
 * @example
 * // In your /blogs/page.tsx
 * const articles = await fetchAllArticles('blogs');
 * 
 * articles.forEach(article => {
 *   console.log(article.title);
 *   console.log(article.slug);
 *   console.log(article.createdAt);
 * });
 */
export async function fetchAllArticles(section: string) {
  try {
    const articles = await listItems(dbUrl, section);
    
    // Return only basic data needed for list views
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
  } catch (error) {
    console.error(`Error fetching articles from "${section}":`, error);
    throw new Error(`Failed to fetch articles: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Function 2: Fetch Single Article (Full Content)
 * 
 * Fetches complete article data including content.
 * Use this on your /blogs/[slug]/page.tsx detail page.
 * 
 * @param section - The collection/section name (e.g., 'blogs', 'posts', 'articles')
 * @param slug - The article slug (unique identifier)
 * @returns Complete article object with full content, or null if not found
 * 
 * @example
 * // In your /blogs/[slug]/page.tsx
 * const article = await fetchArticle('blogs', 'my-first-post');
 * 
 * if (article) {
 *   console.log(article.title);
 *   console.log(article.draft_layout_json); // Full content
 * }
 */
export async function fetchArticle(section: string, slug: string) {
  try {
    const article = await getItem(dbUrl, section, slug);
    
    if (!article) {
      return null;
    }
    
    // Return complete article data
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
      twitter_title: article.twitter_title,
      twitter_description: article.twitter_description,
      twitter_image: article.twitter_image,
      featured_image: article.featured_image,
      draft_layout_json: article.draft_layout_json,
      published_layout_json: article.published_layout_json,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  } catch (error) {
    console.error(`Error fetching article "${slug}" from "${section}":`, error);
    throw new Error(`Failed to fetch article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

type FetchArticleResult = Awaited<ReturnType<typeof fetchArticle>>;

function toIsoString(value: Date | string | null | undefined) {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * Helper: Generate SEO Metadata
 * 
 * Automatically generates Next.js metadata object from article data.
 * 
 * @param article - The article object from fetchArticle()
 * @returns Next.js metadata object
 * 
 * @example
 * // In your /blogs/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   const article = await fetchArticle('blogs', params.slug);
 *   return generateSeoMetadata(article);
 * }
 */
export function generateSeoMetadata(article: FetchArticleResult) {
  if (!article) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: article.seo_title || article.title,
    description: article.seo_description,
    keywords: article.seo_keywords?.split(',').map((k: string) => k.trim()),
    openGraph: {
      title: article.og_title || article.seo_title || article.title,
      description: article.og_description || article.seo_description,
      images: article.og_image || article.featured_image ? [{ url: article.og_image || article.featured_image! }] : undefined,
      type: 'article' as const,
      publishedTime: toIsoString(article.createdAt),
      modifiedTime: toIsoString(article.updatedAt),
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: article.og_title || article.seo_title || article.title,
      description: article.og_description || article.seo_description,
      images: article.og_image || article.featured_image ? [article.og_image || article.featured_image!] : undefined,
    },
  };
}

/**
 * Helper: Generate Structured Data (JSON-LD)
 * 
 * Creates schema.org structured data for rich search results.
 * 
 * @param article - The article object from fetchArticle()
 * @param siteUrl - Your website's base URL (e.g., 'https://yoursite.com')
 * @returns Structured data object for JSON-LD script
 * 
 * @example
 * // In your /blogs/[slug]/page.tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{
 *     __html: JSON.stringify(generateStructuredData(article, 'https://yoursite.com'))
 *   }}
 * />
 */
export function generateStructuredData(article: NonNullable<FetchArticleResult>, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.seo_title || article.title,
    "description": article.seo_description,
    "image": article.featured_image ? `${siteUrl}${article.featured_image}` : undefined,
    "datePublished": toIsoString(article.createdAt),
    "dateModified": toIsoString(article.updatedAt),
    "author": {
      "@type": "Organization",
      "name": "Your Company",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Company",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
      },
    },
  };
}
