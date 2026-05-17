'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personal } from '@/config/data';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#game', label: 'Play' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight active section via IntersectionObserver
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive('#' + id); },
        { rootMargin: '-40% 0px -50% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-[90]"
      style={{
        paddingTop: '8px',
        transition: 'all 0.3s',
      }}
    >
      <div
        className="mx-auto max-w-6xl px-6"
        style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
      >
        <nav
          className="flex items-center justify-between rounded-2xl px-6 py-3"
          style={{
            background: scrolled ? 'rgba(10, 15, 30, 0.85)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            border: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
            transition: 'all 0.4s',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono font-bold text-xl"
            style={{ color: 'var(--color-primary)', textShadow: '0 0 20px var(--color-primary)' }}
          >
            {'<CN />'}
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                onMouseEnter={() => setHovered(link.href)}
                onMouseLeave={() => setHovered(null)}
                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  color:
                    active === link.href
                      ? 'var(--color-primary)'
                      : hovered === link.href
                      ? 'var(--color-text)'
                      : 'var(--color-text-muted)',
                }}
              >
                {hovered === link.href && (
                  <motion.div
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'var(--color-border)' }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                {active === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <motion.a
            href={`mailto:${personal.email}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              color: '#fff',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            }}
          >
            Hire Me
          </motion.a>

          {/* Mobile burger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: mobileOpen && i === 0 ? 45 : mobileOpen && i === 2 ? -45 : 0,
                  y: mobileOpen && i === 0 ? 8 : mobileOpen && i === 2 ? -8 : 0,
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
                className="w-6 h-0.5 rounded-full"
                style={{ background: 'var(--color-primary)' }}
              />
            ))}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mx-6 mt-2 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10, 15, 30, 0.95)',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleNav(link.href)}
                className="w-full text-left px-6 py-4 text-sm font-medium border-b last:border-b-0"
                style={{
                  color: active === link.href ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
