# SEO Maker - AI IDE Integration Prompts

This document contains complete, copy-paste ready prompts for integrating SEO Maker with different frameworks. Simply copy the prompt for your framework and paste it into your AI IDE.

---

## Table of Contents

1. [Next.js Integration](#nextjs-integration)
2. [React Integration](#react-integration)
3. [Astro Integration](#astro-integration)
4. [HTML/CSS/JS Integration](#htmlcssjs-integration)

---

## Next.js Integration

### What This Prompt Creates

- Complete Next.js 14+ App Router application
- Dynamic routing for all sections (blogs, problems, solutions, etc.)
- Database helper functions (PostgreSQL & MongoDB support)
- Block renderer for content (paragraphs, headings, images, lists, code, quotes)
- SEO metadata generation
- Responsive Tailwind CSS styling
- Navigation component with all sections

### Files Created

1. `lib/db.ts` - Database connection and query helpers
2. `components/BlockRenderer.tsx` - Content block renderer
3. `app/[section]/page.tsx` - Section list page
4. `app/[section]/[slug]/page.tsx` - Individual post page
5. `next.config.js` - Static export configuration

### Database Schema Expected

**PostgreSQL:**
- `_cms_metadata` table with columns: `type`, `name`
- Section tables (e.g., `blogs`, `problems`) with columns:
  - `id`, `title`, `slug`, `seo_title`, `seo_description`, `seo_keywords`
  - `featured_image`, `published_layout_json` (JSONB)
  - `created_at`, `updated_at`

**MongoDB:**
- `CmsMetadata` collection with documents: `{ type: 'section', name: 'blogs' }`
- `Page` collection with documents containing the page fields above

### Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
# OR
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### The Prompt

```
Create a complete Next.js 14+ blog application with the following requirements:

1. DATABASE SETUP:
   - Support both PostgreSQL and MongoDB via DATABASE_URL environment variable
   - Create lib/db.ts with functions:
     * listSections(url): Fetch all sections from _cms_metadata where type='section'
     * listItems(url, section): Fetch all pages from a section table
     * getItemBySlug(url, section, slug): Fetch single page by slug
   - For PostgreSQL use 'pg' client
   - Auto-detect DB type from URL

2. BLOCK RENDERER COMPONENT:
   - Create components/BlockRenderer.tsx
   - Support block types: paragraph, header (h1-h6), image, list (ordered/unordered), code, quote, divider
   - Use Tailwind CSS classes for styling
   - Handle published_layout_json format: { blocks: [{ type, data }] }

3. SECTION LIST PAGE:
   - Create app/[section]/page.tsx
   - Generate static params from database sections
   - Fetch and display grid of pages with:
     * Featured image (aspect-video)
     * Title (seo_title or title)
     * Description (seo_description)
     * Creation date
   - Navigation bar showing all sections with active state
   - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop

4. DETAIL PAGE:
   - Create app/[section]/[slug]/page.tsx
   - Generate static params for all pages
   - SEO metadata: title, description, keywords, OpenGraph tags
   - Display:
     * Back link to section
     * Title and description
     * Featured image (full width)
     * BlockRenderer for content
   - 404 handling

5. STYLING:
   - Use Tailwind CSS
   - Color scheme: indigo-600 primary, gray-50 background
   - Typography: prose classes for content
   - Responsive padding and spacing

6. CONFIGURATION:
   - Static export in next.config.js
   - Unoptimized images for static export

DATA STRUCTURE:
- Page object: { id, title, slug, seo_title, seo_description, seo_keywords, featured_image, published_layout_json, created_at }
- published_layout_json: { blocks: [{ type: 'paragraph'|'header'|'image'|'list'|'code'|'quote'|'divider', data: {...} }] }
```

---

## React Integration

### What This Prompt Creates

- Complete React 18+ SPA with React Router
- Client-side data fetching
- API backend integration
- Block renderer component
- Navigation with dynamic sections
- Responsive design

### Files Created

1. `src/lib/db.js` - API fetch helpers
2. `src/components/BlockRenderer.jsx` - Content renderer
3. `src/components/Navigation.jsx` - Dynamic navigation
4. `src/pages/SectionPage.jsx` - Section list view
5. `src/pages/PageDetail.jsx` - Individual post view
6. `src/App.jsx` - Router configuration

### Backend API Required

The React version requires a backend API. The prompt includes example API endpoints using Express.js or Next.js API routes.

### The Prompt

```
Create a complete React 18+ blog application with React Router:

1. PROJECT SETUP:
   - Use Vite or Create React App
   - Install dependencies: react-router-dom, axios
   - Configure Tailwind CSS

2. API HELPERS:
   - Create src/lib/db.js with functions:
     * fetchSections(): GET /api/sections
     * fetchPages(section): GET /api/pages?section={section}
     * fetchPage(section, slug): GET /api/pages?section={section}&slug={slug}

3. BLOCK RENDERER:
   - Create src/components/BlockRenderer.jsx
   - Support: paragraph, header (h1-h6), image, list, code, quote, divider
   - Tailwind CSS styling
   - Props: { content } where content = { blocks: [...] }

4. NAVIGATION:
   - Create src/components/Navigation.jsx
   - Fetch sections on mount
   - Display horizontal nav with all sections
   - Highlight active section based on URL
   - Use React Router's useLocation

5. SECTION LIST PAGE:
   - Create src/pages/SectionPage.jsx
   - Use useParams to get section name
   - Fetch pages on section change
   - Display loading state
   - Grid layout with cards (image, title, description, date)
   - Link to detail pages

6. DETAIL PAGE:
   - Create src/pages/PageDetail.jsx
   - Use useParams for section and slug
   - Fetch page data
   - Show back link, title, description, featured image
   - Render content with BlockRenderer
   - Handle 404 state

7. ROUTER SETUP:
   - Create src/App.jsx
   - Routes: /, /:section, /:section/:slug
   - Include Navigation component
   - Use BrowserRouter

8. API ENDPOINTS (for backend):
   - GET /api/sections: Return array of section names
   - GET /api/pages?section={name}: Return array of pages
   - GET /api/pages?section={name}&slug={slug}: Return single page

STYLING:
- Tailwind CSS
- Primary: indigo-600
- Background: gray-50
- Cards: white with shadow-sm, hover:shadow-lg

DATA STRUCTURE:
- Page: { id, title, slug, seo_title, seo_description, featured_image, published_layout_json, created_at }
```

---

## Astro Integration

### What This Prompt Creates

- Complete Astro 3+ static site
- Static generation at build time
- Zero client-side JavaScript by default
- Dynamic routes for all sections
- Block renderer Astro component
- SEO-optimized with meta tags

### Files Created

1. `src/lib/db.ts` - Database helpers
2. `src/components/BlockRenderer.astro` - Content renderer
3. `src/components/Navigation.astro` - Dynamic navigation
4. `src/pages/[section]/index.astro` - Section list
5. `src/pages/[section]/[slug].astro` - Detail page

### The Prompt

```
Create a complete Astro 3+ static blog site:

1. DATABASE HELPERS:
   - Create src/lib/db.ts
   - Functions:
     * listSections(url): Query _cms_metadata for sections
     * listItems(url, section): Query section table
     * getItemBySlug(url, section, slug): Query by slug
   - Support PostgreSQL (pg client) and MongoDB
   - Auto-detect from DATABASE_URL

2. BLOCK RENDERER (Astro Component):
   - Create src/components/BlockRenderer.astro
   - Props: { content }
   - Support blocks: paragraph, header, image, list, code, quote, divider
   - Tailwind classes for styling
   - Use Astro syntax: <p set:html={...} />

3. NAVIGATION (Astro Component):
   - Create src/components/Navigation.astro
   - Fetch sections at build time
   - Display horizontal nav
   - Highlight active based on Astro.url.pathname
   - Link to each section

4. SECTION LIST PAGE:
   - Create src/pages/[section]/index.astro
   - getStaticPaths(): Generate paths from database sections
   - Fetch all pages for section
   - Display grid of cards
   - Include Navigation component
   - SEO: title, description meta tags

5. DETAIL PAGE:
   - Create src/pages/[section]/[slug].astro
   - getStaticPaths(): Generate all section/slug combinations
   - Fetch page data
   - 404 redirect if not found
   - Display: back link, title, description, image, content
   - SEO: title, description, keywords, OpenGraph tags
   - Include Navigation and BlockRenderer

6. STYLING:
   - Tailwind CSS via CDN or integration
   - Same color scheme as other frameworks
   - Responsive design

STATIC GENERATION:
- All pages generated at build time
- No client-side JavaScript required
- Perfect for SEO

DATA STRUCTURE:
- Page: { id, title, slug, seo_title, seo_description, seo_keywords, og_title, og_description, og_image, featured_image, published_layout_json, created_at }
```

---

## HTML/CSS/JS Integration

### What This Prompt Creates

- Pure HTML/CSS/JS solution
- No build step required
- Client-side routing via hash
- Works with any backend API
- Single HTML file with embedded CSS and JS

### Files Created

1. `index.html` - Complete single-page application
2. `server.js` - Example Express.js backend (optional)

### Backend API Required

Requires a backend API to serve data. Example provided using Express.js.

### The Prompt

```
Create a complete HTML/CSS/JS blog application:

1. SINGLE HTML FILE:
   - Create index.html
   - Include Tailwind CSS via CDN
   - Include all CSS in <style> tag
   - Include all JS in <script> tag

2. STRUCTURE:
   - Navigation bar with dynamic sections
   - Main content area
   - Client-side routing using URL hash (#/section/slug)

3. JAVASCRIPT MODULES (all in one file):
   
   CONFIGURATION:
   - API_BASE_URL constant for backend endpoint
   
   DATABASE FUNCTIONS:
   - fetchSections(): Fetch from /api/sections
   - fetchPages(section): Fetch from /api/pages?section=
   - fetchPage(section, slug): Fetch from /api/pages
   
   BLOCK RENDERER:
   - renderBlock(block): Convert block to HTML string
   - renderContent(content): Render all blocks
   - Support: paragraph, header, image, list, code, quote, divider
   
   PAGE RENDERERS:
   - renderSectionList(section, pages): Generate grid HTML
   - renderPageDetail(section, page): Generate article HTML
   
   ROUTER:
   - handleRoute(): Parse hash and render appropriate view
   - initNavigation(): Load sections and build nav
   - Event listeners for hashchange

4. STYLING:
   - Tailwind CSS classes
   - Custom CSS for line-clamp
   - Responsive design
   - Same color scheme

5. BACKEND API (Node.js/Express example):
   - GET /api/sections: Return section names
   - GET /api/pages?section={name}: Return pages array
   - GET /api/pages?section={name}&slug={slug}: Return single page
   - Use pg client for PostgreSQL

FEATURES:
- Hash-based routing (no page reloads)
- Dynamic section navigation
- List view with cards
- Detail view with content
- Back navigation
- SEO-friendly (if using prerender)

DATA STRUCTURE:
- Same as other frameworks
- published_layout_json with blocks array
```

---

## Common Data Structure

All prompts expect the same database schema:

### PostgreSQL

```sql
-- Metadata table
CREATE TABLE _cms_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Section table (e.g., blogs, problems)
CREATE TABLE "blogs" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  featured_image TEXT,
  published_layout_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB

```javascript
// CmsMetadata collection
{ type: "section", name: "blogs" }

// Page collection
{
  _id: ObjectId("..."),
  collectionType: "blogs",
  title: "Post Title",
  slug: "post-slug",
  seo_title: "SEO Title",
  seo_description: "Description",
  seo_keywords: "keyword1, keyword2",
  featured_image: "https://...",
  published_layout_json: {
    blocks: [
      { type: "paragraph", data: { text: "Content..." } }
    ]
  },
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## Block Types Supported

All prompts support these block types in `published_layout_json`:

| Type | Data Structure |
|------|----------------|
| paragraph | `{ text: "HTML content" }` |
| header | `{ text: "Title", level: 1-6 }` |
| image | `{ file: { url: "..." }, caption: "..." }` |
| list | `{ items: ["..."], style: "ordered" \| "unordered" }` |
| code | `{ code: "...", language: "..." }` |
| quote | `{ text: "..." }` |
| divider | `{}` |

---

## Environment Variables

All prompts require:

```env
DATABASE_URL=your_database_connection_string
```

For PostgreSQL: `postgresql://user:password@host:port/database`
For MongoDB: `mongodb+srv://user:password@cluster/database`

---

## Usage Instructions

1. Choose your framework
2. Copy the prompt
3. Paste into your AI IDE (Claude, ChatGPT, etc.)
4. The AI will generate all necessary files
5. Set up your DATABASE_URL
6. Run the application

No manual file copying or configuration needed!
