// components/CloudLayer.tsx
import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWeather } from '@/hooks/weather';

// NEW: A set of pre-designed, artistic cloud paths.
const CLOUD_PRESETS = [
  'M15.4,26.5c-5.8,0-10.5-4.7-10.5-10.5c0-5.8,4.7-10.5,10.5-10.5c2.1,0,4.1,0.6,5.8,1.7c1.3-3.6,4.8-6.2,8.8-6.2c5.2,0,9.5,4.2,9.5,9.5c0,0.5,0,1-0.1,1.5c3.2-0.2,6.1,1.8,7.1,4.7c1,2.9,0.1,6.2-2.1,8.1c-2.2,1.9-5.2,2.3-7.9,1.2C35.2,25.2,33.3,26.5,31.2,26.5H15.4z',
  'M45.9,23.5c-4.9,0-8.9-4-8.9-8.9s4-8.9,8.9-8.9c1.8,0,3.5,0.5,4.9,1.4c1.1-3.1,4.1-5.3,7.5-5.3c4.5,0,8.1,3.6,8.1,8.1c0,0.4,0,0.9-0.1,1.3c2.7-0.2,5.2,1.5,6,4c0.8,2.5,0.1,5.2-1.8,6.9c-1.9,1.6-4.4,2-6.7,1C55,22.3,53.5,23.5,51.8,23.5H45.9z',
  'M26.7,21.3c-3.7,0-6.7-3-6.7-6.7s3-6.7,6.7-6.7c1.4,0,2.6,0.4,3.7,1.1c0.8-2.3,3.1-3.9,5.6-3.9c3.4,0,6.1,2.7,6.1,6.1c0,0.3,0,0.6-0.1,0.9c2.1-0.1,3.9,1.1,4.5,3c0.6,1.9,0,4-1.3,5.2c-1.4,1.2-3.3,1.5-5,0.8C33.5,20.5,32.4,21.3,31.1,21.3H26.7z',
];

/* build drift animation on‑the‑fly */
const drift = (s: number, e: number) => keyframes`
  0%   { transform: translateX(${s}vw); }
  100% { transform: translateX(${e}vw); }
`;

/* layer under branches, over sky */
const Layer = styled.svg`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
`;

const Cloud = styled.path<{
  dur: number;
  delay: number;
  op: number;
  s: number;
  e: number;
}>`
  fill: white;
  opacity: ${p => p.op};
  animation: ${p => drift(p.s, p.e)} ${p => p.dur}s linear infinite;
  animation-delay: ${p => p.delay}s;
`;

const CloudLayer: React.FC = () => {
  const weather = useWeather();

  const clouds = useMemo(() => {
    if (weather?.kind !== 'clouds') return [];
    
    return Array.from({ length: 100 }).map(() => {
      const start =  Math.random() * 120;
      const end = start > 50 ? -20 : 120;
      const dur = 2500 + Math.random() * 500;
      const delay = -Math.random() * dur;
      const yPos = -7 + Math.random() * 6;
      const scale = 5 + Math.random() * 4; // Scale the entire shape
      const opacity = 0.2 + Math.random() * 0.1;

      return {
        // Randomly select one of the preset paths
        path: CLOUD_PRESETS[Math.floor(Math.random() * CLOUD_PRESETS.length)],
        start, end, dur, delay, yPos, scale, opacity
      };
    });
  }, [weather?.kind]);

  if (clouds.length === 0) return null;

  return (
    <Layer viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" overflow="hidden">
      {clouds.map((c, i) => (
        <g 
          key={i} 
          // The transform now also includes scaling
          transform={`translate(0, ${c.yPos * 10}) scale(${c.scale})`}
          style={{ transformOrigin: 'top left' }}
        >
          <Cloud
            d={c.path}
            s={c.start}
            e={c.end}
            dur={c.dur}
            delay={c.delay}
            op={c.opacity}
            style={{ filter: 'blur(1px)' }}
          />
        </g>
      ))}
    </Layer>
  );
};

export default CloudLayer;