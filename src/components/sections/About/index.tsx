'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
import { MapPin, Mail, Zap } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { personal, languages } from '@/config/data';

// ─── Language proficiency colours ──────────────────────────────────────────
const levelConfig: Record<string, { color: string; bg: string; border: string }> = {
  Native:        { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)' },
  Fluent:        { color: '#00d4ff', bg: 'rgba(0,212,255,0.10)',   border: 'rgba(0,212,255,0.30)' },
  Proficient:    { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)',  border: 'rgba(124,58,237,0.35)' },
  Conversational:{ color: '#f97316', bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.30)' },
  Learning:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)' },
};

// ─── Stagger helpers ────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

// ─── Animated geometric shape ───────────────────────────────────────────────
function GeometricOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Outer slow-rotating halo ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute w-80 h-80"
        style={{
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute w-64 h-64"
        style={{
          border: '1px dashed rgba(124,58,237,0.18)',
          borderRadius: '50%',
        }}
      />

      {/* Orbiting accent dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 14 + i * 2, repeat: Infinity, ease: 'linear' }}
          className="absolute w-64 h-64"
          style={{ originX: '50%', originY: '50%' }}
        >
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(128px) translateY(-50%)`,
              background: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)',
              boxShadow: i % 2 === 0
                ? '0 0 8px 2px rgba(0,212,255,0.6)'
                : '0 0 8px 2px rgba(124,58,237,0.6)',
            }}
          />
        </motion.div>
      ))}

      {/* Main hexagon */}
      <motion.div
        animate={{ rotate: [0, 60] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute w-52 h-52"
        style={{
          clipPath: 'polygon(50% 0%,93.3% 25%,93.3% 75%,50% 100%,6.7% 75%,6.7% 25%)',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.18) 0%, rgba(124,58,237,0.22) 50%, rgba(249,115,22,0.14) 100%)',
          boxShadow: '0 0 60px rgba(0,212,255,0.25), 0 0 120px rgba(124,58,237,0.15)',
        }}
      />

      {/* Inner hex (counter-rotate for contrast) */}
      <motion.div
        animate={{ rotate: [0, -60] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute w-32 h-32"
        style={{
          clipPath: 'polygon(50% 0%,93.3% 25%,93.3% 75%,50% 100%,6.7% 75%,6.7% 25%)',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(0,212,255,0.25))',
          boxShadow: '0 0 40px rgba(124,58,237,0.4)',
        }}
      />

      {/* Pulsing core glow */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.9) 0%, rgba(124,58,237,0.5) 60%, transparent 100%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Tiny solid core */}
      <div
        className="absolute w-5 h-5 rounded-full"
        style={{
          background: 'var(--color-primary)',
          boxShadow: '0 0 16px 4px rgba(0,212,255,0.8)',
        }}
      />
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative rounded-2xl p-5 overflow-hidden group"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      whileHover={{ scale: 1.03, borderColor: 'rgba(0,212,255,0.35)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.2), transparent)' }}
      />
      <div
        className="text-4xl font-black tabular-nums"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-sm mt-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </div>
    </motion.div>
  );
}

// ─── Main section ────────────────────────────────────────────────────────────
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);

  const leftInView  = useInView(leftRef,  { once: true, margin: '-8%' });
  const rightInView = useInView(rightRef, { once: true, margin: '-8%' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 1,
        }}
      />

      {/* Ambient blobs */}
      <div
        className="absolute -top-32 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          eyebrow="About Me"
          title="The Story So Far"
          subtitle="A frontend engineer who bridges design sensibility with engineering rigour."
        />

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* ── LEFT: text content ─────────────────────────────────────── */}
          <motion.div
            ref={leftRef}
            variants={containerVariants}
            initial="hidden"
            animate={leftInView ? 'visible' : 'hidden'}
          >
            {/* Bio */}
            <motion.p
              variants={fadeLeft}
              className="text-lg leading-relaxed mb-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {personal.bio}
            </motion.p>

            {/* Stats grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {personal.stats.map((s) => (
                <StatCard key={s.label} label={s.label} value={s.value} suffix={s.suffix} />
              ))}
            </motion.div>

            {/* Personal details */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 mb-10"
            >
              {/* Location */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
                >
                  <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {personal.location}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
                >
                  <Mail size={14} style={{ color: 'var(--color-secondary)' }} />
                </div>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-sm hover:underline transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {personal.email}
                </a>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <Zap size={14} style={{ color: '#10b981' }} />
                </div>
                <motion.span
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    color: '#10b981',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  Available for Work
                </motion.span>
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div variants={itemVariants}>
              <p
                className="text-xs font-mono tracking-widest uppercase mb-4 font-semibold"
                style={{ color: 'var(--color-text-dim)' }}
              >
                Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, i) => {
                  const cfg = levelConfig[lang.level] ?? levelConfig.Conversational;
                  return (
                    <motion.span
                      key={lang.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={leftInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        color: cfg.color,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: cfg.color }}
                      />
                      {lang.name}
                      <span className="opacity-70">· {lang.level}</span>
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: geometric shape ──────────────────────────────────── */}
          <motion.div
            ref={rightRef}
            variants={fadeRight}
            initial="hidden"
            animate={rightInView ? 'visible' : 'hidden'}
            className="relative flex items-center justify-center"
            style={{ minHeight: '420px' }}
          >
            {/* Soft radial backdrop */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(124,58,237,0.08) 0%, rgba(0,212,255,0.05) 50%, transparent 100%)',
                border: '1px solid var(--color-border)',
              }}
            />

            {/* Corner decoration lines */}
            {[
              'top-0 left-0 border-t border-l rounded-tl-3xl',
              'top-0 right-0 border-t border-r rounded-tr-3xl',
              'bottom-0 left-0 border-b border-l rounded-bl-3xl',
              'bottom-0 right-0 border-b border-r rounded-br-3xl',
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-8 h-8 ${cls} pointer-events-none`}
                style={{ borderColor: 'var(--color-primary)', opacity: 0.5 }}
              />
            ))}

            <GeometricOrb />

            {/* Floating label chips */}
            {[
              { text: 'React / Next.js', top: '10%', left: '-4%', delay: 0.3 },
              { text: 'TypeScript',      top: '15%', right: '-4%', delay: 0.5 },
              { text: 'Tailwind CSS',    bottom: '18%', left: '-4%', delay: 0.7 },
              { text: 'Framer Motion',   bottom: '10%', right: '-4%', delay: 0.9 },
            ].map(({ text, delay, ...pos }) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={rightInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay }}
                style={{
                  position: 'absolute',
                  ...pos,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  color: 'var(--color-text-muted)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                {text}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
