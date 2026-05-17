'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;

      const target = e.target as HTMLElement;
      const isLink =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        window.getComputedStyle(target).cursor === 'pointer';

      const isTextEl =
        target.tagName === 'P' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'LI';

      setIsHovering(!!isLink);
      setIsText(!!isTextEl && !isLink);
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{ transition: 'none' }}
      >
        <motion.div
          animate={{
            width: isHovering ? 10 : isClicking ? 6 : 10,
            height: isHovering ? 10 : isClicking ? 6 : 10,
            background: isHovering ? 'var(--color-secondary)' : 'var(--color-primary)',
            opacity: 1,
          }}
          transition={{ duration: 0.15 }}
          className="rounded-full"
        />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform"
        style={{ transition: 'none' }}
      >
        <motion.div
          animate={{
            width: isHovering ? 48 : isText ? 2 : 36,
            height: isHovering ? 48 : isText ? 24 : 36,
            borderColor: isHovering ? 'var(--color-secondary)' : 'var(--color-primary)',
            borderRadius: isText ? '2px' : '50%',
            opacity: isClicking ? 0.4 : 0.5,
            scale: isClicking ? 0.8 : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="border"
          style={{
            boxShadow: isHovering
              ? '0 0 12px var(--color-secondary)'
              : '0 0 8px var(--color-primary)',
          }}
        />
      </div>
    </>
  );
}
