import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

import { useCelestialPosition, TimeOfDay } from '../hooks/celestialPosition';
import { THEME } from '../constants/dynamicSky';
import { useWeather } from '@/hooks/weather';

const useWindowWidth = () => {
  const [w, setW] = useState(() => window.innerWidth);
  React.useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
};

const Reset = createGlobalStyle`html,body{margin:0;padding:0;width:100%;height:100%;}`;

const Sky = styled.div<{ bg: string }>`
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background: ${(p) => p.bg};
  transition: background 1.2s ease;
`;

const Svg = styled.svg`width: 100%; height: 100%;`;

const twinkle = keyframes`0%,100%{opacity:.6}50%{opacity:1}`;
const Star = styled.circle<{ d: string }>`
  animation: ${twinkle} 3s infinite ease-in-out;
  animation-delay: ${(p) => p.d};
`;

const Bar = styled.div`
  position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
  display: flex; gap: 1rem; padding: .6rem 1rem; border-radius: 8px;
  background: rgba(0,0,0,.35); backdrop-filter: blur(6px);
  font: 400 .9rem/1 sans-serif; color: #fff; z-index: 20;
  pointer-events: auto;
`;
const Dial = styled.input`width: 210px;`;

const Glow: React.FC<{ col: string }> = ({ col }) => {
  const R = 60;
  return (
    <g>
      <defs>
        <radialGradient id="cb"><stop offset="70%" stopColor={col} /><stop offset="100%" stopColor={col} /></radialGradient>
      </defs>
      <circle r={R * 4} fill={col} opacity={.1} />
      <circle r={R * 2.5} fill={col} opacity={.15} />
      <circle r={R} fill="url(#cb)" />
    </g>
  );
};

const DevControls: React.FC<{
  manual: number | null;
  setManual: (n: number | null) => void;
}> = ({ manual, setManual }) => {
  const live = new Date();
  const defaultVal = live.getHours() + live.getMinutes() / 60;
  return (
    <Bar>
      <span>{manual === null ? 'auto' : manual.toFixed(2) + ' h'}</span>
      <Dial
        type="range"
        min={0}
        max={23.99}
        step={0.25}
        value={manual ?? defaultVal}
        onChange={(e) => setManual(parseFloat(e.target.value))}
      />
      <button onClick={() => setManual(null)}>reset</button>
    </Bar>
  );
};

const StarsLayer: React.FC<{ opacity: number }> = ({ opacity }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: 150 }).map(() => ({
        cx: Math.random() * 100,
        cy: Math.random() * 80,
        r: Math.random() * 1 + .5,
        d: `${Math.random() * 5}s`,
      })),
    [],
  );
  return (
    <g style={{ opacity }}>
      {stars.map((s, i) => (
        <Star key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="#fff" d={s.d} />
      ))}
    </g>
  );
};

const DynamicSky: React.FC = () => {
  const [manual, setManual] = useState<number | null>(null);
  const weather = useWeather();
  const { timeOfDay, x, y, stars } = useCelestialPosition(manual);
  const { grad, glow, text } = THEME[timeOfDay];
  const isCloudy = weather?.kind === 'clouds';
  console.log('isCloudy:', isCloudy);
  const scale = useWindowWidth() / 1300;

  return (
    <>
      <Reset />
      <DevControls manual={manual} setManual={setManual} />
     
      <Sky bg={grad.at(-1)!}>
<Svg preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      {grad.map((c, i) => (
        <stop key={i} offset={`${(i / (grad.length - 1)) * 100}%`} stopColor={c} />
      ))}
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#sky)" />

  {/* {isCloudy && (
    <rect
      width="100%"
      height="100%"
      fill="#000"
      opacity="0.3"
    />
  )} */}

  <g style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
    <g style={{ transform: `translate(${x / scale}vw,${(y + 150) / scale}px)` }}>
      <Glow col={glow} />
    </g>
  </g>

  <StarsLayer opacity={stars} />
</Svg>
      </Sky>
    </>
  );
};

export default DynamicSky;
