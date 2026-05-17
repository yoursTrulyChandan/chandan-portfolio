'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';

const OrbitalGame = dynamic(() => import('./OrbitalGame'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full max-w-[700px] mx-auto rounded-2xl flex items-center justify-center"
      style={{ height: 450, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <span className="font-mono text-sm" style={{ color: 'var(--color-text-dim)' }}>
        Loading orbital simulation...
      </span>
    </div>
  ),
});

export default function GameSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section
      id="game"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Mini Game"
          title="Orbital"
          subtitle="A gravity puzzle. Place wells to bend a comet's path through the stars — without hitting black holes."
        />

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10 -mt-6"
        >
          {['5 Levels', 'Physics Engine', 'High Score Tracking', 'Unique Puzzle'].map((pill) => (
            <span
              key={pill}
              className="px-3 py-1 rounded-full text-xs font-mono border"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border-light)',
                color: 'var(--color-text-dim)',
              }}
            >
              {pill}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <OrbitalGame />
        </motion.div>

        {/* Physics note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-xs font-mono"
          style={{ color: 'var(--color-text-dim)' }}
        >
          Built with real N-body gravitational physics · F = G·m/r²
        </motion.p>
      </div>
    </section>
  );
}
