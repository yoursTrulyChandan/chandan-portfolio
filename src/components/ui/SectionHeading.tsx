'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className={`mb-16 ${align === 'center' ? 'text-center' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 mb-4"
      >
        <span
          className="h-px w-8"
          style={{ background: 'var(--color-primary)' }}
        />
        <span
          className="font-mono text-xs tracking-[0.2em] uppercase font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          {eyebrow}
        </span>
        <span
          className="h-px w-8"
          style={{ background: 'var(--color-primary)' }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold tracking-tight"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg max-w-2xl mx-auto"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
