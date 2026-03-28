'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// Import refactored components from the local landing components folder
import { LandingNav } from '../components/landing/LandingNav';
import { Hero } from '../components/landing/Hero';
import { BentoItem } from '../components/landing/BentoItem';
import ProcessSection from '../components/landing/ProcessSection';
import { PricingCard } from '../components/landing/PricingCard';
import { LandingFooter } from '../components/landing/LandingFooter';
import { StackedCardCarousel } from '../components/landing/StackedCardCarousel';

// Icons for the main page logic
import { 
  Shield, 
  Database, 
  PenTool, 
  Globe,
  Sparkles,
  Layers3,
  FileCode2,
  Eye,
  WandSparkles,
  Blocks,
  HelpCircle
} from 'lucide-react';

const PRODUCT_AREAS = [
  {
    title: 'AI Content Studio',
    description: 'Generate full-page articles or target a single section with Gemini, then review the structured outline before inserting it into the editor.',
    icon: Sparkles,
  },
  {
    title: 'Section-Based Builder',
    description: 'Compose long-form pages from sections, FAQs, tables, code blocks, embeds, quotes, and reusable layouts that map directly to stored JSON.',
    icon: Layers3,
  },
  {
    title: 'Framework Integration Guides',
    description: 'Copy one-shot prompts or concrete examples for Next.js, React, Astro, and plain HTML/JS using the exact payload your CMS stores.',
    icon: FileCode2,
  },
  {
    title: 'Live Preview Workflow',
    description: 'Edit, preview, save, and publish from a single workspace so your draft structure and frontend output stay aligned.',
    icon: Eye,
  },
  {
    title: 'Template + AI Combo',
    description: 'Start from curated templates, then ask AI to deepen the article with comparisons, FAQs, tables, and section-specific copy.',
    icon: WandSparkles,
  },
  {
    title: 'Portable Content Model',
    description: 'Publish into your own PostgreSQL or MongoDB with the same normalized schema, giving your product team direct access and simple frontend extraction at any time.',
    icon: Blocks,
  },
];

const FAQ_ITEMS = [
  {
    question: 'What can I build with seoMaker?',
    answer:
      'You can manage blogs, solution pages, problem pages, landing pages, documentation, and any other CMS section you define. Each section can have list pages, detail pages, SEO metadata, and structured block content.',
  },
  {
    question: 'Does the AI only generate short snippets or full articles too?',
    answer:
      'It supports both. You can generate a full article from top to bottom or generate content for a specific section block, including subsections, lists, tables, and FAQs.',
  },
  {
    question: 'Can I use my own database?',
    answer:
      'Yes. seoMaker is designed to work with your own PostgreSQL or MongoDB database, so your team keeps data ownership while getting a cleaner path to query, render, and reuse content across your product.',
  },
  {
    question: 'How do I show the content on my website?',
    answer:
      'Use the integration guide inside the app. It includes framework-specific examples and one-shot AI IDE prompts that describe the exact CMS payload and all detected sections so your frontend can be generated quickly.',
  },
  {
    question: 'Is the saved content portable?',
    answer:
      'Yes. The same normalized block format is returned for SQL and no-SQL storage, so your product can read published content, draft content, or the compatibility content field without custom adapters or lock-in.',
  },
];

const FEATURE_PROOF_POINTS = [
  'Generate structured long-form content with sections, subsections, tables, and FAQs.',
  'Work directly with your own PostgreSQL or MongoDB for cleaner ownership and easier rendering.',
  'Use integration-ready payloads that map cleanly into Next.js, React, Astro, and custom sites.',
];

const DOC_LINKS = [
  {
    title: 'Quick Start',
    description: 'Get the shortest path from database connection to live blog pages with copyable setup steps.',
    href: '/docs/quick-start',
  },
  {
    title: 'Platform Guides',
    description: 'Review framework-specific integration guidance for Next.js, React, and Astro before implementation.',
    href: '/docs/platform-guides',
  },
  {
    title: 'Full Documentation',
    description: 'Dive into the rendering model, block structure, metadata flow, and advanced integration details.',
    href: '/docs/full-documentation',
  },
];

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background color transition: Beige (#FDF6E3) -> Slightly darker beige -> Zinc 950
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["#FDF6E3", "#F5EFDB", "#09090b", "#09090b"]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["#18181b", "#18181b", "#f4f4f5", "#f4f4f5"]
  );

  const navBg = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["rgba(253, 246, 227, 0.8)", "rgba(245, 239, 219, 0.8)", "rgba(9, 9, 11, 0.8)", "rgba(9, 9, 11, 0.8)"]
  );

  const navBorder = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["rgba(0,0,0,0.05)", "rgba(0,0,0,0.05)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)"]
  );

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      style={{ backgroundColor }}
      className="min-h-screen font-sans transition-colors duration-500 selection:bg-indigo-500/30 overflow-x-hidden"
    >
      <LandingNav 
        textColor={textColor} 
        navBg={navBg} 
        navBorder={navBorder} 
        isAuthenticated={isAuthenticated} 
      />

      <main className="relative">
        <Hero textColor={textColor} isAuthenticated={isAuthenticated} />


        <ProcessSection />
        {/* Section 2: Features Bento (Cream) */}
        <section id="features" className="py-40 px-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 sm:mb-24 text-center max-w-5xl mx-auto space-y-5 sm:space-y-7"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-[0.9]">
              Everything you need to <br /><span className="text-zinc-400">rank higher.</span>
            </h2>
            <p className="text-zinc-600 font-bold text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              seoMaker combines visual editing, AI-assisted blog generation, structured publishing, database ownership, preview workflows, and frontend-ready payloads in one system, so your team can move from idea to production page with far less operational friction.
            </p>
            <p className="text-zinc-500 font-semibold text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              Instead of juggling disconnected SEO tools, internal docs, manual database updates, and custom frontend glue code, you get a single workflow that helps create, organize, store, review, and ship content in a structure your product can actually use.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch justify-center gap-3 pt-2">
              {FEATURE_PROOF_POINTS.map((point) => (
                <div key={point} className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-bold text-zinc-700 shadow-sm">
                  {point}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-4xl mx-auto">
              <div className="rounded-[1.75rem] border border-zinc-200 bg-white/70 p-5 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">Creation</div>
                <p className="text-sm font-medium leading-6 text-zinc-600">Build blogs, solution pages, documentation, and custom CMS sections from a structured visual editor designed for long-form SEO content.</p>
              </div>
              <div className="rounded-[1.75rem] border border-zinc-200 bg-white/70 p-5 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">Storage</div>
                <p className="text-sm font-medium leading-6 text-zinc-600">Save normalized content directly into your own database so your product, APIs, and internal workflows can access the same source of truth.</p>
              </div>
              <div className="rounded-[1.75rem] border border-zinc-200 bg-white/70 p-5 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">Delivery</div>
                <p className="text-sm font-medium leading-6 text-zinc-600">Render the same content cleanly across Next.js, React, Astro, or custom sites with framework-specific guides and copy-ready prompts.</p>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto md:auto-rows-[400px]">
            <BentoItem 
              className="md:col-span-8"
              title="Visual JSON Editor"
              description="A pixel-perfect canvas that complies directly to a strict JSON AST. No messy HTML, just clean structured data for your Next.js application. Built for developers who care about performance."
              icon={PenTool}
              colorClass="text-indigo-500"
            />
            <BentoItem 
              className="md:col-span-4"
              title="Global Edge"
              description="Deploy your content to over 300+ edge locations worldwide for instant loading and perfect SEO metrics everywhere."
              icon={Globe}
              colorClass="text-sky-500"
            />
            <BentoItem 
              className="md:col-span-4" 
              title="Ownership by Design"
              description="Run the workflow on top of your own database so your team keeps direct data access, cleaner governance, and faster integration with the rest of your product stack."
              icon={Shield}
              colorClass="text-emerald-500"
            />
            <BentoItem 
              className="md:col-span-8"
              title="Native Database Integration"
              description="Connect your own PostgreSQL or MongoDB database in seconds. Content stays in the systems your team already trusts, making implementation, querying, and website rendering much easier."
              icon={Database}
              colorClass="text-green-600"
            />
          </div>
        </section>

        <section id="docs" className="py-28 sm:py-36 px-6 max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 border border-zinc-200"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                What&apos;s Inside
              </motion.div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-[0.92]">
                Rich content ops for the entire <span className="text-indigo-600">SEO stack.</span>
              </h2>
              <p className="text-zinc-600 font-bold text-base sm:text-lg leading-relaxed max-w-xl">
                seoMaker is not just a visual editor. It gives your product team a confident operating layer for content generation, structured storage, framework integration, section workflows, templates, previews, and publish-ready metadata, all while working directly with your own database.
              </p>
              <div className="max-w-xl rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-sm">
                <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Docs & Launch</div>
                <p className="mb-5 text-sm font-medium leading-6 text-zinc-600">
                  Every guide below points to a real public page, so teams can move from product overview into implementation without hitting dead ends or guessing at the next step.
                </p>
                <Link href="/signup" className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-zinc-800">
                  Start with your own workspace
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {PRODUCT_AREAS.map((area) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={area.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[2rem] border border-zinc-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-3">{area.title}</h3>
                    <p className="text-sm font-medium leading-6 text-zinc-600">{area.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {DOC_LINKS.map((doc) => (
              <Link
                key={doc.title}
                href={doc.href}
                className="rounded-[2rem] border border-zinc-200 bg-white/85 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Implementation Guide</div>
                <h3 className="mb-3 text-2xl font-black text-zinc-900">{doc.title}</h3>
                <p className="text-sm font-medium leading-6 text-zinc-600">{doc.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Pricing (Dark) */}
        <section id="pricing" className="py-24 sm:py-48 px-6 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 sm:mb-24 space-y-4 sm:space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-indigo-400 font-black tracking-[0.3em] uppercase text-[10px] sm:text-xs"
              >
                Simple, Transparent Pricing
              </motion.div>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                Choose your <br /><span className="text-zinc-600">velocity.</span>
              </h2>
              <p className="text-zinc-400 font-bold text-base sm:text-lg max-w-xl mx-auto">
                From side projects to enterprise clusters, we have a plan that scales with your ambition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8 items-center px-4 sm:px-0">
              <PricingCard 
                tier="Starter"
                price="0"
                description="Perfect for developers building their first SEO machine."
                features={["Up to 5 Pages", "Community Support", "Basic Analytics", "Visual Editor", "Manual Publication"]}
              />
              <PricingCard 
                tier="Pro"
                price="49"
                highlight
                description="The essential toolkit for growing agencies and teams."
                features={["Unlimited Pages", "Priority Support", "Advanced Analytics", "Custom Components", "Automated Workflows", "Team Collaboration"]}
              />
              <PricingCard 
                tier="Enterprise"
                price="199"
                description="Custom architecture for high-scale digital empires."
                features={["Dedicated Cluster", "24/7 Support", "SSO/RBAC", "SLA Guarantee", "White-label Options", "Dedicated AM"]}
              />
            </div>
          </div>

          {/* Background decoration for Dark section */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        </section>

        {/* Section 5: Trust / Testimonials (Dark) */}
        <section id="trust" className="py-24 sm:py-48 px-6 border-t border-zinc-900 relative overflow-hidden bg-black">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 sm:gap-24 items-center relative z-10">
              <div className="space-y-8 sm:space-y-12">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4 sm:space-y-6 text-center lg:text-left"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                    Voices of Innovation
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                    Built for <br /><span className="text-zinc-600">Architects,</span> <br />Loved by <span className="text-indigo-600">Humans.</span>
                  </h2>
                  <p className="text-zinc-500 font-bold text-base sm:text-lg max-w-sm mx-auto lg:mx-0 leading-relaxed">
                    Join the pioneers who are redefining the boundaries of SEO infrastructure and content experience.
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-8 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700 justify-items-center lg:justify-items-start">
                  <div className="flex items-center gap-3 text-white font-black text-xl tracking-tighter">
                    <div className="w-6 h-6 bg-white rounded-lg" /> Vercel
                  </div>
                  <div className="flex items-center gap-3 text-white font-black text-xl tracking-tighter">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full" /> Stripe
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <StackedCardCarousel />
              </div>
           </div>
           
           {/* Decorative blur */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />
        </section>

        <section id="faq" className="py-24 sm:py-36 px-6 bg-black border-t border-zinc-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">
                <HelpCircle className="w-3.5 h-3.5" />
                FAQ
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.92]">
                Everything teams ask <span className="text-zinc-600">before they ship.</span>
              </h2>
              <p className="text-zinc-500 font-bold text-base sm:text-lg max-w-2xl mx-auto">
                The platform is built to be flexible for marketers, engineers, and content teams working from the same source of truth.
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <motion.details
                  key={item.question}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-6 sm:p-8"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-6">
                    <span className="text-left text-lg sm:text-2xl font-black text-white">{item.question}</span>
                    <span className="shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 group-open:text-indigo-400">
                      Open
                    </span>
                  </summary>
                  <p className="mt-5 text-sm sm:text-base leading-7 font-medium text-zinc-400 max-w-4xl">
                    {item.answer}
                  </p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        <LandingFooter />
      </main>
    </motion.div>
  );
}
