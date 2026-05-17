'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
import SectionHeading from '@/components/ui/SectionHeading';
import { skills } from '@/config/data';

// ─── Types ───────────────────────────────────────────────────────────────────
type SkillItem = { name: string; level: number };
type SkillCategory = { category: string; color: string; items: SkillItem[] };

// ─── Animation helpers ────────────────────────────────────────────────────────
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
  exit:    { opacity: 0, y: -14, scale: 0.95, transition: { duration: 0.25 } },
};

// ─── Progress bar component ───────────────────────────────────────────────────
function SkillBar({
  name,
  level,
  color,
  index,
  isVisible,
}: {
  name: string;
  level: number;
  color: string;
  index: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative rounded-xl p-4 group overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        transition: 'border-color 0.2s',
      }}
      whileHover={{
        borderColor: `${color}55`,
        boxShadow: `0 0 20px ${color}18`,
      }}
    >
      {/* Hover glow layer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${color}0d 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {name}
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.07 }}
            className="text-xs font-mono font-bold tabular-nums"
            style={{ color }}
          >
            {level}%
          </motion.span>
        </div>

        {/* Track */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--color-border-light)' }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={isVisible ? { width: `${level}%` } : { width: 0 }}
            transition={{
              duration: 1.1,
              delay: 0.2 + index * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              background: `linear-gradient(90deg, ${color}cc, ${color})`,
              boxShadow: `0 0 8px ${color}66`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Single tab panel ─────────────────────────────────────────────────────────
function CategoryPanel({ data }: { data: SkillCategory }) {
  const ref       = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: false, margin: '-5%' });

  return (
    <motion.div
      ref={ref}
      key={data.category}
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {data.items.map((item, i) => (
        <SkillBar
          key={item.name}
          name={item.name}
          level={item.level}
          color={data.color}
          index={i}
          isVisible={isVisible}
        />
      ))}
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabsInView = useInView(tabsRef, { once: true, margin: '-5%' });

  const active = skills[activeIndex];

  return (
    <section
      id="skills"
      className="relative py-28 overflow-hidden"
      style={{ background: 'var(--color-bg-alt, var(--color-bg))' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(124,58,237,0.06) 0%, transparent 70%),' +
            'radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,212,255,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          eyebrow="Expertise"
          title="Skills & Technologies"
          subtitle="Four years of crafting production-grade interfaces — here's the toolkit."
        />

        {/* ── Tab bar ─────────────────────────────────────────────────── */}
        <motion.div
          ref={tabsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={tabsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
          role="tablist"
          aria-label="Skill categories"
        >
          {skills.map((cat, i) => {
            const isActive = activeIndex === i;
            return (
              <button
                key={cat.category}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(i)}
                className="relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
                style={{
                  color: isActive ? cat.color : 'var(--color-text-muted)',
                  background: isActive ? `${cat.color}12` : 'transparent',
                  border: `1px solid ${isActive ? `${cat.color}40` : 'var(--color-border)'}`,
                  zIndex: 1,
                }}
              >
                {/* Animated background pill */}
                {isActive && (
                  <motion.span
                    layoutId="active-tab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${cat.color}10`, border: `1px solid ${cat.color}35` }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {/* Dot indicator */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: cat.color,
                      boxShadow: isActive ? `0 0 6px ${cat.color}` : 'none',
                    }}
                  />
                  {cat.category}
                  <span
                    className="ml-1 text-xs opacity-70 tabular-nums"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {cat.items.length}
                  </span>
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Category meta row ────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.category + '-meta'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <div
              className="h-px flex-1 max-w-xs"
              style={{ background: `linear-gradient(90deg, ${active.color}60, transparent)` }}
            />
            <span
              className="text-xs font-mono tracking-widest uppercase font-semibold"
              style={{ color: active.color }}
            >
              {active.category}
            </span>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-full"
              style={{
                background: `${active.color}15`,
                color: active.color,
                border: `1px solid ${active.color}30`,
              }}
            >
              {active.items.length} skills
            </span>
            <div
              className="h-px flex-1 max-w-xs"
              style={{ background: `linear-gradient(270deg, ${active.color}60, transparent)` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Skill grid with AnimatePresence ──────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeIndex}>
            <CategoryPanel data={active} />
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom legend ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mt-14"
        >
          {[
            { label: 'Expert', range: '90–100%' },
            { label: 'Advanced', range: '75–89%' },
            { label: 'Proficient', range: '60–74%' },
          ].map(({ label, range }) => (
            <div key={label} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-dim)' }}>
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  background:
                    label === 'Expert'
                      ? 'var(--color-primary)'
                      : label === 'Advanced'
                      ? 'var(--color-secondary)'
                      : 'var(--color-accent)',
                  opacity: 0.7,
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)' }}>{label}</span>
              <span className="opacity-50">{range}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
