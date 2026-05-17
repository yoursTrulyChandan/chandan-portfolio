'use client';
import { useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  target?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'outline' | 'ghost';
}

export default function MagneticButton({
  children, className, strength = 0.3, onClick, href, target, style, variant = 'primary',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px)`;
    }
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0,0)';
    if (contentRef.current) contentRef.current.style.transform = 'translate(0,0)';
  };

  const baseStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: '#fff',
          boxShadow: '0 0 24px rgba(0,212,255,0.35)',
          border: 'none',
        }
      : variant === 'outline'
      ? {
          background: 'transparent',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary)',
        }
      : {
          background: 'rgba(255,255,255,0.05)',
          color: 'var(--color-text-muted)',
          border: '1px solid var(--color-border)',
        };

  const Tag = href ? 'a' : 'button';

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)', display: 'inline-block' }}
    >
      <motion.div whileTap={{ scale: 0.95 }}>
        <Tag
          href={href}
          target={target}
          onClick={onClick}
          className={cn('inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all', className)}
          style={{ ...baseStyle, ...style }}
        >
          <span
            ref={contentRef}
            style={{ transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)', display: 'contents' }}
          >
            {children}
          </span>
        </Tag>
      </motion.div>
    </div>
  );
}
