'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { ExternalLink, Code2, Star, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowCard from '@/components/ui/GlowCard';
import TechBadge from '@/components/ui/TechBadge';
import { projects } from '@/config/data';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Filter config ─────────────────────────────────────────────────────────────
const FILTER_TABS = ['All', 'Featured', 'Dashboard', 'Web App', 'Mobile', 'Tool'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

// ─── Animation variants ────────────────────────────────────────────────────────
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 28, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
  exit: {
    opacity: 0, y: -18, scale: 0.96,
    transition: { duration: 0.25 },
  },
};

// ─── Category badge colors ─────────────────────────────────────────────────────
const categoryColors: Record<string, string> = {
  'Full Stack': '#00d4ff',
  Dashboard:   '#7c3aed',
  Mobile:      '#f97316',
  'Web App':   '#10b981',
  Tool:        '#8b5cf6',
  Product:     '#14b8a6',
};

// ─── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  featured,
}: {
  project: (typeof projects)[number];
  featured: boolean;
}) {
  const catColor = categoryColors[project.category] ?? project.color;

  return (
    <motion.div
      variants={cardVariants}
      layout
      className={featured ? 'md:col-span-2' : ''}
    >
      <GlowCard
        glowColor={project.color}
        tilt={!featured}
        className="h-full flex flex-col"
      >
        {/* Color-coded top stripe */}
        <div
          className="h-1 w-full rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${project.color}, ${project.color}55)`,
          }}
        />

        <div className={`flex flex-col flex-1 ${featured ? 'md:flex-row' : ''}`}>
          {/* Main content */}
          <div className="flex-1 p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category badge */}
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider"
                  style={{
                    background: `${catColor}15`,
                    border: `1px solid ${catColor}35`,
                    color: catColor,
                  }}
                >
                  {project.category}
                </span>
                {project.featured && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
                    style={{
                      background: 'rgba(245,158,11,0.12)',
                      border: '1px solid rgba(245,158,11,0.3)',
                      color: '#f59e0b',
                    }}
                  >
                    <Star size={9} strokeWidth={2.5} />
                    Featured
                  </span>
                )}
              </div>

              {/* Action links — only shown when URLs are available */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {project.live && (
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Live demo"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      background: `${project.color}15`,
                      border: `1px solid ${project.color}30`,
                      color: project.color,
                    }}
                  >
                    <ExternalLink size={13} />
                  </motion.a>
                )}
                {project.repo && (
                  <motion.a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Source code"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <Code2 size={13} />
                  </motion.a>
                )}
              </div>
            </div>

            {/* Title */}
            <h3
              className={`font-bold mb-2 ${featured ? 'text-xl' : 'text-base'}`}
              style={{ color: 'var(--color-text)' }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {project.description}
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {project.tech.map((t) => (
                <TechBadge key={t} name={t} color={project.color} />
              ))}
            </div>
          </div>

          {/* Featured projects get a decorative right panel on desktop */}
          {featured && (
            <div
              className="hidden md:flex w-48 flex-shrink-0 flex-col items-center justify-center p-6 relative overflow-hidden"
              style={{ borderLeft: '1px solid var(--color-border)' }}
            >
              {/* Decorative glow orb */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-32 h-32 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${project.color}30 0%, transparent 70%)`,
                  filter: 'blur(12px)',
                }}
              />
              {/* Inner hex shape */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="relative w-16 h-16"
                style={{
                  clipPath: 'polygon(50% 0%,93.3% 25%,93.3% 75%,50% 100%,6.7% 75%,6.7% 25%)',
                  background: `linear-gradient(135deg, ${project.color}40, ${project.color}15)`,
                  border: `1px solid ${project.color}30`,
                }}
              />
              <span
                className="relative mt-3 text-[10px] font-mono text-center"
                style={{ color: project.color, opacity: 0.7 }}
              >
                Featured
                <br />
                Project
              </span>
            </div>
          )}
        </div>
      </GlowCard>
    </motion.div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [showAll, setShowAll]           = useState(false);
  const tabsRef  = useRef<HTMLDivElement>(null);
  const gridRef  = useRef<HTMLDivElement>(null);
  const tabsInView = useInView(tabsRef, { once: true, margin: '-5%' });

  // Filter logic
  const filtered = projects.filter((p) => {
    if (activeFilter === 'All')      return true;
    if (activeFilter === 'Featured') return p.featured;
    return p.category === activeFilter;
  });

  // Decide what to show: always show featured first; non-featured hidden until showAll
  const featuredItems     = filtered.filter((p) => p.featured);
  const nonFeaturedItems  = filtered.filter((p) => !p.featured);
  const visibleItems      = showAll ? filtered : [...featuredItems, ...nonFeaturedItems.slice(0, 0)];
  const hiddenCount       = nonFeaturedItems.length;

  // When user switches filter, collapse showAll
  const handleFilter = (tab: FilterTab) => {
    setActiveFilter(tab);
    setShowAll(false);
  };

  return (
    <section
      id="projects"
      className="relative py-28 overflow-hidden"
      style={{ background: 'var(--color-bg-alt, var(--color-bg))' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(0,212,255,0.04) 0%, transparent 70%),' +
            'radial-gradient(ellipse 50% 40% at 80% 70%, rgba(124,58,237,0.05) 0%, transparent 70%)',
        }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          eyebrow="Portfolio"
          title="Projects & Work"
          subtitle="A selection of products, platforms, and tools built across four companies."
        />

        {/* ── Filter tabs ──────────────────────────────────────────── */}
        <motion.div
          ref={tabsRef}
          initial={{ opacity: 0, y: 16 }}
          animate={tabsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
          role="tablist"
          aria-label="Project filters"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            const count = tab === 'All'
              ? projects.length
              : tab === 'Featured'
              ? projects.filter((p) => p.featured).length
              : projects.filter((p) => p.category === tab).length;

            if (count === 0 && tab !== 'All' && tab !== 'Featured') return null;

            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleFilter(tab)}
                className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 focus-visible:outline-none"
                style={{
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  border: `1px solid ${isActive ? 'rgba(0,212,255,0.35)' : 'var(--color-border)'}`,
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="project-active-tab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.25)' }}
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                  />
                )}
                <span className="relative z-10">
                  {tab}
                  {count > 0 && (
                    <span
                      className="ml-1.5 text-[10px] font-mono opacity-60"
                      style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-dim)' }}
                    >
                      {count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Projects grid ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            ref={gridRef}
            key={activeFilter}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleItems.length === 0 ? (
              <motion.div
                variants={cardVariants}
                className="md:col-span-2 lg:col-span-3 text-center py-20"
                style={{ color: 'var(--color-text-dim)' }}
              >
                <p className="text-base">No projects in this category yet.</p>
              </motion.div>
            ) : (
              visibleItems.map((project) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  featured={project.featured && (activeFilter === 'All' || activeFilter === 'Featured')}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Show all / collapse toggle ─────────────────────────── */}
        <AnimatePresence>
          {hiddenCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mt-10"
            >
              <motion.button
                onClick={() => setShowAll((v) => !v)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {showAll ? (
                  <>
                    <ChevronUp size={15} />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown size={15} />
                    Show {hiddenCount} more project{hiddenCount !== 1 ? 's' : ''}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom stats strip ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mt-16 pt-8"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          {[
            { label: 'Total Projects',    value: projects.length },
            { label: 'Featured',          value: projects.filter((p) => p.featured).length },
            { label: 'Categories',        value: new Set(projects.map((p) => p.category)).size },
            { label: 'Technologies Used', value: new Set(projects.flatMap((p) => p.tech)).size },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl font-black tabular-nums"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}
              </div>
              <div className="text-xs mt-0.5 font-medium" style={{ color: 'var(--color-text-dim)' }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
