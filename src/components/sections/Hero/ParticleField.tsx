'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 1800;
const CONNECTION_DISTANCE = 80;

export default function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  // Generate random particles in a sphere
  const { positions, velocities, originalPositions } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 150 + Math.random() * 200;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      const z = r * Math.cos(phi) * 0.4 - 50;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions, velocities, originalPositions };
  }, []);

  // Pre-allocate line geometry buffer (max connections)
  const linePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 6 * 2), []);
  const lineColors = useMemo(() => new Float32Array(PARTICLE_COUNT * 6 * 2), []);

  // Track mouse
  useMemo(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    }
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();

    // Mouse influence (3D projection)
    const mx = mouse.current.x * 200;
    const my = mouse.current.y * 150;

    let lineCount = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];

      // Gentle float
      pos[i * 3] = ox + Math.sin(t * 0.3 + i * 0.01) * 3 + velocities[i * 3] * t * 2;
      pos[i * 3 + 1] = oy + Math.cos(t * 0.2 + i * 0.02) * 3 + velocities[i * 3 + 1] * t * 2;
      pos[i * 3 + 2] = oz + Math.sin(t * 0.15 + i * 0.03) * 2;

      // Mouse repulsion
      const dx = pos[i * 3] - mx;
      const dy = pos[i * 3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const force = (80 - dist) / 80 * 15;
        pos[i * 3] += (dx / dist) * force;
        pos[i * 3 + 1] += (dy / dist) * force;
      }
    }

    // Build connection lines (sample subset for performance)
    if (lineRef.current) {
      const stride = 4;
      for (let i = 0; i < PARTICLE_COUNT; i += stride) {
        for (let j = i + stride; j < PARTICLE_COUNT; j += stride) {
          if (lineCount >= linePositions.length / 6) break;
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            const alpha = 1 - Math.sqrt(d2) / CONNECTION_DISTANCE;
            const base = lineCount * 6;
            linePositions[base] = pos[i * 3];
            linePositions[base + 1] = pos[i * 3 + 1];
            linePositions[base + 2] = pos[i * 3 + 2];
            linePositions[base + 3] = pos[j * 3];
            linePositions[base + 4] = pos[j * 3 + 1];
            linePositions[base + 5] = pos[j * 3 + 2];
            lineColors[base] = 0;
            lineColors[base + 1] = alpha * 0.83;
            lineColors[base + 2] = alpha;
            lineColors[base + 3] = 0;
            lineColors[base + 4] = alpha * 0.83;
            lineColors[base + 5] = alpha;
            lineCount++;
          }
        }
      }
      const lineGeo = lineRef.current.geometry;
      (lineGeo.attributes.position.array as Float32Array).set(linePositions.subarray(0, lineCount * 6));
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineCount * 2);
      if (lineGeo.attributes.color) {
        (lineGeo.attributes.color.array as Float32Array).set(lineColors.subarray(0, lineCount * 6));
        lineGeo.attributes.color.needsUpdate = true;
      }
    }

    geo.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = t * 0.03;
  });

  return (
    <>
      {/* Particles */}
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          color="#00d4ff"
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Connections */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}
