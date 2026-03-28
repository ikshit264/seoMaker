import Link from 'next/link';

const termSections = [
  {
    title: 'Using the application',
    body:
      'seoMaker is provided as a structured content operations product for creating, managing, and integrating SEO-focused pages and articles. You are responsible for how your team uses the product, the content you publish, and the environments you connect to it.',
  },
  {
    title: 'Your data and connected infrastructure',
    body:
      'A core product benefit of seoMaker is that content can be stored directly in your own PostgreSQL or MongoDB database. You remain responsible for the infrastructure, permissions, backups, retention rules, and website behavior associated with your connected systems.',
  },
  {
    title: 'AI-assisted generation',
    body:
      'AI features are intended to accelerate drafting and structured content generation, but your team should still review generated material before publication. You are responsible for the accuracy, legality, and suitability of any content you choose to publish.',
  },
  {
    title: 'Integrations and deployment',
    body:
      'You may integrate seoMaker with websites, frameworks, databases, and third-party services that your team controls. Compatibility guidance and documentation are provided to support implementation, but you are responsible for testing your final production setup.',
  },
  {
    title: 'Service changes',
    body:
      'We may improve, refine, or update the product, documentation, and workflows over time. If a change materially affects how the application operates, the updated terms or supporting guidance should be reviewed before continued production use.',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-sm">
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">Terms of Use</div>
          <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-6xl">Clear terms for confident implementation.</h1>
          <p className="max-w-3xl text-base font-medium leading-7 text-zinc-300 sm:text-lg">
            These terms describe the practical expectations for using seoMaker in your workflow, especially when connecting your own database, rendering content in your product, and publishing AI-assisted structured pages.
          </p>
          <p className="mt-4 text-sm font-semibold text-zinc-500">Last updated: March 28, 2026</p>
        </div>

        <div className="space-y-5">
          {termSections.map((section) => (
            <section key={section.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-sm">
              <h2 className="mb-3 text-2xl font-black">{section.title}</h2>
              <p className="text-base font-medium leading-7 text-zinc-300">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] border border-indigo-500/20 bg-indigo-500/10 p-8 shadow-sm">
          <h2 className="mb-3 text-2xl font-black text-white">Need the implementation path?</h2>
          <p className="max-w-2xl text-sm font-medium leading-7 text-zinc-300">
            The public docs walk through the integration model, and the landing page links now map only to real sections and live routes so teams can move through evaluation and setup without broken navigation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/docs/quick-start" className="rounded-full bg-white px-5 py-3 text-sm font-black text-zinc-900 transition-colors hover:bg-zinc-100">
              Open Quick Start
            </Link>
            <Link href="/" className="rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/10">
              Return Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
