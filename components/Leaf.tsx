// components/FallingLeaves.tsx
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Matter from 'matter-js';

// --- SEASONAL LOGIC ---
type Season = 'Summer' | 'Monsoon' | 'Autumn' | 'Winter';

const SEASONAL_COLORS: Record<Season, string[]> = {
  Monsoon: [
    // darker emerald → jungle
    'linear-gradient(to bottom right, #1e8449, #196F3D)',   // was #2ecc71 → #27ae60
    'linear-gradient(to bottom right, #0a5e2eff, #1E8449)',   // was #82e0aa → #28b463
  ],
  Summer: [
    'linear-gradient(to bottom right, #1E8449, #145A32)',   // was #27ae60 → #1e8449
    'linear-gradient(to bottom right, #7DCEA0, #1E8449)',   // was #a9dfbf → #28b463
  ],
  Autumn: [
    '#d35400', '#c0392b', '#f1c40f', '#e67e22', '#d4ac0d',
  ],
  Winter: [
    '#e74c3c', '#f39c12', '#d35400',
  ],
};


const getCurrentSeason = (): Season => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Summer';
  if (month >= 5 && month <= 8) return 'Monsoon';
  if (month >= 9 && month <= 10) return 'Autumn';
  return 'Winter';
};

// --- STYLED COMPONENTS ---

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Leaf = styled.div<{ size: number; color: string }>`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
  width: ${p => p.size}px;
  height: ${p => p.size * 0.8}px;
  background: ${p => p.color};
  border-radius: 0 70% 0 70%;
`;

// --- MAIN COMPONENT ---

const FallingLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<{ id: number; size: number; color: string }[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  // Store the Matter.js engine and bodies in refs to persist them across renders
  const engineRef = useRef(Matter.Engine.create());
  const bodiesRef = useRef<Record<number, Matter.Body>>({});

  // Setup the physics world and event listeners
  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;
    // Set a small amount of gravity
    engine.gravity.y = 0.2;

    // Define the ground
    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 25, // Position below the screen
      window.innerWidth * 2,
      50,
      { isStatic: true }
    );
    Matter.Composite.add(world, [ground]);

    // Create the leaves and add them to the physics world
    const season = getCurrentSeason();
    const currentColors = SEASONAL_COLORS[season];
    const generatedLeaves = Array.from({ length: 5 }).map((_, i) => {
      const size = 15 + Math.random() * 20;
      const leafBody = Matter.Bodies.rectangle(
        Math.random() * window.innerWidth, // x
        -50 - Math.random() * 200,          // y (start above screen)
        size,                               // width
        size * 0.8,                         // height
        {
          restitution: 0.4, // Bounciness
          frictionAir: 0.1, // Air resistance for drifting
          angle: Math.random() * Math.PI * 2,
        }
      );
      bodiesRef.current[leafBody.id] = leafBody;
      Matter.Composite.add(world, leafBody);
      return {
        id: leafBody.id,
        size,
        color: currentColors[Math.floor(Math.random() * currentColors.length)],
      };
    });
    setLeaves(generatedLeaves);

    // --- Main Animation Loop ---
    let animationFrameId: number;
    const run = () => {
      Matter.Engine.update(engine, 1000 / 60);

      // Sync the DOM elements with the physics bodies
      if (sceneRef.current) {
        const leafElements = sceneRef.current.children;
        for (let i = 0; i < leafElements.length; i++) {
          const el = leafElements[i] as HTMLDivElement;
          const body = bodiesRef.current[parseInt(el.dataset.id || '', 10)];
          if (body) {
            el.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
          }
        }
      }
      animationFrameId = requestAnimationFrame(run);
    };
    run();
    
    // --- Click Handler for Wind Blast ---
    const handleBlast = (e: MouseEvent) => {
      const blastOrigin = { x: e.clientX, y: e.clientY };
      Object.values(bodiesRef.current).forEach(body => {
        const dx = body.position.x - blastOrigin.x;
        const dy = body.position.y - blastOrigin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250) {
          const forceMagnitude = (1 - distance / 250) * 0.1; // Adjust force as needed
          Matter.Body.applyForce(body, body.position, {
            x: (dx / distance) * forceMagnitude,
            y: (dy / distance) * forceMagnitude,
          });
        }
      });
    };
    window.addEventListener('click', handleBlast);
    
    // Cleanup function
    return () => {
      window.removeEventListener('click', handleBlast);
      cancelAnimationFrame(animationFrameId);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <Container ref={sceneRef}>
      {leaves.map(leaf => (
        <Leaf
          key={leaf.id}
          data-id={leaf.id} // Link DOM element to physics body
          size={leaf.size}
          color={leaf.color}
        />
      ))}
    </Container>
  );
};

export default FallingLeaves;