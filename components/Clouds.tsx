import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWeather } from '@/hooks/weather';
import { CLOUD_PRESETS } from '@/constants/clouds';

const drift = (s: number, e: number) => keyframes`
  0%   { transform: translateX(${s}vw); }
  100% { transform: translateX(${e}vw); }
`;

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
      const scale = 5 + Math.random() * 4; 
      const opacity = 0.2 + Math.random() * 0.1;

      return {
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