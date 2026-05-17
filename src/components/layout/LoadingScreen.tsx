'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const lines = [
  '> Initializing portfolio...',
  '> Loading components... ✓',
  '> Compiling shaders... ✓',
  '> Mounting experience... ✓',
  '> Ready.',
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let lineIndex = 0;
    const showNextLine = () => {
      if (lineIndex < lines.length) {
        setVisibleLines((prev) => [...prev, lineIndex]);
        setProgress(Math.round(((lineIndex + 1) / lines.length) * 100));
        lineIndex++;
        setTimeout(showNextLine, lineIndex === lines.length ? 400 : 280);
      } else {
        setTimeout(() => setDone(true), 300);
        setTimeout(onComplete, 700);
      }
    };
    setTimeout(showNextLine, 300);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loading"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ background: 'var(--color-bg)' }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(var(--color-primary) 1px, transparent 1px),
                linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative w-full max-w-md px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <span
                className="font-mono text-4xl font-bold"
                style={{ color: 'var(--color-primary)', textShadow: '0 0 30px var(--color-primary)' }}
              >
                {'<CN />'}
              </span>
            </motion.div>

            {/* Terminal window */}
            <div
              className="rounded-xl overflow-hidden border"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border-light)',
                boxShadow: '0 0 60px rgba(0, 212, 255, 0.1)',
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-alt)' }}
              >
                <span className="w-3 h-3 rounded-full bg-error opacity-80" />
                <span className="w-3 h-3 rounded-full bg-warning opacity-80" />
                <span className="w-3 h-3 rounded-full bg-success opacity-80" />
                <span className="ml-2 font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
                  portfolio ~ bash
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 min-h-[180px] font-mono text-sm space-y-1.5">
                {lines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={visibleLines.includes(i) ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.25 }}
                    style={{
                      color: i === lines.length - 1 && visibleLines.includes(i)
                        ? 'var(--color-primary)'
                        : 'var(--color-text-muted)',
                    }}
                  >
                    {visibleLines.includes(i) ? line : ''}
                    {visibleLines[visibleLines.length - 1] === i && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7 }}
                        className="inline-block ml-0.5 w-2 h-4 align-middle"
                        style={{ background: 'var(--color-primary)' }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mx-5 mb-5">
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                      boxShadow: '0 0 8px var(--color-primary)',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
                  <span>Chandan Nayak</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
