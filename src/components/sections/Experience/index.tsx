'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, type Variants } from 'framer-motion';
import { MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import TechBadge from '@/components/ui/TechBadge';
import { experience } from '@/config/data';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Animation variants ────────────────────────────────────────────────────────
const cardVariants: Variants = {
  hidden:  { opacity: 0, x: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.65, ease: EASE },
  },
};

const dotVariants: Variants = {
  idle:   { scale: 1, boxShadow: '0 0 0px transparent' },
  active: {
    scale: 1.25,
    boxShadow: '0 0 14px 4px rgba(0,212,255,0.5)',
    transition: { duration: 0.3 },
  },
};

// ─── Highlight list (collapsible) ─────────────────────────────────────────────
function HighlightList({
  highlights,
  color,
  expanded,
  max = 2,
}: {
  highlights: string[];
  color: string;
  expanded: boolean;
  max?: number;
}) {
  const visible = expanded ? highlights : highlights.slice(0, max);
  return (
    <ul className="space-y-2 mt-4">
      {visible.map((h, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          className="flex items-start gap-3 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span
            className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: color }}
          />
          {h}
        </motion.li>
      ))}
    </ul>
  );
}

// ─── Single experience card ────────────────────────────────────────────────────
function ExperienceCard({
  item,
  index,
  isActive,
  onActivate,
}: {
  item: (typeof experience)[number];
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(cardRef, { once: true, margin: '-8%' });

  return (
    <div ref={cardRef} className="relative flex gap-6 lg:gap-10">
      {/* ── Timeline dot ────────────────────────────────────── */}
      <div className="hidden md:flex flex-col items-center">
        <motion.div
          variants={dotVariants}
          animate={isActive ? 'active' : 'idle'}
          onClick={onActivate}
          className="relative w-4 h-4 rounded-full cursor-pointer shrink-0 mt-1 z-10"
          style={{
            background: isActive ? item.color : 'var(--color-border-light)',
            border: `2px solid ${isActive ? item.color : 'var(--color-border)'}`,
          }}
        >
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: item.color }}
            />
          )}
        </motion.div>
        {/* Connector line */}
        {index < experience.length - 1 && (
          <div
            className="w-px flex-1 mt-2"
            style={{ background: 'linear-gradient(to bottom, var(--color-border), transparent)' }}
          />
        )}
      </div>

      {/* ── Card ────────────────────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="flex-1 mb-10 relative rounded-2xl overflow-hidden group"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          ...(isActive && {
            borderColor: `${item.color}50`,
            boxShadow: `0 0 30px ${item.color}12, 0 8px 32px rgba(0,0,0,0.3)`,
          }),
        }}
        onMouseEnter={onActivate}
      >
        {/* Glowing left border accent */}
        <motion.div
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: `linear-gradient(180deg, ${item.color}, ${item.color}55)` }}
        />

        {/* Subtle top-gradient fill */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${item.color}0a 0%, transparent 70%)`,
          }}
        />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
            <div>
              <h3
                className="text-lg font-bold mb-0.5"
                style={{ color: 'var(--color-text)' }}
              >
                {item.role}
              </h3>
              <div className="text-sm font-semibold" style={{ color: item.color }}>
                {item.company}
              </div>
            </div>

            {/* Period badge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
                style={{
                  background: `${item.color}12`,
                  border: `1px solid ${item.color}30`,
                  color: item.color,
                }}
              >
                <Calendar size={10} />
                {item.period}
              </span>
              <span
                className="inline-flex items-center gap-1 text-xs"
                style={{ color: 'var(--color-text-dim)' }}
              >
                <MapPin size={10} />
                {item.location}
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {item.description}
          </p>

          {/* Highlights */}
          <HighlightList
            highlights={item.highlights}
            color={item.color}
            expanded={expanded}
            max={2}
          />

          {/* Expand / Collapse */}
          {item.highlights.length > 2 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 hover:opacity-80"
              style={{ color: item.color }}
            >
              {expanded ? (
                <>
                  <ChevronUp size={13} />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown size={13} />
                  {item.highlights.length - 2} more highlights
                </>
              )}
            </button>
          )}

          {/* Tech badges */}
          <div
            className="flex flex-wrap gap-2 mt-5 pt-4"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            {item.tech.map((t) => (
              <TechBadge key={t} name={t} color={item.color} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Timeline scroll dot ───────────────────────────────────────────────────────
function TimelineScrollDot({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      className="hidden md:block absolute left-2.75 top-0 bottom-0 w-px"
      style={{ background: 'var(--color-border)' }}
    >
      <motion.div
        style={{ y }}
        className="absolute -left-0.75 w-1.75 h-1.75 rounded-full"
        animate={{
          boxShadow: [
            '0 0 0px rgba(0,212,255,0)',
            '0 0 12px 3px rgba(0,212,255,0.7)',
            '0 0 0px rgba(0,212,255,0)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        initial={{ backgroundColor: 'var(--color-primary)' }}
      />
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="experience"
      className="relative py-28 overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 50% 30% at 10% 40%, rgba(0,212,255,0.04) 0%, transparent 70%),' +
            'radial-gradient(ellipse 40% 30% at 90% 60%, rgba(124,58,237,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
        <SectionHeading
          eyebrow="Career"
          title="Work Experience"
          subtitle="Four companies. Four years. A trail of products people actually use."
        />

        {/* ── Timeline wrapper ─────────────────────────────────────── */}
        <div ref={containerRef} className="relative">
          <TimelineScrollDot containerRef={containerRef} />

          {experience.map((item, i) => (
            <ExperienceCard
              key={item.company}
              item={item}
              index={i}
              isActive={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
            />
          ))}
        </div>

        {/* ── Total duration callout ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-4 flex items-center justify-center gap-4"
        >
          <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
          <span
            className="text-xs font-mono px-4 py-1.5 rounded-full"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-dim)',
            }}
          >
            4+ years of professional experience
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
        </motion.div>
      </div>
    </section>
  );
}
