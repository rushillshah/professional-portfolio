import styled from 'styled-components';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { FiSettings } from 'react-icons/fi';

const Dock = styled.div`
  position: fixed; top: 1rem; right: 1rem;
  z-index: 50; pointer-events: auto;
`;

const Panel = styled.div<{ day: boolean; open: boolean }>`
  --radius: 14px;
  position: relative;
  width: ${({ open }) => (open ? 'clamp(300px, 36vw, 420px)' : '46px')};
  height: ${({ open }) => (open ? 'calc(46px + var(--body-h, 0px))' : '46px')};
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,.15);
  background: rgba(0,0,0,.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
  transition:
    width 220ms cubic-bezier(.2,.8,.2,1),
    height 220ms cubic-bezier(.2,.8,.2,1),
    box-shadow 200ms ease,
    transform 200ms ease,
    background 200ms ease;
  will-change: width, height;
  transform: ${({ open }) => (open ? 'translateZ(0)' : 'translateZ(0) scale(0.99)')};
  box-shadow: ${({ open }) => (open ? '0 16px 40px rgba(0,0,0,.35)' : '0 2px 8px rgba(0,0,0,.12)')};
`;

const PanelHead = styled.div`
  height: 46px;
  display: grid; grid-template-columns: 46px 1fr auto; align-items: center;
`;

const Gear = styled.button`
  appearance: none; border: 0; margin: 0;
  width: 46px; height: 46px; border-radius: 14px 0 0 0;
  display: grid; place-items: center;
  color: white; background: transparent; cursor: pointer;
  svg { width: 20px; height: 20px; opacity: .9; transition: transform .18s ease; }
  &:hover svg { transform: rotate(22deg); }
`;

const HeadTitle = styled.span`
  font: 600 0.95rem/1 'Sono', sans-serif;
  color: white;
  opacity: .9;
`;

const Right = styled.div`display:flex;align-items:center;gap:.4rem;margin-right:.5rem;`;

const HeadHint = styled.button`
  appearance: none; border: 0; margin: 0;
  font: 500 .8rem/1 'Sono', sans-serif;
  color: white;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  padding: .3rem .6rem;
  cursor: pointer;
  transition: transform .12s ease, background .12s ease;
  &:hover { transform: translateY(-1px); }
`;

const CloseBtn = styled.button`
  appearance: none; border: 0; margin: 0;
  width: 28px; height: 28px; display: grid; place-items: center;
  border-radius: 8px; color: white;
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
  cursor: pointer; transition: transform .12s ease, background .12s ease;
  &:hover { transform: translateY(-1px); background: rgba(255,255,255,.2); }
`;

const PanelBody = styled.div<{ open: boolean }>`
  overflow: hidden;
  padding: ${({ open }) => (open ? '0 .75rem .75rem' : '0 .75rem 0')};
  max-height: ${({ open }) => (open ? 'var(--body-h, 0px)' : '0px')};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? '0' : '-4px')});
  transition: max-height 240ms cubic-bezier(.2,.8,.2,1), opacity 180ms ease, transform 220ms ease;
  will-change: max-height, opacity, transform;
`;

const Row = styled.div`
  display: grid; gap: .6rem;
  padding: .6rem .25rem .2rem;
  border-top: 1px dashed rgba(255,255,255,.15);
`;

const Label = styled.div`
  font: 600 .85rem/1 'Sono', sans-serif;
  color: white; display: flex; align-items: center; justify-content: space-between;
`;

const Value = styled.span` color: white; font-weight: 500; margin-left: .5rem; `;

const Dial = styled.input<{ day: boolean }>`
  width: 100%; appearance: none; height: 6px; border-radius: 999px; outline: none;
  background: ${({ day }) =>
    day ? 'linear-gradient(90deg,#ffdd80,#ff9f43)' : 'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
  &::-webkit-slider-runnable-track{ height:6px;border-radius:999px;background:inherit; }
  &::-webkit-slider-thumb{
    appearance:none;width:14px;height:14px;margin-top:-4px;border-radius:50%;
    background:#fff;border:1px solid rgba(255,255,255,.35);
  }
  &::-moz-range-track{ height:6px;border-radius:999px;background:rgba(255,255,255,.15); }
  &::-moz-range-progress{
    height:6px;border-radius:999px;
    background:${({ day }) => day ? 'linear-gradient(90deg,#ffdd80,#ff9f43)' : 'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
  }
`;

const Chips = styled.div`display:flex;gap:.5rem;flex-wrap:wrap;`;

const Chip = styled.button<{ active: boolean }>`
  appearance:none;border:0;margin:0;font:600 .8rem/1 'Sono',sans-serif;
  padding:.4rem .6rem;border-radius:10px;color:white;
  background:rgba(0, 0, 0, 0.5);border:1px solid rgba(255,255,255,.12);cursor:pointer;
  
  transition: transform .12s ease, background .12s ease, box-shadow .12s ease, border-color .12s ease;
  ${({ active }) => active && `box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5); border-color: rgba(255,255,255,.92);`}
  &:hover{ transform: translateY(-1px); }
`;

type WeatherPick = 'rain' | 'snow' | 'clouds' | 'fall' | 'clear';


const DevControls: React.FC<{
  day: boolean;
  manual: number | null;
  setManual: (n: number | null) => void;
  currentWeather: WeatherPick;
  weatherOverride: WeatherPick | null;
  setWeatherOverride: (w: WeatherPick | null) => void;
}> = ({ day, manual, setManual, currentWeather, weatherOverride, setWeatherOverride }) => {
  const live = new Date();
  const defaultVal = live.getHours() + live.getMinutes() / 60;

  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const syncBodyHeight = () => {
    const el = bodyRef.current; if (!el) return;
    const h = el.scrollHeight; el.parentElement?.style.setProperty('--body-h', `${h}px`);
  };
  useLayoutEffect(() => { if (open) syncBodyHeight(); }, [open]);
  useEffect(() => {
    const ro = new ResizeObserver(() => open && syncBodyHeight());
    if (bodyRef.current) ro.observe(bodyRef.current);
    return () => ro.disconnect();
  }, [open]);

  const onEnter = () => setOpen(true);
  const setAutoTime = () => setManual(null);
  const setAutoWeather = () => setWeatherOverride(null);

  const label = manual === null ? 'Auto' : `${manual.toFixed(2)} h`;
  const options: { key: WeatherPick; label: string; emoji: string }[] = [
    { key: 'rain',   label: 'Rain',   emoji: '🌧️' },
    { key: 'snow',   label: 'Snow',   emoji: '❄️' },
    { key: 'clouds', label: 'Clouds', emoji: '☁️' },
    { key: 'fall',   label: 'Fall',   emoji: '🍂' },
    { key: 'clear',  label: 'Clear',  emoji: '☀️' },
  ];
  const selected = (weatherOverride ?? currentWeather);

  return (
    <Dock onMouseEnter={onEnter} onFocusCapture={() => setOpen(true)}>
      <Panel day={day} open={open}>
        <PanelHead>
          <Gear aria-label="Open settings"><FiSettings /></Gear>
          <HeadTitle>Scene settings</HeadTitle>
          <Right>
            <HeadHint onClick={() => { setAutoTime(); setAutoWeather(); }}>Reset</HeadHint>
            <CloseBtn aria-label="Close settings" onClick={() => setOpen(false)}>×</CloseBtn>
          </Right>
        </PanelHead>

        <PanelBody ref={bodyRef} open={open}>
          <Row>
            <Label>Time of day<Value>{label}</Value></Label>
            <Dial
              type="range" min={0} max={23.99} step={0.25}
              value={manual ?? defaultVal}
              onChange={(e) => setManual(parseFloat(e.target.value))}
              aria-label="Time of day" day={day}
            />
            <HeadHint onClick={setAutoTime}>Auto time</HeadHint>
          </Row>

          <Row>
            <Label>Weather</Label>
            <Chips>
              {options.map(o => (
                <Chip
                  key={o.key}
                  active={selected === o.key}
                  onClick={() => { weatherOverride === o.key ? setWeatherOverride(null) : setWeatherOverride(o.key); }}
                  aria-pressed={selected === o.key}
                >
                  <span style={{ marginRight: '.35rem' }}>{o.emoji}</span>{o.label}
                </Chip>
              ))}
              <HeadHint onClick={setAutoWeather}>Auto weather</HeadHint>
            </Chips>
          </Row>
        </PanelBody>
      </Panel>
    </Dock>
  );
};

export default DevControls;