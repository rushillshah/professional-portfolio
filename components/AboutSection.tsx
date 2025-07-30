import React, { useMemo } from 'react';
import styled from 'styled-components';
import Section from './Section';

type DayMode = 'day' | 'night';

const Glass = styled.div<{ mode: DayMode }>`
  position: relative;
  margin: 0 auto;
  z-index: 3;
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: ${({ mode }) => (mode === 'day' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.32)')};
  overflow: hidden;

  @media (min-width: 768px) { padding: 3rem 2.5rem; }

  /* subtle aurora ribbon */
  &::before {
    content: '';
    position: absolute; inset: -30% -10% auto -10%;
    height: 40%;
    background: ${({ mode }) =>
      mode === 'day'
        ? 'linear-gradient(90deg, rgba(255,221,128,.25), rgba(255,159,67,.15), rgba(255,221,128,.25))'
        : 'linear-gradient(90deg, rgba(124,58,237,.22), rgba(110,231,255,.12), rgba(124,58,237,.22))'};
    filter: blur(30px);
    pointer-events: none;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.25rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const Column = styled.div`
  flex: 1;
  min-width: 0;
`;

const Divider = styled.div<{ mode: DayMode }>`
  align-self: center;
  width: 90%;
  height: 1px;
  background: ${({ mode }) =>
    mode === 'day'
      ? 'linear-gradient(90deg, transparent, rgba(255,221,128,.55), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(124,58,237,.55), transparent)'};

  @media (min-width: 768px) {
    width: 1px;
    height: auto;
    align-self: stretch;
    background: ${({ mode }) =>
      mode === 'day'
        ? 'linear-gradient(180deg, transparent, rgba(255,221,128,.55), transparent)'
        : 'linear-gradient(180deg, transparent, rgba(124,58,237,.55), transparent)'};
  }
`;

const Header = styled.h2<{ mode: DayMode }>`
  margin: 0 0 1rem;
  font-weight: 500;
  font-family: 'Sono', sans-serif;
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  color: white;
  position: relative;
  display: inline-block;
  padding-bottom: 4px;

  &::after {
    content: '';
    position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
    background: ${({ mode }) =>
      mode === 'day'
        ? 'linear-gradient(90deg, #ffdd80, #ff9f43)'
        : 'linear-gradient(90deg, #7c3aed, #6ee7ff)'};
    border-radius: 2px;
    transform: scaleX(1);
    transform-origin: left;
    opacity: .75;
    transition: transform .3s ease, opacity .18s ease;
  }

  &:hover::after { transform: scaleX(1); opacity: .95; }
`;

const Text = styled.p`
  margin: 0 0 1.2rem;
  font-size: 1rem;
  line-height: 1.75rem;
  color: white;
`;

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const AboutSection: React.FC = () => {
  const mode = useMemo<DayMode>(() => getModeByHour(new Date().getHours()), []);

  return (
    <Section>
      <Glass mode={mode}>
        <Container>
           <Column>
          <Header mode={mode}>Myself</Header>
          <Text>
            I'm a product &amp; software engineer who finds joy in crafting powerful and creative experiences. Been building since childhood, been a professional since 2022
            <br /><br />
            What started with a fascination of hardware became intrigue about the intersection of hardware and software. Once I built a 16 bit LC-3 computer in a single FPGA chip, I realized my true passion wasn't in designing the hardware, but in the software that brings it to life.
          </Text>
        </Column>

        <Divider mode={mode}/>

        <Column>
          <Header mode={mode}>This Site</Header>
          <Text>
            This page is an interactive piece that uses your location as its brush.
            No two visits are identical. A small statement that effort and care can move a stranger, and that human creativity trumps technology.
            <br /><br />
            Witness the weather, the time of day, and the season of your location influence your experience. 
            <br /><br />
            PS: If you see falling leaves, click on them! Hovering opens things up (tap on the phone)
          </Text>
        </Column>
        </Container>
      </Glass>
    </Section>
  );
};

export default AboutSection;
