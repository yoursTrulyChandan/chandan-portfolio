'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const smoothProgress = useSpring(progress, { stiffness: 200, damping: 40 });

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-border">
      <motion.div
        className="h-full"
        style={{
          scaleX: smoothProgress,
          transformOrigin: '0%',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
          boxShadow: '0 0 8px var(--color-primary)',
        }}
      />
    </div>
  );
}
