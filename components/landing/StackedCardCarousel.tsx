'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';

interface CardData {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    name: "Alex River",
    role: "SEO Director @ Vercel",
    content: "seoMaker transformed our workflow. We went from manual JSON updates to a visual masterpiece in weeks. The performance is unmatched.",
    avatar: "AR"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Lead Architect @ Stripe",
    content: "The native PostgreSQL and MongoDB support is a game changer. Total data ownership combined with a world-class UI, exactly what we needed.",
    avatar: "SC"
  },
  {
    id: 3,
    name: "Marcus Thorne",
    role: "Founder @ Digital Flow",
    content: "Finally, a visual builder that doesn't produce bloat. The Next.js output is clean, fast, and perfectly optimized for search engines.",
    avatar: "MT"
  },
  {
    id: 4,
    name: "Elena Rossi",
    role: "Product Manager @ Notion",
    content: "The velocity we've gained is incredible. Building SEO-optimized landings is now a creative process rather than a technical hurdle.",
    avatar: "ER"
  }
];

export const StackedCardCarousel = () => {
  const [cards, setCards] = useState(CARDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const firstCard = newCards.shift()!;
        newCards.push(firstCard);
        return newCards;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-xl h-[400px] flex items-center justify-center perspective-[1500px]">
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => {
          if (index > 2) return null;

          return (
            <motion.div
              key={card.id}
              layout
              initial={{
                opacity: 0,
                scale: 0.8,
                z: -index * 100,
                y: index * 20
              }}
              animate={{
                opacity: 1 - index * 0.2,
                scale: 1 - index * 0.05,
                z: -index * 50,
                y: index * 10,
                zIndex: CARDS.length - index
              }}
              exit={{
                opacity: 0,
                x: 300,
                scale: 0.9,
                rotate: 15,
                transition: { duration: 0.6, ease: [0.32, 0, 0.67, 0] }
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="absolute w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl flex flex-col gap-6"
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-indigo-500/20" />
              </div>

              <p className="text-xl font-bold text-white leading-relaxed italic">
                &ldquo;{card.content}&rdquo;
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg">
                  {card.avatar}
                </div>
                <div>
                  <div className="font-black text-white">{card.name}</div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{card.role}</div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] pointer-events-none" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
