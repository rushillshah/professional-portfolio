import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import InterestsSection from './components/InterestsSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import DynamicSky from './components/DynamicSky';
import RainEffect from './components/Rainfall';
import { useCelestialPosition } from './hooks/celestialPosition';
import BranchHeader from './components/BranchHeader';
import CloudLayer from './components/Clouds';
import { useSeason, useWeather } from './hooks/weather';
import FallingLeaves from './components/Leaf';
import AmbientSounds from './components/AmbientSounds';
import VineFollower from './components/CursorSprouts';
import SkillsSection from './components/SkillsSection';
import Snowfall from './components/Snowfall';
import DevControls from './components/SceneControls';
import ScrollHint from './components/ScrollHint';

const GlobalStyle = createGlobalStyle<{ timeOfDay: 'day' | 'night' }>`
  body {
    background-color: ${p => (p.timeOfDay === 'day' ? '#fbf8f5' : '#0c0c2c')};
    transition: background-color 1.5s ease;
    font-family: 'Sono', sans-serif;
    margin: 0;
    overflow: hidden;
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: touch;
  }
  p { color: var(--global-subtext-color); transition: color 1.5s ease; }
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
    height: 100vh;
    padding: 0;
    scroll-snap-align: start;
  }
`;

type WeatherPick = 'rain' | 'snow' | 'clouds' | 'fall' | 'clear';

const App: React.FC = () => {
  const [manualHour, setManualHour] = useState<number | null>(null);
  const [weatherOverride, setWeatherOverride] = useState<WeatherPick | null>(null);

  const celestial = useCelestialPosition(manualHour);
  const timeOfDay: 'day' | 'night' = celestial.visible === 'sun' ? 'day' : 'night';

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
    () => effectiveWeather === 'clouds' || effectiveWeather === 'rain' || effectiveWeather === 'snow',
    [effectiveWeather]
  );
  const showRain = effectiveWeather === 'rain';
  const showSnow = effectiveWeather === 'snow';
  const showLeaves = effectiveWeather === 'fall' || (effectiveWeather === 'clear' && sessionRand.current < 0.4);

  useEffect(() => {
    const dayTextColor = '#3c3834';
    const daySubtextColor = '#4a4540';
    const dayTertiaryTextColor = '#9ca3af';
    const nightTextColor = '#f8fafc';
    const nightSubtextColor = '#cbd5e1';
    const nightTertiaryTextColor = '#94a3b8';
    document.documentElement.style.setProperty('--global-text-color', timeOfDay === 'day' ? dayTextColor : nightTextColor);
    document.documentElement.style.setProperty('--global-subtext-color', timeOfDay === 'day' ? daySubtextColor : nightSubtextColor);
    document.documentElement.style.setProperty('--global-tertiary-color', timeOfDay === 'day' ? dayTertiaryTextColor : nightTertiaryTextColor);
  }, [timeOfDay]);

  return (
    <>
      <GlobalStyle timeOfDay={timeOfDay} />

      <DevControls
        day={timeOfDay === 'day'}
        manual={manualHour}
        setManual={setManualHour}
        currentWeather={autoWeather}
        weatherOverride={weatherOverride}
        setWeatherOverride={setWeatherOverride}
      />

      <VineFollower />
      <AmbientSounds />
      {showLeaves && <FallingLeaves isFall={effectiveWeather === 'fall'} />}

      <DynamicSky manualHour={manualHour} />

      {showClouds && <CloudLayer />}
      <BranchHeader />
      {showRain && <RainEffect />}
      {showSnow && <Snowfall density={180} />}

      <SnapContainer>
        <SnapSection><HeroSection /><ScrollHint /></SnapSection>
        <SnapSection><AboutSection /></SnapSection>
        <SnapSection><SkillsSection timeOfDay={timeOfDay} /></SnapSection>
        <SnapSection><ProjectsSection /></SnapSection>
        <SnapSection><InterestsSection /></SnapSection>
        <SnapSection><ContactSection /></SnapSection>
      </SnapContainer>
    </>
  );
};

export default App;
