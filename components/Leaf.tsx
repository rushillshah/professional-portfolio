// components/FallingLeaves.tsx
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Matter from 'matter-js';

type Season = 'Summer' | 'Monsoon' | 'Autumn' | 'Winter';

const SEASONAL_COLORS: Record<Season, string[]> = {
  Monsoon: [
    'linear-gradient(to bottom right, #1e8449, #196F3D)',
    'linear-gradient(to bottom right, #0a5e2e, #1E8449)',
  ],
  Summer: [
    'linear-gradient(to bottom right, #1E8449, #145A32)',
    'linear-gradient(to bottom right, #7DCEA0, #1E8449)',
  ],
  Autumn: ['#ff9f43', '#e67e22', '#d35400', '#c0392b', '#f1c40f'],
  Winter: ['#e74c3c', '#f39c12', '#d35400'],
};

const FALL_COLORS = ['#ffad60', '#ff8f3f', '#e6781f', '#d95f0e', '#f1c40f'];

const getCurrentSeason = (): Season => {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return 'Summer';
  if (m >= 5 && m <= 8) return 'Monsoon';
  if (m >= 9 && m <= 10) return 'Autumn';
  return 'Winter';
};

const Container = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
`;

const Leaf = styled.div<{ size: number; color: string }>`
  position: absolute;
  inset: 0 auto auto 0;
  width: ${p => p.size}px;
  height: ${p => p.size * 0.8}px;
  background: ${p => p.color};
  border-radius: 0 70% 0 70%;
  pointer-events: none;
  z-index: 2;
`;

interface Props {
  isFall?: boolean;
}

const FallingLeaves: React.FC<Props> = ({ isFall = false }) => {
  const [leaves, setLeaves] = useState<{ id: number; size: number; color: string }[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create());
  const bodiesRef = useRef<Record<number, Matter.Body>>({});
  const metaRef = useRef<Record<number, { phase: number; freq: number; amp: number; sPhase: number; sFreq: number; sAmp: number }>>(
    {}
  );
  const groundRef = useRef<Matter.Body | null>(null);
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;
    engine.gravity.y = isFall ? 0.14 : 0.18;

    if (!isFall) {
      const ground = Matter.Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight + 25,
        window.innerWidth * 2,
        50,
        { isStatic: true }
      );
      groundRef.current = ground;
      Matter.Composite.add(world, [ground]);
    }

    const palette = isFall ? FALL_COLORS : SEASONAL_COLORS[getCurrentSeason()];
    const count = isFall ? 16 : 5;

    const generated = Array.from({ length: count }).map(() => {
      const size = 16 + Math.random() * 18;
      const body = Matter.Bodies.rectangle(
        Math.random() * window.innerWidth,
        -60 - Math.random() * 220,
        size,
        size * 0.8,
        {
          restitution: 0.25,
          frictionAir: 0.03 + Math.random() * 0.03,
          angle: Math.random() * Math.PI * 2,
        }
      );
      bodiesRef.current[body.id] = body;
      metaRef.current[body.id] = {
        phase: Math.random() * Math.PI * 2,
        freq: 0.35 + Math.random() * 0.25,
        amp: (isFall ? 0.00008 : 0.00005) * (0.6 + Math.random() * 0.8),
        sPhase: Math.random() * Math.PI * 2,
        sFreq: 0.25 + Math.random() * 0.2,
        sAmp: 0.02 + Math.random() * 0.035,
      };
      Matter.Composite.add(world, body);
      return {
        id: body.id,
        size,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    });
    setLeaves(generated);

    let raf = 0;
    const resetBodyTop = (b: Matter.Body) => {
      Matter.Body.setPosition(b, {
        x: Math.random() * window.innerWidth,
        y: -60 - Math.random() * 220,
      });
      Matter.Body.setVelocity(b, { x: (Math.random() - 0.5) * 0.6, y: 0 });
      Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.02);
      Matter.Body.setAngle(b, Math.random() * Math.PI * 2);
    };

    const tick = (ts: number) => {
      const last = lastTsRef.current ?? ts;
      const delta = Math.min(40, ts - last);
      lastTsRef.current = ts;

      Matter.Engine.update(engine, delta);

      const t = ts / 1000;
      Object.values(bodiesRef.current).forEach(b => {
        const m = metaRef.current[b.id];
        if (!m) return;
        const wind = Math.sin(t * m.freq + m.phase) * m.amp * b.mass;
        Matter.Body.applyForce(b, b.position, { x: wind, y: 0 });
        const targetAV = Math.sin(t * m.sFreq + m.sPhase) * m.sAmp;
        const av = b.angularVelocity + (targetAV - b.angularVelocity) * 0.06;
        Matter.Body.setAngularVelocity(b, av);
        if (isFall) {
          const offY = b.position.y > window.innerHeight + 120;
          const offX = b.position.x < -100 || b.position.x > window.innerWidth + 100;
          if (offY || offX) resetBodyTop(b);
        }
      });

      const container = sceneRef.current;
      if (container) {
        const els = container.children as unknown as HTMLDivElement[];
        for (let i = 0; i < els.length; i++) {
          const el = els[i] as HTMLDivElement & { dataset: { id?: string } };
          const id = el.dataset.id ? parseInt(el.dataset.id, 10) : NaN;
          const body = bodiesRef.current[id];
          if (body) {
            el.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const handleBlast = (e: MouseEvent) => {
      const origin = { x: e.clientX, y: e.clientY };
      Object.values(bodiesRef.current).forEach(body => {
        const dx = body.position.x - origin.x;
        const dy = body.position.y - origin.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 260) {
          const mag = (1 - dist / 260) * 0.05;
          Matter.Body.applyForce(body, body.position, { x: (dx / dist) * mag, y: (dy / dist) * mag });
        }
      });
    };
    window.addEventListener('click', handleBlast);

    return () => {
      window.removeEventListener('click', handleBlast);
      cancelAnimationFrame(raf);
      if (groundRef.current) {
        Matter.Composite.remove(world, groundRef.current);
        groundRef.current = null;
      }
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      bodiesRef.current = {};
      metaRef.current = {};
      lastTsRef.current = null;
    };
  }, [isFall]);

  return (
    <Container ref={sceneRef}>
      {leaves.map(leaf => (
        <Leaf key={leaf.id} data-id={leaf.id} size={leaf.size} color={leaf.color} />
      ))}
    </Container>
  );
};

export default FallingLeaves;
