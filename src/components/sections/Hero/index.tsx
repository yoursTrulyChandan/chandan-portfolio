'use client';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, GitFork, Link2, Mail } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import { personal } from '@/config/data';

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false });

const ROLES = personal.roles;

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const roleRef = useRef(0);
  const charRef = useRef(0);
  const erasingRef = useRef(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const current = ROLES[roleRef.current];
      if (!erasingRef.current) {
        if (charRef.current < current.length) {
          charRef.current++;
          setDisplayed(current.slice(0, charRef.current));
          timeout = setTimeout(type, 70);
        } else {
          timeout = setTimeout(() => {
            erasingRef.current = true;
            type();
          }, 2200);
        }
      } else {
        if (charRef.current > 0) {
          charRef.current--;
          setDisplayed(current.slice(0, charRef.current));
          timeout = setTimeout(type, 35);
        } else {
          erasingRef.current = false;
          roleRef.current = (roleRef.current + 1) % ROLES.length;
          setRoleIndex(roleRef.current);
          timeout = setTimeout(type, 300);
        }
      }
    };
    timeout = setTimeout(type, 800);
    return () => clearTimeout(timeout);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 400], fov: 60 }}
          gl={{ antialias: false, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>

      {/* Radial gradient overlays */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(124,58,237,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 80% 20%, rgba(0,212,255,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }}
      />

      {/* Content */}
      <div className="relative z-[3] max-w-5xl mx-auto px-6 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 font-medium"
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--color-success)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
          Available for opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4"
        >
          <span style={{ color: 'var(--color-text)' }}>Chandan</span>
          <br />
          <span className="text-gradient">Nayak</span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="h-12 flex items-center justify-center mb-6"
        >
          <span
            className="font-mono text-2xl md:text-3xl font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            {displayed}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="inline-block ml-0.5 w-0.5 h-8 align-middle"
              style={{ background: 'var(--color-primary)' }}
            />
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--color-text-muted)' }}
        >
          4+ years crafting pixel-perfect, performant web apps in React & Next.js.
          <br />
          Currently at{' '}
          <span style={{ color: 'var(--color-primary)' }}>Molecule Ventures</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <MagneticButton
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '14px 32px', fontSize: '15px' }}
          >
            View Projects
          </MagneticButton>
          <MagneticButton
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            variant="outline"
            style={{ padding: '14px 32px', fontSize: '15px' }}
          >
            Get In Touch
          </MagneticButton>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex items-center justify-center gap-5"
        >
          {[
            { icon: GitFork, href: personal.github, label: 'GitHub' },
            { icon: Link2, href: personal.linkedin, label: 'LinkedIn' },
            { icon: Mail, href: `mailto:${personal.email}`, label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={label}
              className="p-3 rounded-xl border transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-muted)',
                background: 'var(--color-surface)',
              }}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2"
        style={{ color: 'var(--color-text-dim)' }}
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
