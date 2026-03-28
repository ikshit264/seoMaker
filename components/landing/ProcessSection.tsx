'use client'

import { Layout, Rocket, Database } from "lucide-react"

const cards = [
  {
    title: "Define Your DNA",
    desc: "Create high-performance SEO blocks that perfectly mirror your design tokens. 100% type-safe, right in your IDE territory.",
    icon: Database,
    color: "#4f46e5"
  },
  {
    title: "Visual Assembly",
    desc: "Drag, drop, and refine. Our visual engine directly manipulates your PostgreSQL tables or MongoDB collections in real-time. No staging, no waiting.",
    icon: Layout,
    color: "#0891b2"
  },
  {
    title: "Edge Publication",
    desc: "Deploy to globally distributed edge nodes. Zero latency, perfect Core Web Vitals, every time.",
    icon: Rocket,
    color: "#059669"
  }
]

export default function ProcessSection() {
  return (

    <section id="process" className="relative bg-transparent py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT TEXT */}
          <div>
            <div className="flex gap-4 mb-8">
              {cards.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === 0 ? 'w-10 bg-indigo-600' : 'w-3 bg-zinc-200'}`}
                />
              ))}
            </div>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 leading-[0.9] mb-4 sm:mb-6">
              The High-Fidelity
              <br />
              <span className="text-indigo-600">
                Framework
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-zinc-500 font-semibold italic max-w-md">
              We&apos;ve optimized every millisecond of the development lifecycle.
            </p>
          </div>

          {/* CARD STACK (Static and Clean) */}
          <div className="relative h-[300px] sm:h-[400px] w-full mt-12 lg:mt-0">
            {cards.map((card, i) => {
              const Icon = card.icon
              
              // We'll stack them slightly offset for a "premium" layered look
              const offset = i * 10;
              const scale = 1 - (i * 0.04);
              const opacity = 1 - (i * 0.15);

              return (
                <div
                  key={i}
                  style={{
                    transform: `translateY(${offset}px) scale(${scale})`,
                    zIndex: cards.length - i,
                    opacity: opacity,
                  }}
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-zinc-200 bg-white shadow-[0_30px_70px_rgba(0,0,0,0.06)] p-6 sm:p-10 flex flex-col justify-between"
                >
                  <div
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: card.color }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-3xl font-black text-zinc-900 mb-2 sm:mb-3">
                      {card.title}
                    </h3>
                    <p className="text-zinc-500 font-medium leading-relaxed text-sm sm:text-base">
                      {card.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 opacity-60 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">
                    {i === 0 && (
                      <>
                        <span className="px-2 sm:px-3 py-1 bg-zinc-100 rounded">TypeScript</span>
                        <span className="px-2 sm:px-3 py-1 bg-zinc-100 rounded">Zod</span>
                      </>
                    )}
                    {i === 1 && (
                      <>
                        <span className="px-2 sm:px-3 py-1 bg-zinc-100 rounded">Real-time</span>
                        <span className="px-2 sm:px-3 py-1 bg-zinc-100 rounded">Auto Layout</span>
                      </>
                    )}
                    {i === 2 && (
                      <>
                        <span className="px-2 sm:px-3 py-1 bg-zinc-100 rounded">ISR</span>
                        <span className="px-2 sm:px-3 py-1 bg-zinc-100 rounded">CDN</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>

  )
}
