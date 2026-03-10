import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Section from './Section';

type DayMode = 'day' | 'night';

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const SectionHeader = styled(motion.header)`
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

const SectionSubtitle = styled.p`
  margin: 0.3rem 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
`;

const SectionTitle = styled.h2<{ $day: boolean }>`
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

const Glass = styled.div`
  position: relative;
  padding: 1.75rem 2rem;
  background: rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.85rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  isolation: isolate;

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
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2.5rem;
  }
`;

const Column = styled(motion.div)`
  flex: 1;
  min-width: 0;
`;

const Divider = styled.div<{ $day: boolean }>`
  align-self: center;
  width: 80%;
  height: 1px;
  background: ${({ $day }) =>
    $day
      ? 'linear-gradient(90deg, transparent, rgba(255,159,67,0.35), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(124,58,237,0.35), transparent)'};

  @media (min-width: 768px) {
    width: 1px;
    height: auto;
    align-self: stretch;
    background: ${({ $day }) =>
      $day
        ? 'linear-gradient(180deg, transparent, rgba(255,159,67,0.35), transparent)'
        : 'linear-gradient(180deg, transparent, rgba(124,58,237,0.35), transparent)'};
  }
`;

const ColumnTitle = styled.h3<{ $day: boolean }>`
  margin: 0 0 0.85rem;
  font-weight: 400;
  font-family: 'Quicksand', sans-serif;
  font-size: clamp(1.3rem, 2.5vw, 1.6rem);
  color: white;
  position: relative;
  display: inline-block;
  padding-bottom: 6px;

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

const Text = styled.p`
  margin: 0 0 1rem;
  font-size: 0.92rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);

  &:last-child {
    margin-bottom: 0;
  }
`;

const AboutSection: React.FC = () => {
  const mode = useMemo<DayMode>(() => getModeByHour(new Date().getHours()), []);
  const day = mode === 'day';
  const glassRef = useRef<HTMLDivElement | null>(null);

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

  const onGlassMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = glassRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Section>
      <SectionHeader
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <SectionTitle $day={day}>About</SectionTitle>
        <SectionSubtitle>Myself and this page</SectionSubtitle>
      </SectionHeader>

      <Glass ref={glassRef} style={accents} onMouseMove={onGlassMove}>
        <Container>
          <Column
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ColumnTitle $day={day}>Myself</ColumnTitle>
            <Text>
              I'm a product & software engineer who finds joy in crafting powerful
              and creative experiences. Been building since childhood, been a
              professional since 2022.
            </Text>
            <Text>
              What started with a fascination of hardware became intrigue about the
              intersection of hardware and software. Once I built a 16 bit LC-3
              computer in a single FPGA chip, I realized my true passion wasn't in
              designing the hardware, but in the software that brings it to life.
            </Text>
          </Column>

          <Divider $day={day} />

          <Column
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ColumnTitle $day={day}>This Site</ColumnTitle>
            <Text>
              This page is an interactive piece that uses your location as its brush.
              No two visits are identical. A small statement that effort and care can
              move a stranger, and that human creativity trumps technology.
            </Text>
            <Text>
              Witness the weather, the time of day, and the season of your location
              influence your experience.
            </Text>
            <Text>
              PS: If you see falling leaves, click on them! Hovering opens things up
              (tap on the phone).
            </Text>
          </Column>
        </Container>
      </Glass>
    </Section>
  );
};

export default AboutSection;
