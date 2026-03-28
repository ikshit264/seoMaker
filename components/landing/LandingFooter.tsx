'use client';

import { LayoutTemplate, Globe, Database, Zap } from 'lucide-react';
import Link from 'next/link';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Process', href: '#process' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Docs', href: '#docs' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Quick Start', href: '/docs/quick-start' },
      { label: 'Platform Guides', href: '/docs/platform-guides' },
      { label: 'Full Documentation', href: '/docs/full-documentation' },
      { label: 'Create an Account', href: '/signup' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export const LandingFooter = () => {
  return (
    <footer className="relative overflow-hidden border-t border-zinc-900 bg-black px-6 pb-20 pt-40">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-16 lg:grid-cols-5 lg:gap-8">
        <div className="col-span-2 space-y-10">
          <div className="flex items-center gap-2 text-3xl font-black tracking-tighter text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <LayoutTemplate className="h-8 w-8 text-white" />
            </div>
            seoMaker
          </div>
          <p className="max-w-sm text-lg font-bold leading-relaxed text-zinc-500">
            Building the future of SEO infrastructure. Visually designed, natively deployed, and 100% owned by you.
          </p>
          <div className="flex gap-6">
            <Link
              href="/docs/full-documentation"
              aria-label="Open documentation"
              className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700 hover:bg-zinc-800"
            >
              <Globe className="h-6 w-6 text-zinc-500 group-hover:text-white" />
            </Link>
            <Link
              href="#features"
              aria-label="View product features"
              className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700 hover:bg-zinc-800"
            >
              <Database className="h-6 w-6 text-zinc-500 group-hover:text-white" />
            </Link>
            <Link
              href="/signup"
              aria-label="Create your account"
              className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700 hover:bg-zinc-800"
            >
              <Zap className="h-6 w-6 text-zinc-500 group-hover:text-white" />
            </Link>
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title} className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">{col.title}</h4>
            <ul className="space-y-5 text-sm font-bold text-zinc-500">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group flex items-center gap-2 transition-colors hover:text-white">
                    <div className="h-1 w-1 rounded-full bg-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-40 flex max-w-7xl flex-col items-center justify-between gap-8 border-t border-zinc-900 pt-12 md:flex-row">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          (c) 2026 seoMaker Inc. All rights reserved.
        </div>
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            System Operational
          </span>
          <span>Made for SEO Architects</span>
        </div>
      </div>

      <div className="pointer-events-none absolute -top-[500px] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[150px]" />
    </footer>
  );
};
