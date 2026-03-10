import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import InterestsSection from './components/InterestsSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import DynamicSky from './components/DynamicSky';
import RainEffect from './components/Rainfall';
import { TimeOfDay, useCelestialPosition } from './hooks/celestialPosition';
import BranchHeader from './components/BranchHeader';
import CloudLayer from './components/Clouds';
import { useSeason, useWeather } from './hooks/weather';
import FallingLeaves from './components/Leaf';
import AmbientSounds from './components/AmbientSounds';
import SkillsSection from './components/SkillsSection';
import Snowfall from './components/Snowfall';
import DevControls from './components/SceneControls';
import ScrollHint from './components/ScrollHint';
import VolumeNudge from './components/VolumeNudge';

type WeatherPick = 'rain' | 'snow' | 'clouds' | 'fall' | 'clear' | 'storm';

const GlobalStyle = createGlobalStyle<{ timeOfDay: TimeOfDay }>`
  body {
    background-color: ${p => (p.timeOfDay === 'day' ? '#fbf8f5' : '#0c0c2c')};
    transition: background-color 1.5s ease;
    font-family: 'Quicksand', 'Sono', sans-serif;
    margin: 0;
    overflow: hidden;
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: touch;
  }
  p { color: white; transition: color 1.5s ease; }
  html, body, #root { height: 100%; }
`;

const SnapContainer = styled.div`
  height: 100vh;
  width: 100%;
  overflow-y: scroll;
  z-index: 3;
  scroll-behavior: smooth;
  @media (min-width: 768px) { scroll-snap-type: y mandatory; }
`;

const SnapSection = styled.section`
  min-height: 100vh;
  height: auto;
  padding: 4rem 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (min-width: 768px) {
    min-height: 100vh;
    padding: 0;
    scroll-snap-align: start;
  }
`;

const SplitRow = styled.div`
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.25rem;
    align-items: stretch;

    & > * {
      flex: 1;
      min-width: 0;
    }
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const Burger = styled.button<{ day:boolean; open:boolean }>`
  position: fixed;
  top: max(14px, env(safe-area-inset-top));
  left: 14px;
  z-index: 9600;
  display: inline-flex; align-items: center; justify-content: center;
  width: 42px; height: 42px; border-radius: 11px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  cursor: pointer; appearance: none; outline: none;
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
  box-shadow: ${({open}) => open ? '0 10px 26px rgba(0,0,0,.28)' : '0 6px 18px rgba(0,0,0,.18)'};

  &:hover { transform: translateY(-1px); }

  svg { display:block; }
`;

const Sidebar = styled.aside<{ day:boolean; open:boolean }>`
  position: fixed;
  top: calc(max(14px, env(safe-area-inset-top)) + 50px);
  left: 14px;
  width: clamp(210px, 22vw, 260px);
  max-width: 86vw;
  /* auto height — fits contents, no more */
  height: auto;
  z-index: 9550;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 18px 40px rgba(0,0,0,.28);
  overflow: hidden;
  transform: translateX(${p => p.open ? '0' : 'calc(-100% - 18px)'});
  opacity: ${p => p.open ? 1 : .98};
  transition: transform .26s ease, opacity .26s ease;

  @media (max-width: 640px) { width: min(78vw, 320px); }
`;

const SideList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: .4rem;
`;

const NavItem = styled.button<{ active:boolean; day:boolean }>`
  width: 95%;
  display: flex; align-items: center;
  gap: .65rem;
  padding: .55rem .65rem;
  margin: .18rem .3rem;
  border: 0; background: transparent; cursor: pointer;
  color: white;
  font-size: .95rem; border-radius: 10px;
  line-height: 1;
  transition: background .16s ease, transform .16s ease, opacity .16s ease;

  ${({active, day}) => active ? `
    background: ${day ? 'rgba(255,255,255,.42)' : 'rgba(255,255,255,.12)'};
  ` : `
    opacity: .92;
    &:hover { background: ${day ? 'rgba(255,255,255,.26)' : 'rgba(255,255,255,.08)'}; transform: translateX(1px); }
  `}
`;

const App: React.FC = () => {
  const [manualHour, setManualHour] = useState<number | null>(null);
  const [weatherOverride, setWeatherOverride] = useState<WeatherPick | null>(null);

  const celestial = useCelestialPosition(manualHour);
  const timeOfDay: TimeOfDay = celestial.timeOfDay;

  const season = useSeason();
  const weather = useWeather();

  const sessionRand = useRef(Math.random());

  const autoWeather = useMemo<WeatherPick>(() => {
    if (season === 'autumn') return 'fall';
    const live = (weather?.kind ?? 'clear') as WeatherPick;
    if (live === 'clouds') {
      const precip = sessionRand.current < 0.6;
      if (precip) return season === 'winter' ? 'snow' : 'rain';
      return 'clouds';
    }
    return live;
  }, [weather?.kind, season]);

  const effectiveWeather = useMemo<WeatherPick>(() => {
    return (weatherOverride ?? autoWeather) as WeatherPick;
  }, [autoWeather, weatherOverride]);

  const showClouds = useMemo(
    () => effectiveWeather === 'clouds' || effectiveWeather === 'rain' || effectiveWeather === 'snow' || effectiveWeather === 'storm',
    [effectiveWeather]
  );
  const showRain = effectiveWeather === 'rain' || effectiveWeather === 'storm';
  const showSnow = effectiveWeather === 'snow';
  const showLeaves = effectiveWeather === 'fall' || (effectiveWeather === 'clear' && sessionRand.current < 0.4);

  const sections = useRef([
    { id: 'hero',       label: 'Home' },
    { id: 'about',      label: 'About' },
    { id: 'projects',   label: 'Projects' },
    { id: 'skills',     label: 'Skills' },
    { id: 'interests',  label: 'Interests' },
    { id: 'contact',    label: 'Contact' },
  ]).current;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState('hero');

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveTab(visible[0].target.id);
      },
      { root, threshold: [0.55, 0.7] }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const hoverTimeout = useRef<number | null>(null);
  const isTouchDevice =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  const openNow = () => {
    if (hoverTimeout.current) { window.clearTimeout(hoverTimeout.current); hoverTimeout.current = null; }
    setOpen(true);
  };
  const closeSoon = () => {
    if (pinned) return;
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    hoverTimeout.current = window.setTimeout(() => setOpen(false), 120);
  };
  const toggleOpen = () => { setOpen(prev => !prev); setPinned(false); };

  const burgerRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPinned(false); setOpen(false); }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onTap = (e: TouchEvent) => {
      const t = e.target as Node;
      if (burgerRef.current?.contains(t) || sidebarRef.current?.contains(t)) return;
      setPinned(false);
      setOpen(false);
    };
    document.addEventListener('touchstart', onTap, { passive: true });
    return () => document.removeEventListener('touchstart', onTap);
  }, [open]);

  const day = timeOfDay === 'day';

  return (
    <>
      <GlobalStyle timeOfDay={timeOfDay} />

      <DevControls
        day={day}
        manual={manualHour}
        setManual={setManualHour}
        currentWeather={autoWeather}
        weatherOverride={weatherOverride}
        setWeatherOverride={setWeatherOverride}
      />

      <Burger
        ref={burgerRef}
        day={day}
        open={open || pinned}
        onMouseEnter={!isTouchDevice ? openNow : undefined}
        onMouseLeave={!isTouchDevice ? closeSoon : undefined}
        onClick={toggleOpen}
        aria-label={(open || pinned) ? 'Close navigation' : 'Open navigation'}
        aria-pressed={false}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"/>
        </svg>
      </Burger>

      <Sidebar
        ref={sidebarRef}
        day={day}
        open={open || pinned}
        onMouseEnter={!isTouchDevice ? openNow : undefined}
        onMouseLeave={!isTouchDevice ? closeSoon : undefined}
        role="dialog"
        aria-modal="false"
        aria-label="Site navigation"
      >
        <SideList>
          {sections.map(s => (
            <NavItem
              key={s.id}
              day={day}
              active={activeTab === s.id}
              onClick={() => { go(s.id); if (!pinned) setOpen(false); }}
            >
              {s.label}
            </NavItem>
          ))}
        </SideList>
      </Sidebar>

      <AmbientSounds hasWeatherEffect={showRain || showSnow} />
      {showLeaves && <FallingLeaves isFall={effectiveWeather === 'fall'} />}

      <DynamicSky manualHour={manualHour} />

      {showClouds && <CloudLayer />}
      <BranchHeader />
      {showRain && <RainEffect />}
      {showSnow && (
        <Snowfall density={180} volume={1.0} playing={effectiveWeather === 'snow'} />
      )}

      <SnapContainer ref={containerRef}>
        <SnapSection id="hero"><HeroSection /><ScrollHint /><VolumeNudge /></SnapSection>
        <SnapSection id="about"><AboutSection /></SnapSection>
        <SnapSection id="projects"><ProjectsSection /></SnapSection>
        <SnapSection id="skills"><SkillsSection timeOfDay={timeOfDay} /></SnapSection>
        <SnapSection id="interests"><InterestsSection /></SnapSection>
        <SnapSection id="contact"><ContactSection /></SnapSection>
      </SnapContainer>
    </>
  );
};

export default App;
