// ============================================================
// SINGLE SOURCE OF TRUTH — change here, updates everywhere
// ============================================================

export const theme = {
  colors: {
    bg: '#0a0f1e',
    bgAlt: '#0d1526',
    surface: '#111827',
    surfaceAlt: '#1a2235',
    border: '#1e2d45',
    borderLight: '#263552',
    primary: '#00d4ff',       // Electric cyan
    primaryDim: '#00d4ff33',
    secondary: '#7c3aed',     // Vivid violet
    secondaryDim: '#7c3aed33',
    accent: '#f97316',        // Fire orange
    accentDim: '#f9731622',
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    textDim: '#64748b',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    white: '#ffffff',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
    primaryReverse: 'linear-gradient(135deg, #7c3aed 0%, #00d4ff 100%)',
    hero: 'radial-gradient(ellipse at 20% 50%, #7c3aed22 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #00d4ff18 0%, transparent 60%)',
    glow: 'radial-gradient(circle, #00d4ff33 0%, transparent 70%)',
    surface: 'linear-gradient(135deg, #111827 0%, #1a2235 100%)',
    card: 'linear-gradient(135deg, rgba(17,24,39,0.8) 0%, rgba(26,34,53,0.8) 100%)',
  },
  fonts: {
    sans: 'var(--font-inter)',
    mono: 'var(--font-jetbrains)',
  },
  animation: {
    spring: { type: 'spring' as const, stiffness: 120, damping: 20 },
    springStiff: { type: 'spring' as const, stiffness: 300, damping: 30 },
    smooth: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    fast: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    slow: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  blur: {
    sm: '8px',
    md: '16px',
    lg: '32px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '32px',
    full: '9999px',
  },
} as const;

export type Theme = typeof theme;
