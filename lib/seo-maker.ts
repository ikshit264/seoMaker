import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
// Users should already have this in their project
const prisma = new PrismaClient();

export interface SeoMakerPage {
  id: string;
  title: string;
  slug: string;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  featured_image?: string | null;
  published_layout_json?: any;
  createdAt: Date;
  updatedAt: Date;
  // Allow additional custom fields
  [key: string]: any;
}

/**
 * Fetch all pages for a specific section (e.g., 'blogs', 'problems', 'solutions')
 * @param section - The collection/table name to fetch pages from
 * @returns Array of pages ordered by creation date (newest first)
 */
export async function getPages(section: string): Promise<SeoMakerPage[]> {
  try {
    // Use raw command to query the section-specific collection
    const result = await prisma.$runCommandRaw({
      find: section,
      sort: { createdAt: -1 }
    }) as any;
    
    const pages = result?.cursor?.firstBatch || [];
    
    // Map _id to id for consistency
    return pages.map((page: any) => ({
      ...page,
      id: page._id?.$oid || page._id || page.id
    }));
  } catch (error) {
    console.error(`Error fetching pages for section "${section}":`, error);
    throw new Error(`Failed to fetch pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch a single page by its slug
 * @param section - The collection/table name (e.g., 'blogs')
 * @param slug - The unique slug of the page
 * @returns The page or null if not found
 */
export async function getPage(section: string, slug: string): Promise<SeoMakerPage | null> {
  try {
    // Use raw command to query the section-specific collection
    const result = await prisma.$runCommandRaw({
      find: section,
      filter: { slug: slug },
      limit: 1
    }) as any;
    
    const pages = result?.cursor?.firstBatch || [];
    const page = pages[0] || null;
    
    if (page) {
      return {
        ...page,
        id: page._id?.$oid || page._id || page.id
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching page "${slug}" from section "${section}":`, error);
    throw new Error(`Failed to fetch page: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate SEO metadata from a page
 * Use this in Next.js's generateMetadata() function
 * 
 * @param page - The page to generate metadata for
 * @returns Metadata object compatible with Next.js App Router
 */
export function generateMetadata(page: SeoMakerPage) {
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || undefined,
    keywords: page.seo_keywords ? page.seo_keywords.split(',').map(k => k.trim()) : undefined,
    openGraph: {
      title: page.og_title || page.seo_title || page.title,
      description: page.og_description || page.seo_description || undefined,
      images: page.og_image || page.featured_image ? [{ url: page.og_image || page.featured_image! }] : undefined,
      type: 'article' as const,
      publishedTime: page.createdAt.toISOString(),
      modifiedTime: page.updatedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: page.og_title || page.seo_title || page.title,
      description: page.og_description || page.seo_description || undefined,
      images: page.og_image || page.featured_image ? [page.og_image || page.featured_image!] : undefined,
    }
  };
}

/**
 * Generate structured data (JSON-LD) for rich snippets in search engines
 * Add this to your page as a <script type="application/ld+json"> tag
 * 
 * @param page - The page to generate structured data for
 * @param section - The collection/table name (e.g., 'blogs')
 * @param siteUrl - Your website's base URL (e.g., 'https://example.com')
 * @returns JSON-LD structured data object
 */
export function generateStructuredData(page: SeoMakerPage, section: string, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": page.seo_title || page.title,
    "description": page.seo_description,
    "image": page.featured_image ? `${siteUrl}${page.featured_image}` : undefined,
    "datePublished": page.createdAt.toISOString(),
    "dateModified": page.updatedAt.toISOString(),
    "url": `${siteUrl}/${section}/${page.slug}`,
    "author": {
      "@type": "Organization",
      "name": siteUrl.replace(/^https?:\/\//, '').split('/')[0]
    },
    "keywords": page.seo_keywords ? page.seo_keywords.split(',') : undefined
  };
}

/**
 * Get pages with pagination
 * @param section - The collection/table name
 * @param limit - Number of pages per page (default: 10)
 * @param skip - Number of pages to skip (default: 0)
 * @returns Object with pages and total count
 */
export async function getPagesWithPagination(
  section: string, 
  limit: number = 10, 
  skip: number = 0
): Promise<{ pages: SeoMakerPage[]; total: number }> {
  try {
    // Use raw commands to query the section-specific collection
    const [pagesResult, countResult] = await Promise.all([
      prisma.$runCommandRaw({
        find: section,
        sort: { createdAt: -1 },
        skip: skip,
        limit: limit
      }) as any,
      prisma.$runCommandRaw({
        count: section
      }) as any
    ]);
    
    const pages = (pagesResult?.cursor?.firstBatch || []).map((page: any) => ({
      ...page,
      id: page._id?.$oid || page._id || page.id
    }));
    
    const total = countResult?.n || 0;
    
    return { pages, total };
  } catch (error) {
    console.error(`Error fetching paginated pages for section "${section}":`, error);
    throw new Error(`Failed to fetch pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
