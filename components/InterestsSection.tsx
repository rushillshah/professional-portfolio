import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Section from './Section';

type DayMode = 'day' | 'night';

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const Header = styled(motion.header)`
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin: 0 0 1.5rem;
  padding: 0.6rem 1.5rem;
  background: rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.85rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Title = styled.h2<{ $day: boolean }>`
  margin: 0;
  font-family: 'Quicksand', sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.3rem);
  font-weight: 400;
  color: white;
  display: inline-block;
  position: relative;
  padding-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    background: ${({ $day }) =>
      $day
        ? 'linear-gradient(90deg,#ffdd80,#ff9f43)'
        : 'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
    border-radius: 2px;
    opacity: 0.7;
  }
`;

const Subtitle = styled.p`
  margin: 0.3rem 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.15rem;
  }
`;

const Card = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.4rem 1.5rem;
  border-radius: 0.85rem;
  background: rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  isolation: isolate;
  overflow: hidden;
  transition: box-shadow 0.25s ease, border-color 0.25s ease,
    transform 0.25s ease, background 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: radial-gradient(
      200px 200px at var(--mx, -200px) var(--my, -200px),
      var(--glow) 0%,
      transparent 62%
    );
    transition: background 120ms ease;
    opacity: 0.9;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--accent-start), var(--accent-end));
    border-radius: 3px 0 0 3px;
    opacity: 0.5;
    transition: opacity 0.25s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(0, 0, 0, 0.48);

    &::after {
      opacity: 0.8;
    }
  }
`;

const GroupName = styled.h3`
  margin: 0;
  font-family: 'Quicksand', sans-serif;
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #fff;
  position: relative;
  display: inline-block;
  padding-bottom: 0.45rem;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    border-radius: 10px;
    transform-origin: left;
    transform: scaleX(0.25);
    transition: transform 0.28s ease;
    opacity: 0.8;
  }

  ${Card}:hover &::after {
    transform: scaleX(1);
  }
`;

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  font-size: 11px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
`;

const TagDetail = styled.span`
  margin-left: 0.25rem;
  font-size: 10px;
  opacity: 0.45;
`;

const GROUPS = [
  {
    title: 'Activities',
    items: [
      { name: 'Jiujitsu', detail: '' },
      { name: 'Scuba Diving', detail: '' },
      { name: 'Guitar', detail: '' },
      { name: 'Cooking', detail: '' },
      { name: 'Hiking', detail: '' },
      { name: 'Skiing', detail: '' },
    ],
  },
  {
    title: 'Sports',
    items: [
      { name: 'Manchester United', detail: '' },
      { name: 'BJJ', detail: '' },
      { name: 'Tennis', detail: '' },
    ],
  },
  {
    title: 'Creative',
    items: [
      { name: 'Photography', detail: '' },
      { name: 'Culinary Experimentation', detail: '' },
    ],
  },
  {
    title: 'Learning',
    items: [
      { name: 'Philosophy', detail: '' },
      { name: 'History', detail: '' },
      { name: 'Hardware', detail: '' },
    ],
  },
];

const InterestsSection: React.FC = () => {
  const mode = useMemo<DayMode>(() => getModeByHour(new Date().getHours()), []);
  const day = mode === 'day';

  const accents = useMemo(
    () =>
      (day
        ? {
            '--accent-start': '#ffdd80',
            '--accent-end': '#ff9f43',
            '--glow': 'rgba(255,221,128,.15)',
          }
        : {
            '--accent-start': '#7c3aed',
            '--accent-end': '#6ee7ff',
            '--glow': 'rgba(124,58,237,.18)',
          }) as React.CSSProperties,
    [day],
  );

  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Section>
      <Header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Title $day={day}>Interests</Title>
        <Subtitle>Outside of work</Subtitle>
      </Header>

      <Grid>
        {GROUPS.map((group, i) => (
          <Card
            key={group.title}
            style={accents}
            onMouseMove={onCardMove}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.45,
              delay: i * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <GroupName>{group.title}</GroupName>
            <TagsWrap>
              {group.items.map((item) => (
                <Tag key={item.name}>
                  {item.name}
                  {item.detail && <TagDetail>· {item.detail}</TagDetail>}
                </Tag>
              ))}
            </TagsWrap>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default InterestsSection;
