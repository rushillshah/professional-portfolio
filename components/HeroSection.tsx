// components/HeroSection.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { GitHubIcon, LinkedInIcon } from './icons';
import { FiMail } from 'react-icons/fi';

/* ───────────────────────── layout helpers ──────────────────────────── */
const Header = styled.header`
  position: relative;
  min-height: 100vh;          /* full‑screen */
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
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 1rem;
    backdrop-filter: blur(6px);
    overflow: hidden;
`;

const NameBlock = styled(Glass)`
  position: absolute;
  bottom: 2rem;
  left: 2rem;

  @media (max-width: 640px) {
    left: 50%;
    top: 40%;
    width: 90%;
    transform: translateX(-50%);
    text-align: center;
    max-height: 15vh;
    margin-bottom: 2rem;
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

  @media (max-width: 640px) {
     left: 50%;
    top: 50%;
    max-height: 7vh;
    transform: translateX(-50%);
    text-align: center;
    margin-top: 8rem;
  }
`;


/* ─────────────────────────── typography ────────────────────────────── */
const Title = styled.h1`
font-family: 'Sono', sans-serif;
  font-size: 1.75rem;
  font-weight: 300;
  letter-spacing: 1px;
  margin: 0;
  color: var(--global-text-color);
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--global-subtext-color);
  letter-spacing: 0.5px;
  margin: 0;
`;

/* ─────────────────────────── icon styling ──────────────────────────── */
const sway = keyframes`
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(1deg); }
`;

const IconLink = styled.a`
  color: var(--global-tertiary-color);
  transition: color 0.25s ease;

  svg { width: 1.75rem; height: 1.75rem; }

  &:hover {
    color: var(--global-text-color);
    svg { animation: ${sway} 3s ease-in-out infinite; }
  }
`;

/* ───────────────────────── component ──────────────────────────────── */
const HeroSection: React.FC = () => (
  <Header>
    {/* name + tagline bottom‑left */}
    <NameBlock>
      <Title>Rushill Shah</Title>
      <Subtitle>Engineering with intent since 2022</Subtitle>
    </NameBlock>

    {/* icons bottom‑right */}
    <IconsBlock>
      <IconLink href="mailto:rushillshah2000@gmail.com" aria-label="Email">
        <FiMail />
      </IconLink>
      <IconLink href="https://github.com/rushillshah" aria-label="GitHub">
        <GitHubIcon />
      </IconLink>
      <IconLink href="https://linkedin.com/in/yourname" aria-label="LinkedIn">
        <LinkedInIcon />
      </IconLink>
    </IconsBlock>
  </Header>
);

export default HeroSection;
