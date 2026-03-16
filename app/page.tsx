'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

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
  Globe 
} from 'lucide-react';

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
            className="mb-16 sm:mb-24 text-center max-w-3xl mx-auto space-y-4 sm:space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-[0.9]">
              Everything you need to <br /><span className="text-zinc-400">rank higher.</span>
            </h2>
            <p className="text-zinc-600 font-bold text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              We've packed the most powerful SEO tools into a beautiful, intuitive interface that anyone can master.
            </p>
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
              title="Enterprise Grade"
              description="RBAC, SSO, and advanced security features designed to keep your team and sensitive data safe at scale."
              icon={Shield}
              colorClass="text-emerald-500"
            />
            <BentoItem 
              className="md:col-span-8"
              title="Native MongoDB Integration"
              description="Connect your own database in seconds. We store the layouts, you keep the keys. No proprietary silos, no vendor lock-in, just pure architectural freedom."
              icon={Database}
              colorClass="text-green-600"
            />
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

        <LandingFooter />
      </main>
    </motion.div>
  );
}
