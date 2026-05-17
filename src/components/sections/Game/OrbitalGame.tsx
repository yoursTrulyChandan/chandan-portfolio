'use client';
import { useRef, useEffect, useState, useCallback, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ─────────────────────────────────────────────────────────────────
interface Vec2 { x: number; y: number }
interface CometState extends Vec2 { vx: number; vy: number }
interface Well extends Vec2 { type: 'attract' | 'repel'; id: number }
interface TrailPoint extends Vec2 {}
interface Star extends Vec2 { collected: boolean; twinklePhase: number }
interface BgStar extends Vec2 { r: number; opacity: number }
interface BlackHole extends Vec2 { radius: number }

interface Level {
  comet: CometState
  stars: Array<Vec2 & { twinklePhase: number }>
  blackHoles: BlackHole[]
  wellLimit: number
  hint: string
}

// ─── Constants ──────────────────────────────────────────────────────────────
const CW = 700, CH = 450;
const G_CONST = 3200;
const TRAIL_MAX = 120;
const STAR_R = 22;
const BH_KILL_MULT = 1.1;
const MAX_SPEED = 380;

// ─── Levels ─────────────────────────────────────────────────────────────────
const LEVELS: Level[] = [
  {
    comet: { x: 60, y: 225, vx: 55, vy: -10 },
    stars: [{ x: 400, y: 100, twinklePhase: 0 }, { x: 600, y: 340, twinklePhase: 1.5 }],
    blackHoles: [],
    wellLimit: 3,
    hint: 'Left-click to place a gravity well (+). Shift+click for repulsor (−). Click a well to remove it.',
  },
  {
    comet: { x: 60, y: 370, vx: 70, vy: -40 },
    stars: [{ x: 340, y: 70, twinklePhase: 0 }, { x: 600, y: 180, twinklePhase: 1.2 }, { x: 500, y: 370, twinklePhase: 2.5 }],
    blackHoles: [{ x: 280, y: 235, radius: 18 }],
    wellLimit: 4,
    hint: 'Watch out — black holes destroy your comet. Use repulsors to route around them.',
  },
  {
    comet: { x: 80, y: 80, vx: 38, vy: 35 },
    stars: [{ x: 615, y: 80, twinklePhase: 0 }, { x: 615, y: 370, twinklePhase: 1 }, { x: 350, y: 225, twinklePhase: 2 }],
    blackHoles: [{ x: 215, y: 225, radius: 20 }, { x: 490, y: 225, radius: 18 }],
    wellLimit: 4,
    hint: 'Two black holes block the center. Route your comet around both.',
  },
  {
    comet: { x: 60, y: 225, vx: 30, vy: 50 },
    stars: [{ x: 355, y: 50, twinklePhase: 0.3 }, { x: 635, y: 145, twinklePhase: 1.3 }, { x: 635, y: 305, twinklePhase: 2.3 }, { x: 355, y: 400, twinklePhase: 3.3 }],
    blackHoles: [{ x: 200, y: 115, radius: 16 }, { x: 200, y: 335, radius: 16 }, { x: 460, y: 225, radius: 20 }],
    wellLimit: 5,
    hint: 'Four stars, three black holes — creative routing is the only way out.',
  },
  {
    comet: { x: 60, y: 70, vx: 78, vy: 18 },
    stars: [{ x: 630, y: 60, twinklePhase: 0 }, { x: 630, y: 390, twinklePhase: 1 }, { x: 350, y: 225, twinklePhase: 2 }, { x: 175, y: 380, twinklePhase: 3 }],
    blackHoles: [{ x: 355, y: 100, radius: 18 }, { x: 355, y: 350, radius: 18 }, { x: 155, y: 225, radius: 16 }, { x: 550, y: 225, radius: 16 }],
    wellLimit: 5,
    hint: 'Master level — four black holes, four stars. Every placement decides fate.',
  },
];

// ─── Drawing Functions ───────────────────────────────────────────────────────
function drawBg(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, CW, CH);
  bg.addColorStop(0, '#070c1a');
  bg.addColorStop(1, '#0a1020');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CW, CH);
  ctx.strokeStyle = 'rgba(30, 48, 90, 0.22)';
  ctx.lineWidth = 0.5;
  for (let x = 40; x < CW; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
  }
  for (let y = 40; y < CH; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
  }
}

function drawBgStars(ctx: CanvasRenderingContext2D, stars: BgStar[], t: number) {
  stars.forEach(s => {
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.7 + s.x * 0.08 + s.y * 0.05));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.opacity * tw})`;
    ctx.fill();
  });
}

function drawTrail(ctx: CanvasRenderingContext2D, trail: TrailPoint[]) {
  trail.forEach((pt, i) => {
    const p = (i + 1) / trail.length;
    const alpha = p * p * 0.65;
    const r = 0.8 + p * 2.8;
    const g = Math.round(180 + 32 * p);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,${g},255,${alpha})`;
    ctx.fill();
  });
}

function drawComet(ctx: CanvasRenderingContext2D, pos: Vec2) {
  [{ r: 24, a: 0.03 }, { r: 14, a: 0.1 }, { r: 8, a: 0.28 }, { r: 4, a: 0.75 }].forEach(({ r, a }) => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${a})`;
    ctx.fill();
  });
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

function drawStar(ctx: CanvasRenderingContext2D, star: Star, t: number) {
  if (star.collected) return;
  const tw = 0.82 + 0.18 * Math.sin(t * 3 + star.twinklePhase);
  const r = 9 * tw;
  ctx.save();
  ctx.translate(star.x, star.y);
  ctx.shadowColor = 'rgba(255, 220, 0, 0.9)';
  ctx.shadowBlur = 14 * tw;
  ctx.fillStyle = `rgba(255, 218, 0, ${tw})`;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const ang = (i * Math.PI) / 6 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.42;
    i === 0 ? ctx.moveTo(rad * Math.cos(ang), rad * Math.sin(ang))
             : ctx.lineTo(rad * Math.cos(ang), rad * Math.sin(ang));
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBlackHole(ctx: CanvasRenderingContext2D, bh: BlackHole, t: number) {
  const aura = ctx.createRadialGradient(bh.x, bh.y, bh.radius * 0.8, bh.x, bh.y, bh.radius * 3.2);
  aura.addColorStop(0, 'rgba(60,0,110,0.65)');
  aura.addColorStop(0.5, 'rgba(30,0,60,0.2)');
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(bh.x, bh.y, bh.radius * 3.2, 0, Math.PI * 2);
  ctx.fillStyle = aura;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(bh.x, bh.y, bh.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(bh.x, bh.y, bh.radius * 1.9, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(140, 40, 240, 0.38)';
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2 + t * 1.9;
    const pr = bh.radius * 1.85 + Math.sin(t * 4 + i * 1.3) * 2.5;
    const px = bh.x + pr * Math.cos(ang);
    const py = bh.y + pr * Math.sin(ang) * 0.6;
    const pa = 0.45 + 0.55 * Math.sin(t * 5 + i);
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(160,55,255,${pa})`;
    ctx.fill();
  }
}

function drawWell(ctx: CanvasRenderingContext2D, w: Well, t: number) {
  const [r, g, b] = w.type === 'attract' ? [0, 212, 255] : [249, 115, 22];
  const pulse = 0.86 + 0.14 * Math.sin(t * 3.5 + w.id * 1.7);

  ctx.save();
  ctx.setLineDash([4, 7]);
  ctx.beginPath();
  ctx.arc(w.x, w.y, 62, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${r},${g},${b},0.1)`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 3; i++) {
    const phase = ((t * 0.55 + i / 3) % 1);
    const ringR = 18 + phase * 54;
    const alpha = (1 - phase) * 0.22;
    ctx.beginPath();
    ctx.arc(w.x, w.y, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const cr = 17 * pulse;
  const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, cr * 1.6);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.2)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.beginPath();
  ctx.arc(w.x, w.y, cr * 1.6, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w.x, w.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fill();

  ctx.fillStyle = w.type === 'attract' ? '#000' : '#fff';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(w.type === 'attract' ? '+' : '−', w.x, w.y);
  ctx.restore();
}

function drawGhostWell(ctx: CanvasRenderingContext2D, pos: Vec2, type: 'attract' | 'repel') {
  const [r, g, b] = type === 'attract' ? [0, 212, 255] : [249, 115, 22];
  ctx.save();
  ctx.globalAlpha = 0.45;
  const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 26);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.7)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 26, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, start: Vec2, vel: { vx: number; vy: number }) {
  const speed = Math.hypot(vel.vx, vel.vy);
  const ang = Math.atan2(vel.vy, vel.vx);
  const len = Math.min(speed * 0.8, 88);
  const ex = start.x + Math.cos(ang) * len;
  const ey = start.y + Math.sin(ang) * len;
  ctx.save();
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.setLineDash([]);
  const hl = 10;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - hl * Math.cos(ang - 0.45), ey - hl * Math.sin(ang - 0.45));
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - hl * Math.cos(ang + 0.45), ey - hl * Math.sin(ang + 0.45));
  ctx.stroke();
  ctx.restore();
}

// ─── Component ──────────────────────────────────────────────────────────────
type Phase = 'setup' | 'launched' | 'won' | 'lost' | 'complete';

export default function OrbitalGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('setup');
  const [levelIdx, setLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [wellsLeft, setWellsLeft] = useState(LEVELS[0].wellLimit);
  const [collectedCount, setCollectedCount] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const phaseRef = useRef<Phase>('setup');
  const cometRef = useRef<CometState>({ ...LEVELS[0].comet });
  const trailRef = useRef<TrailPoint[]>([]);
  const wellsRef = useRef<Well[]>([]);
  const starsRef = useRef<Star[]>(LEVELS[0].stars.map(s => ({ ...s, collected: false })));
  const bgStarsRef = useRef<BgStar[]>([]);
  const tRef = useRef(0);
  const prevTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const wellIdRef = useRef(0);
  const mouseRef = useRef<Vec2 | null>(null);
  const isShiftRef = useRef(false);
  const launchTimeRef = useRef(0);
  const levelIdxRef = useRef(0);

  // Generate background stars once
  useEffect(() => {
    bgStarsRef.current = Array.from({ length: 160 }, () => ({
      x: Math.random() * CW,
      y: Math.random() * CH,
      r: 0.4 + Math.random() * 1.4,
      opacity: 0.15 + Math.random() * 0.5,
    }));

    const saved = parseInt(localStorage.getItem('orbital_best') ?? '0', 10);
    if (!isNaN(saved)) setBestScore(saved);
  }, []);

  const resetLevel = useCallback((idx: number) => {
    const lvl = LEVELS[idx];
    levelIdxRef.current = idx;
    cometRef.current = { ...lvl.comet };
    trailRef.current = [];
    wellsRef.current = [];
    starsRef.current = lvl.stars.map(s => ({ ...s, collected: false }));
    phaseRef.current = 'setup';
    scoreRef.current = 0;
    setPhase('setup');
    setWellsLeft(lvl.wellLimit);
    setScore(0);
    setCollectedCount(0);
  }, []);

  const getCanvasPos = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (CW / rect.width),
      y: (e.clientY - rect.top) * (CH / rect.height),
    };
  }, []);

  const handleClick = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'setup') return;
    const { x, y } = getCanvasPos(e);
    const isRepel = e.shiftKey;
    const lvl = LEVELS[levelIdxRef.current];

    const hitIdx = wellsRef.current.findIndex(w => Math.hypot(w.x - x, w.y - y) < 22);
    if (hitIdx !== -1) {
      wellsRef.current = wellsRef.current.filter((_, i) => i !== hitIdx);
      setWellsLeft(lvl.wellLimit - wellsRef.current.length);
      return;
    }

    if (wellsRef.current.length >= lvl.wellLimit) return;
    wellsRef.current = [...wellsRef.current, { x, y, type: isRepel ? 'repel' : 'attract', id: wellIdRef.current++ }];
    setWellsLeft(lvl.wellLimit - wellsRef.current.length);
  }, [getCanvasPos]);

  const handleContextMenu = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (phaseRef.current !== 'setup') return;
    const { x, y } = getCanvasPos(e);
    const lvl = LEVELS[levelIdxRef.current];
    if (wellsRef.current.length >= lvl.wellLimit) return;
    wellsRef.current = [...wellsRef.current, { x, y, type: 'repel', id: wellIdRef.current++ }];
    setWellsLeft(lvl.wellLimit - wellsRef.current.length);
  }, [getCanvasPos]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current = getCanvasPos(e);
    isShiftRef.current = e.shiftKey;
  }, [getCanvasPos]);

  const handleMouseLeave = useCallback(() => { mouseRef.current = null; }, []);

  const launch = useCallback(() => {
    if (phaseRef.current !== 'setup') return;
    phaseRef.current = 'launched';
    launchTimeRef.current = tRef.current;
    setPhase('launched');
  }, []);

  const reset = useCallback(() => {
    const idx = levelIdxRef.current;
    const lvl = LEVELS[idx];
    cometRef.current = { ...lvl.comet };
    trailRef.current = [];
    starsRef.current = lvl.stars.map(s => ({ ...s, collected: false }));
    phaseRef.current = 'setup';
    scoreRef.current = 0;
    setPhase('setup');
    setScore(0);
    setCollectedCount(0);
  }, []);

  const nextLevel = useCallback(() => {
    const next = levelIdxRef.current + 1;
    const levelScore = scoreRef.current;
    if (next >= LEVELS.length) {
      const finalTotal = totalScore + levelScore;
      setBestScore(prev => {
        const newBest = Math.max(prev, finalTotal);
        localStorage.setItem('orbital_best', String(newBest));
        return newBest;
      });
      setTotalScore(finalTotal);
      phaseRef.current = 'complete';
      setPhase('complete');
      return;
    }
    setTotalScore(prev => prev + levelScore);
    setLevelIdx(next);
    resetLevel(next);
  }, [totalScore, resetLevel]);

  const restartAll = useCallback(() => {
    setTotalScore(0);
    setLevelIdx(0);
    resetLevel(0);
  }, [resetLevel]);

  // Main animation + physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    prevTimeRef.current = null;

    const frame = (timestamp: number) => {
      if (prevTimeRef.current === null) prevTimeRef.current = timestamp;
      const rawDt = Math.min((timestamp - prevTimeRef.current) / 1000, 0.05);
      prevTimeRef.current = timestamp;
      tRef.current += rawDt;

      const t = tRef.current;
      const phase = phaseRef.current;
      const comet = cometRef.current;
      const wells = wellsRef.current;
      const stars = starsRef.current;
      const idx = levelIdxRef.current;
      const lvl = LEVELS[idx];

      // ── Physics ───────────────────────────────────────────────────
      if (phase === 'launched') {
        for (let sub = 0; sub < 4; sub++) {
          const dt = rawDt / 4;
          wells.forEach(w => {
            const dx = w.x - comet.x;
            const dy = w.y - comet.y;
            const r = Math.max(Math.hypot(dx, dy), 22);
            const force = G_CONST / (r * r);
            const sign = w.type === 'attract' ? 1 : -1;
            comet.vx += sign * force * (dx / r) * dt;
            comet.vy += sign * force * (dy / r) * dt;
          });
          const speed = Math.hypot(comet.vx, comet.vy);
          if (speed > MAX_SPEED) { comet.vx = comet.vx / speed * MAX_SPEED; comet.vy = comet.vy / speed * MAX_SPEED; }
          comet.x += comet.vx * dt;
          comet.y += comet.vy * dt;
        }

        trailRef.current = [{ x: comet.x, y: comet.y }, ...trailRef.current.slice(0, TRAIL_MAX - 1)];

        // Star collection
        stars.forEach(star => {
          if (!star.collected && Math.hypot(star.x - comet.x, star.y - comet.y) < STAR_R) {
            star.collected = true;
            scoreRef.current += 100;
            setScore(s => s + 100);
            setCollectedCount(c => c + 1);
          }
        });

        // Win
        if (stars.every(s => s.collected)) {
          const timeBonus = Math.max(0, Math.round((30 - (t - launchTimeRef.current)) * 8));
          scoreRef.current += timeBonus;
          if (timeBonus > 0) setScore(s => s + timeBonus);
          phaseRef.current = 'won';
          setPhase('won');
        }

        // Lose
        const hitBH = lvl.blackHoles.some(bh => Math.hypot(bh.x - comet.x, bh.y - comet.y) < bh.radius * BH_KILL_MULT);
        const oob = comet.x < -30 || comet.x > CW + 30 || comet.y < -30 || comet.y > CH + 30;
        if (hitBH || oob) { phaseRef.current = 'lost'; setPhase('lost'); }
      }

      // ── Render ────────────────────────────────────────────────────
      drawBg(ctx);
      drawBgStars(ctx, bgStarsRef.current, t);
      lvl.blackHoles.forEach(bh => drawBlackHole(ctx, bh, t));
      wells.forEach(w => drawWell(ctx, w, t));

      if (phase === 'setup' && mouseRef.current) {
        const mp = mouseRef.current;
        const notNear = !wells.some(w => Math.hypot(w.x - mp.x, w.y - mp.y) < 22);
        if (notNear && wells.length < lvl.wellLimit) drawGhostWell(ctx, mp, isShiftRef.current ? 'repel' : 'attract');
      }

      stars.forEach(s => drawStar(ctx, s, t));
      if (phase !== 'setup') drawTrail(ctx, trailRef.current);
      if (phase === 'setup') drawArrow(ctx, lvl.comet, lvl.comet);
      drawComet(ctx, phase === 'setup' ? lvl.comet : comet);

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [levelIdx]);

  const lvl = LEVELS[levelIdx];
  const totalStars = lvl.stars.length;

  return (
    <div className="w-full max-w-[700px] mx-auto select-none">
      {/* HUD */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: 'var(--color-surface)', color: 'var(--color-text-dim)' }}>
            LVL {levelIdx + 1}/{LEVELS.length}
          </span>
          <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-primary)', textShadow: '0 0 10px var(--color-primary)' }}>
            {String(score).padStart(5, '0')} pts
          </span>
          {totalScore > 0 && (
            <span className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
              Total: {totalScore + score}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <span>⭐ {collectedCount}/{totalStars}</span>
          <span style={{ color: wellsLeft === 0 ? '#ef4444' : 'inherit' }}>
            {wellsLeft > 0 ? `${wellsLeft} wells left` : 'No wells left'}
          </span>
          {bestScore > 0 && <span style={{ color: 'var(--color-text-dim)' }}>Best: {bestScore}</span>}
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative rounded-2xl overflow-hidden scanline"
        style={{
          border: '1px solid var(--color-border-light)',
          boxShadow: '0 0 60px rgba(0,212,255,0.06), 0 0 120px rgba(124,58,237,0.04), inset 0 0 80px rgba(0,0,0,0.5)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ display: 'block', width: '100%', aspectRatio: `${CW}/${CH}` }}
        />

        {/* Overlay */}
        <AnimatePresence>
          {(phase === 'won' || phase === 'lost' || phase === 'complete') && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(7,12,26,0.78)', backdropFilter: 'blur(10px)' }}
            >
              <div className="text-center px-6">
                <div className="text-6xl mb-3">
                  {phase === 'complete' ? '🏆' : phase === 'won' ? '🎯' : '💥'}
                </div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: phase === 'lost' ? 'var(--color-error)' : 'var(--color-primary)' }}
                >
                  {phase === 'complete' ? 'Mission Complete!' : phase === 'won' ? 'Level Clear!' : 'Comet Destroyed'}
                </h3>
                <p className="font-mono text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
                  {phase === 'complete'
                    ? `Final Score: ${totalScore} pts`
                    : phase === 'won'
                    ? `+${score} pts · Level ${levelIdx + 1} cleared`
                    : 'Wells placed correctly? Try again.'}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  {phase === 'won' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={nextLevel}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff' }}
                    >
                      Next Level →
                    </motion.button>
                  )}
                  {phase === 'complete' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={restartAll}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: '#fff' }}
                    >
                      Play Again
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => resetLevel(levelIdx)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold border"
                    style={{ borderColor: 'var(--color-border-light)', color: 'var(--color-text-muted)' }}
                  >
                    {phase === 'lost' ? 'Try Again' : 'Replay'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-start justify-between mt-4 gap-3">
        <p className="text-xs leading-relaxed flex-1 pt-1" style={{ color: 'var(--color-text-dim)' }}>
          <span className="block" style={{ color: 'var(--color-text-muted)' }}>{lvl.hint}</span>
          <span className="mt-1 block opacity-60">
            Left-click: attractor (+) · Shift/Right-click: repulsor (−) · Click well: remove
          </span>
        </p>
        <div className="flex gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={reset}
            className="px-4 py-2 rounded-lg text-xs font-semibold border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface)' }}
          >
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={launch}
            disabled={phase !== 'setup'}
            className="px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-30"
            style={{
              background: phase === 'setup' ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'var(--color-border)',
              color: '#fff',
              boxShadow: phase === 'setup' ? '0 0 24px rgba(0,212,255,0.35)' : 'none',
            }}
          >
            Launch ▶
          </motion.button>
        </div>
      </div>
    </div>
  );
}
