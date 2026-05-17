'use client';
import { useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tilt?: boolean;
  style?: React.CSSProperties;
}

export default function GlowCard({ children, className, glowColor = '#00d4ff', tilt = true, style }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update glow position
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, ${glowColor}18, transparent 70%)`;
    }

    // 3D tilt
    if (tilt) {
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    }
  };

  const onMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    if (glowRef.current) glowRef.current.style.background = 'transparent';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn('relative rounded-2xl overflow-hidden border', className)}
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        ...style,
      }}
    >
      {/* Glow layer */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        style={{ transition: 'background 0.1s' }}
      />
      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-0" />
      <div className="relative z-20">{children}</div>
    </div>
  );
}
