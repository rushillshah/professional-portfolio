import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { GitHubIcon, LinkedInIcon } from './icons';
import {
  FiMail,
  FiUser,
  FiCpu,
  FiFolder,
  FiHeart,
  FiMessageCircle,
  FiSliders,
} from 'react-icons/fi';

type DayMode = 'day' | 'night';

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const STATS = [
  { value: '300k+', label: 'PDF exports shipped', link: 'projects' },
  { value: '3-4M', label: 'records synced across CRMs', link: 'projects' },
  { value: '1,455+', label: 'GitHub contributions since Jan', link: 'skills' },
  { value: '2', label: 'hackathons hosted', link: 'projects' },
];

const TILES = [
  { id: 'about', icon: FiUser, label: 'About', teaser: 'Background & story' },
  { id: 'skills', icon: FiCpu, label: 'Skills', teaser: 'Tech & tools' },
  { id: 'projects', icon: FiFolder, label: 'Projects', teaser: 'Things I shipped' },
  { id: 'interests', icon: FiHeart, label: 'Interests', teaser: 'Outside of work' },
  { id: 'contact', icon: FiMessageCircle, label: 'Contact', teaser: 'Get in touch' },
  { id: '__settings', icon: FiSliders, label: 'Settings', teaser: 'Weather & time' },
];

/* ───── Layout ───── */

const Header = styled.header`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  padding: 0 2.5rem 3rem;
  gap: 2.5rem;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.25rem 4rem;
    gap: 1.75rem;
  }
`;

const Glass = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 10;
`;

/* ───── Left Zone ───── */

const LeftZone = styled(Glass)`
  flex: 0 1 58%;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: 1.75rem 2rem;
  min-width: 0;

  @media (max-width: 767px) {
    width: min(440px, 92%);
    text-align: center;
    padding: 1.5rem 1.25rem;
  }
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Title = styled.h1<{ day: boolean }>`
  font-family: 'Quicksand', sans-serif;
  font-size: clamp(2.1rem, 3.8vw, 2.85rem);
  font-weight: 300;
  letter-spacing: 0.5px;
  line-height: 1.15;
  margin: 0;
  color: white;
  display: inline-block;
  position: relative;
  padding-bottom: 10px;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    background: ${({ day }) =>
      day
        ? 'linear-gradient(90deg,#ffdd80,#ff9f43)'
        : 'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
    border-radius: 2px;
    opacity: 0.85;
  }

  @media (max-width: 767px) {
    font-size: clamp(1.65rem, 7vw, 2.1rem);
    line-height: 1.2;

    &::after {
      left: 50%;
      width: 64%;
      transform: translateX(-50%) scaleX(0.6);
      transform-origin: center;
    }
    &:hover::after {
      transform: translateX(-50%) scaleX(1);
    }
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.92rem;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.6);

  @media (max-width: 767px) {
    font-size: 0.85rem;
  }
`;

const Divider = styled.div<{ day: boolean }>`
  height: 1px;
  background: ${({ day }) =>
    day
      ? 'linear-gradient(90deg, rgba(255,159,67,0.35), transparent)'
      : 'linear-gradient(90deg, rgba(124,58,237,0.35), transparent)'};
  margin: 0.15rem 0;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;

  @media (max-width: 767px) {
    justify-content: center;
    gap: 1.75rem;
  }
`;

const StatItem = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: inherit;
  color: inherit;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const StatValue = styled.span<{ day: boolean }>`
  font-family: 'Quicksand', sans-serif;
  font-size: clamp(1.5rem, 2.6vw, 1.9rem);
  font-weight: 700;
  line-height: 1;
  background: ${({ day }) =>
    day
      ? 'linear-gradient(90deg,#ffdd80,#ff9f43)'
      : 'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.span`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.02em;
`;

const sway = keyframes`
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(1deg); }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const IconLink = styled.a<{ day?: boolean }>`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease,
    transform 0.2s ease;

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.22);
    transform: translateY(-2px);
    svg {
      animation: ${sway} 3s ease-in-out infinite;
    }
  }
`;

/* ───── Right Zone — Tiles ───── */

const RightZone = styled.div`
  flex: 0 1 42%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  min-width: 0;
  align-self: flex-end;

  @media (max-width: 767px) {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
`;

const Tile = styled(motion.button)<{ day: boolean }>`
  appearance: none;
  border: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: white;
  text-align: left;
  transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;

  &:hover {
    border-color: ${({ day }) =>
      day ? 'rgba(255,159,67,0.45)' : 'rgba(124,58,237,0.45)'};
    box-shadow: 0 0 24px
      ${({ day }) =>
        day ? 'rgba(255,159,67,0.12)' : 'rgba(124,58,237,0.12)'};
    background: rgba(0, 0, 0, 0.52);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.4);
    outline-offset: 2px;
  }

`;

const TileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
`;

const TileIcon = styled.span<{ day: boolean }>`
  font-size: 1rem;
  color: ${({ day }) => (day ? '#ff9f43' : '#9b6dff')};
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
`;

const TileLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.01em;
`;

const TileTeaser = styled.span`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.42);
  line-height: 1.3;
  padding-left: 1.45rem;
`;

/* ───── Component ───── */

type Props = { mode?: DayMode };

const HeroSection: React.FC<Props> = ({ mode }) => {
  const resolvedMode = useMemo<DayMode>(
    () => mode ?? getModeByHour(new Date().getHours()),
    [mode],
  );
  const day = resolvedMode === 'day';

  const handleTileClick = (id: string) => {
    if (id === '__settings') {
      window.dispatchEvent(new CustomEvent('open-scene-controls'));
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Header>
      <LeftZone
        as={motion.div}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <NameRow>
          <Title day={day}>Rushill Shah</Title>
          <SocialRow>
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
          </SocialRow>
        </NameRow>

        <Subtitle>CodeWiser | Candidately | UIUC ECE '22 | Builder</Subtitle>

        <Divider day={day} />

        <StatsRow>
          {STATS.map((stat) => (
            <StatItem
              key={stat.label}
              onClick={() => {
                const el = document.getElementById(stat.link);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <StatValue day={day}>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsRow>
      </LeftZone>

      <RightZone>
        {TILES.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <Tile
              key={tile.id}
              day={day}
              onClick={() => handleTileClick(tile.id)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.25 + i * 0.07,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <TileHeader>
                <TileIcon day={day}>
                  <Icon />
                </TileIcon>
                <TileLabel>{tile.label}</TileLabel>
              </TileHeader>
              <TileTeaser>{tile.teaser}</TileTeaser>
            </Tile>
          );
        })}
      </RightZone>
    </Header>
  );
};

export default HeroSection;
