import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { GitHubIcon, LinkedInIcon } from './icons';
import { FiMail } from 'react-icons/fi';

type DayMode = 'day' | 'night';

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const Header = styled.header`
  position: relative;
  min-height: 100vh;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: .9rem;
    padding: 3rem 1rem 4rem;
  }
`;

const Glass = styled.div`
  padding: 2rem 2.25rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 10;

  position: relative;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(6px);
  overflow: hidden;
`;

const NameBlock = styled(Glass)`
  position: absolute;
  bottom: 2rem;
  left: 2rem;

  @media (max-width: 767px) {
    position: static;
    transform: none;
    width: min(400px, 88%);
    text-align: center;
    margin: 0 auto;
    padding: 1rem .9rem;
    border: 1px solid rgba(255,255,255,.18);
    backdrop-filter: blur(8px);
  }
`;

const IconsBlock = styled(Glass)`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;

  @media (max-width: 767px) {
    position: static;
    transform: none;
    margin: 0 auto;
    padding: .65rem .9rem;
    display: flex;
    justify-content: center;
    gap: .8rem;
  }
`;

const Title = styled.h1<{ day: boolean }>`
  font-family: 'Sono', sans-serif;
  font-size: clamp(2rem, 3.6vw, 2.75rem);
  font-weight: 300;
  letter-spacing: 1px;
  line-height: 1.15;
  margin: 0;
  color: white;
  display: inline-block;
  position: relative;
  padding-bottom: 8px;

  &::after{
    content:'';
    position:absolute; left:0; bottom:0; height:2px; width:100%;
    background: ${({ day }) =>
      day
        ? 'linear-gradient(90deg,#ffdd80,#ff9f43)'
        : 'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
    border-radius: 2px;
    transform: scaleX(1);
    transform-origin: left;
    opacity: .9;
    transition: transform .18s ease;
  }

  @media (max-width: 767px) {
    font-size: clamp(1.65rem, 7vw, 2.1rem);
    line-height: 1.2;

    &::after{
      left: 50%;
      width: 64%;
      transform: translateX(-50%) scaleX(.6);
      transform-origin: center;
    }
    &:hover::after{ transform: translateX(-50%) scaleX(1); }
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: white;
  letter-spacing: 0.02em;
  margin: 0;

  @media (max-width: 767px) {
    font-size: .98rem;
    line-height: 1.5;
    opacity: .95;
  }
`;

const sway = keyframes`
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(1deg); }
`;

const IconRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 767px) {
    width: 100%;
    gap: .75rem;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const IconLink = styled.a`
  color: lightgrey;
  transition: color 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg { width: 1.75rem; height: 1.75rem; }

  &:hover {
    color: white;
    svg { animation: ${sway} 3s ease-in-out infinite; }
  }

  @media (max-width: 767px) {
    width: 44px; height: 44px;
    border-radius: .8rem;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(6px);

    &:hover {
      background: rgba(255,255,255,.12);
      border-color: rgba(255,255,255,.18);
    }
  }
`;

type Props = { mode?: DayMode };

const HeroSection: React.FC<Props> = ({ mode }) => {
  const resolvedMode = useMemo<DayMode>(() => mode ?? getModeByHour(new Date().getHours()), [mode]);
  const day = resolvedMode === 'day';

  return (
    <Header>
      <NameBlock>
        <Title day={day}>Rushill Shah</Title>
        <Subtitle>UIUC | Candidate.ly | CodeWiser</Subtitle>
      </NameBlock>

      <IconsBlock>
        <IconRow>
          <IconLink href="mailto:rushillshah2000@gmail.com" aria-label="Email">
            <FiMail />
          </IconLink>
          <IconLink
            href="https://github.com/rushillshah"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconLink>
          <IconLink
            href="https://www.linkedin.com/in/rushill-shah-1889a3145/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </IconLink>
        </IconRow>
      </IconsBlock>
    </Header>
  );
};

export default HeroSection;
