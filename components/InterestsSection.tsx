import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Section from './Section';

type DayMode = 'day' | 'night';
type Skill = { name: string; desc: string };

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const Shell = styled.div<{ day: boolean }>`
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  padding: 1.6rem 0 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: ${({ day }) => (day ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)')};
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 1.25rem;
`;

const Title = styled.h2<{ day: boolean }>`
  position: relative;
  display: inline-block;
  margin: 0;
  font-family: 'Sono', sans-serif;
  font-size: clamp(2rem, 3.2vw, 2.5rem);
  font-weight: 500;
  color: var(--global-text-color);
  padding-bottom: 6px;
`;

const Ledger = styled.div<{ day: boolean }>`
  position: relative;
  display: grid;
  gap: .75rem;
  --glow: ${({ day }) => (day ? 'rgba(255,221,128,.18)' : 'rgba(124,58,237,.22)')};
  border-radius: 16px;
  padding: clamp(1rem, 3vw, 2rem);
  padding-top: 0;

  &::before {
    content: '';
    position: absolute; inset: 0;
    pointer-events: none;
    background: radial-gradient(200px 200px at var(--mx, -200px) var(--my, -200px), var(--glow) 0%, transparent 60%);
    transition: background 120ms ease;
  }
`;

/* group panel (mirrors SkillsSection group block) */
const Group = styled.div`
  display: grid;
  gap: .75rem;
  background: rgba(0,0,0,.24);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 12px;
  padding: 1.25rem;
  backdrop-filter: blur(12px);
`;

const GroupTitle = styled.h3<{ day: boolean; active: boolean }>`
  margin: 0;
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 500;
  color: var(--global-text-color);
  position: relative;
  display: inline-block;
  padding-bottom: 2px;

  &::after {
    content: '';
    position: absolute; left: 0; right: 0; bottom: -4px; height: 2px;
    background: ${({ day }) =>
      day
        ? 'linear-gradient(90deg,#ffdd80,#ff9f43)'
        : 'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
    border-radius: 2px;
    transform-origin: left;
    transform: scaleX(${({ active }) => (active ? 1 : 0.10)});
    opacity: ${({ active }) => (active ? 0.95 : 0.6)};
    transition: transform .38s ease, opacity .38s ease;
  }
`;

/* horizontally scrolling chips with fixed row height (same as SkillsSection) */
const Chips = styled.ul`
  --row-h: 36px;
  list-style: none;
  margin: 0;
  padding: .25rem .25rem;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: .5rem;
  min-height: calc(var(--row-h) + .5rem);
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  mask-image: linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%);

  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.25) transparent;
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,.25); border-radius: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

const Chip = styled.li<{ day: boolean }>`
  --desc-max: 0px;
  --desc-opacity: 0;

  display: inline-flex;
  align-items: center;
  height: var(--row-h);
  gap: .45rem;
  padding: 0 .7rem;
  font-size: 12px;
  color: var(--global-text-color);
  background: ${({ day }) => (day ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.06)')};
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  transition: transform .15s ease, background .15s ease, box-shadow .15s ease;
  white-space: nowrap;
  cursor: default;
  outline: none;

  &:hover,
  &:focus {
    transform: translateY(-1px);
    background: ${({ day }) => (day ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.1)')};
    box-shadow: 0 6px 18px rgba(0,0,0,.18);
    --desc-max: 420px;
    --desc-opacity: 1;
  }
`;

const Label = styled.span`
  font-weight: 500;
`;

const Sep = styled.span`
  opacity: .5;
`;

const Desc = styled.span`
  max-width: var(--desc-max);
  opacity: var(--desc-opacity);
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width .25s ease, opacity .2s ease;
`;

/* ────────────────────────── data ────────────────────────── */
const activities: Skill[] = [
  { name: 'Jiujitsu',     desc: '3 years — the art of polite strangling' },
  { name: 'Scuba Diving', desc: 'PADI diver — happiest twenty metres under' },
  { name: 'Guitar',       desc: 'played until my fingers bled' },
];

const interests: Skill[] = [
  { name: 'Manchester United', desc: 'supported for years — it builds character' },
  { name: 'Photography',       desc: 'favourite souvenirs from travels' },
];

/* ────────────────────────── component ────────────────────────── */
const InterestsSection: React.FC = () => {
  const mode = useMemo<DayMode>(() => getModeByHour(new Date().getHours()), []);
  const day = mode === 'day';
  const ledgerRef = useRef<HTMLDivElement | null>(null);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ledgerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Section>
      <Shell day={day}>
        <Header>
          <Title day={day}>Interests</Title>
        </Header>

        <Ledger ref={ledgerRef} day={day} onMouseMove={onMove}>
          {/* Row 1 — Activities */}
          <Group
            onMouseEnter={() => setActiveGroup(0)}
            onMouseLeave={() => setActiveGroup(prev => (prev === 0 ? null : prev))}
            onFocusCapture={() => setActiveGroup(0)}
            onBlurCapture={() => setActiveGroup(prev => (prev === 0 ? null : prev))}
          >
            <GroupTitle day={day} active={activeGroup === 0}>Activities</GroupTitle>
            <Chips>
              {activities.map(({ name, desc }) => (
                <Chip key={name} day={day} tabIndex={0} aria-label={`${name}: ${desc}`}>
                  <Label>{name}</Label>
                  <Sep>—</Sep>
                  <Desc>{desc}</Desc>
                </Chip>
              ))}
            </Chips>
          </Group>

          {/* Row 2 — Interests */}
          <Group
            onMouseEnter={() => setActiveGroup(1)}
            onMouseLeave={() => setActiveGroup(prev => (prev === 1 ? null : prev))}
            onFocusCapture={() => setActiveGroup(1)}
            onBlurCapture={() => setActiveGroup(prev => (prev === 1 ? null : prev))}
          >
            <GroupTitle day={day} active={activeGroup === 1}>Interests</GroupTitle>
            <Chips>
              {interests.map(({ name, desc }) => (
                <Chip key={name} day={day} tabIndex={0} aria-label={`${name}: ${desc}`}>
                  <Label>{name}</Label>
                  <Sep>—</Sep>
                  <Desc>{desc}</Desc>
                </Chip>
              ))}
            </Chips>
          </Group>
        </Ledger>
      </Shell>
    </Section>
  );
};

export default InterestsSection;
