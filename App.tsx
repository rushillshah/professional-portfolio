// App.tsx
import React, { useEffect, useState } from 'react';
import { createGlobalStyle, styled } from 'styled-components';
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
import { useWeather } from './hooks/weather';
import ScrollIndicator from './components/ScrollIndicator';
import FallingLeaves from './components/Leaf';
import AmbientSounds from './components/AmbientSounds';
import VineFollower from './components/CursorSprouts';

const GlobalStyle = createGlobalStyle<{ timeOfDay: 'day' | 'night' }>`
  body {
    background-color: ${props => props.timeOfDay === 'day' ? '#fbf8f5' : '#0c0c2c'};
    transition: background-color 1.5s ease;
    font-family: 'Sono', sans-serif;
    margin: 0;
    overflow: hidden; /* This MUST be here to prevent double scrollbars */
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: touch;
  }

  p {
    color: var(--global-subtext-color);
    transition: color 1.5s ease;
  }

  html, body, #root {
    height: 100%;
  }
`;

const SnapContainer = styled.div`
  height: 100vh;
  width: 100%;
  overflow-y: scroll; /* This is the ONLY element that should scroll */
  z-index: 3;
  scroll-behavior: smooth;

  @media (min-width: 768px) {
    scroll-snap-type: y mandatory;
  }
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


const App: React.FC = () => {
  const celestial = useCelestialPosition();
  const timeOfDay = celestial.visible === 'sun' ? 'day' : 'night';
  const weather = useWeather();
  
  const [showLeaves, setShowLeaves] = useState(false);
  const [isRaining, setIsRaining] = useState(false);

  useEffect(() => {
    if (!weather) return;

    let raining = false;
    if (weather.kind === 'rain') {
      raining = true;
    } else if (weather.kind === 'clouds') {
      if (Math.random() < 0.5) {
        raining = true;
      }
    }
    
    setIsRaining(raining);

    if (!raining) {
      if (Math.random() < 0.4) {
        setShowLeaves(true);
      }
    } else {
      setShowLeaves(false);
    }
  }, [weather]);

  useEffect(() => {
    const dayTextColor = '#3c3834';
    const daySubtextColor = '#4a4540';
    const dayTertiaryTextColor = '#9ca3af';

    const nightTextColor = '#f8fafc';
    const nightSubtextColor = '#cbd5e1';
    const nightTertiaryTextColor = '#94a3b8';

    const newTextColor = timeOfDay === 'day' ? dayTextColor : nightTextColor;
    const newSubtextColor = timeOfDay === 'day' ? daySubtextColor : nightSubtextColor;
    const newTertiaryTextColor = timeOfDay === 'day' ? dayTertiaryTextColor : nightTertiaryTextColor;

    document.documentElement.style.setProperty('--global-text-color', newTextColor);
    document.documentElement.style.setProperty('--global-subtext-color', newSubtextColor);
    document.documentElement.style.setProperty('--global-tertiary-color', newTertiaryTextColor);
  }, [timeOfDay]);

  return (
    <>
      <GlobalStyle timeOfDay={timeOfDay} />
      <VineFollower />
      <AmbientSounds />
      {showLeaves && <FallingLeaves />}

      <DynamicSky />
      <CloudLayer  />
      <BranchHeader />
      {isRaining && <RainEffect />}
      <SnapContainer>
        <SnapSection><HeroSection /><ScrollIndicator /></SnapSection>
        <SnapSection><AboutSection /></SnapSection>
        <SnapSection><ProjectsSection /></SnapSection>
        <SnapSection><InterestsSection /></SnapSection>
        <SnapSection><ContactSection /></SnapSection>
      </SnapContainer>
    </>
  );
};

export default App;