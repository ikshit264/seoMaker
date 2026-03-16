# 🚀 Quick Start - SEO Maker Integration

**Get your blog running in 5 minutes with perfect SEO!**

---

## The Simple Way (No SDKs!)

Just copy **3 files** to your Next.js project:

```bash
# Copy these from seoMaker/ to your project:

lib/seo-maker.ts                    # Data fetching + SEO helpers
components/SeoMaker/PageCard.tsx    # Blog card component  
components/SeoMaker/PageRenderer.tsx # Content renderer
```

---

## Step 1: Create Blog List (2 min)

`app/blogs/page.tsx`:

```typescript
import { getPages } from '@/lib/seo-maker';
import { PageCard } from '@/components/SeoMaker/PageCard';

export default async function BlogsPage() {
  const pages = await getPages('blogs');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <PageCard key={page.slug} page={page} baseUrl="/blogs" />
        ))}
      </div>
    </div>
  );
}
```

---

## Step 2: Create Single Post (2 min)

`app/blogs/[slug]/page.tsx`:

```typescript
import { getPage, generateMetadata } from '@/lib/seo-maker';
import { PageRenderer } from '@/components/SeoMaker/PageRenderer';

export async function generateMetadata({ params }) {
  const page = await getPage('blogs', params.slug);
  return generateMetadata(page);
}

export default async function BlogPost({ params }) {
  const page = await getPage('blogs', params.slug);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1>{page.seo_title || page.title}</h1>
      <PageRenderer content={page.published_layout_json} />
    </article>
  );
}
```

---

## ✨ Done!

You now have:
- ✅ Server-side rendered blog pages
- ✅ Automatic SEO meta tags
- ✅ Structured data for Google
- ✅ Perfect Lighthouse scores

**Total time: 5 minutes** ⏱️

---

## 📚 Full Documentation

See **[SIMPLE_INTEGRATION.md](SIMPLE_INTEGRATION.md)** for:
- Complete function reference
- Advanced examples (pagination, search, etc.)
- Customization guide
- Troubleshooting

**Or visit the Integration Guide in your dashboard:** `/dashboard/integration-guide`

---

## 🎯 Why This is Better

❌ No SDK packages to install  
❌ No API calls or HTTP overhead  
❌ No domain verification needed  
✅ Just direct Prisma queries to YOUR database  
✅ Full control over your data  
✅ Simpler and faster!  

---

**Ready to deploy!** 🚀
