import Link from 'next/link';

const privacySections = [
  {
    title: 'What seoMaker stores',
    body:
      'seoMaker stores the account, workspace, and application settings needed to run the product, including authentication details, app configuration, section definitions, and integration preferences. The goal is to support the editing workflow and make it easy for your team to manage structured content operations from one place.',
  },
  {
    title: 'Your content stays in your database',
    body:
      'The main content you create with seoMaker is designed to be stored in your own PostgreSQL or MongoDB database. That gives your team direct ownership, easier frontend access, and simpler operational control across websites, apps, and internal systems.',
  },
  {
    title: 'How AI generation is handled',
    body:
      'When you use AI-assisted generation, the prompts and context you provide are sent to the configured AI provider to generate structured content. Generated results are then parsed into the application format and saved to the destination you choose, including your own connected database.',
  },
  {
    title: 'Credentials and integrations',
    body:
      'Database credentials, API keys, and integration settings are used only to connect the services you authorize. Teams should manage those credentials carefully, rotate them when needed, and use environment variables or secure secret management in deployment environments.',
  },
  {
    title: 'Access and security',
    body:
      'We design seoMaker to support practical access control, structured editing, and predictable publishing workflows. You remain responsible for the security posture of your own deployment, database access rules, hosting environment, and any external services connected to your stack.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fdf6e3_0%,#f7f0de_50%,#ffffff_100%)] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 rounded-[2rem] border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm">
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600">Privacy Policy</div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-zinc-900 sm:text-6xl">Built around ownership and clarity.</h1>
          <p className="max-w-3xl text-base font-medium leading-7 text-zinc-600 sm:text-lg">
            seoMaker is built to help teams create and publish structured SEO content while keeping operational control close to their own product stack. This page explains how information is handled in the application.
          </p>
          <p className="mt-4 text-sm font-semibold text-zinc-500">Last updated: March 28, 2026</p>
        </div>

        <div className="space-y-5">
          {privacySections.map((section) => (
            <section key={section.title} className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 text-2xl font-black text-zinc-900">{section.title}</h2>
              <p className="text-base font-medium leading-7 text-zinc-600">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-zinc-900 p-8 text-white shadow-sm">
          <h2 className="mb-3 text-2xl font-black">Questions about privacy?</h2>
          <p className="max-w-2xl text-sm font-medium leading-7 text-zinc-300">
            Review the product documentation to understand the integration model and data flow before launch, or return to the landing page to continue setup.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/docs/full-documentation" className="rounded-full bg-white px-5 py-3 text-sm font-black text-zinc-900 transition-colors hover:bg-zinc-100">
              Read Documentation
            </Link>
            <Link href="/" className="rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/10">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
