// components/AboutSection.tsx
import React from 'react';
import styled from 'styled-components';
import Section from './Section';

/* ───────────────────────── glass wrapper ──────────────────────────── */
const Glass = styled.div`
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 1rem;
  z-index: 2;
  margin: 0 auto;
  @media (min-width: 768px) {
    padding: 3rem 2.5rem;
  }
        position: relative;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 1rem;
    backdrop-filter: blur(6px);
    overflow: hidden;
`;

/* ───────────────────────── internal layout ────────────────────────── */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const Column = styled.div`
  flex: 1;
`;

const Divider = styled.div`
  width: 90%;
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
  margin: 1rem auto;

  @media (min-width: 768px) {
    width: 1px;
    height: auto;
    margin: 0;
    align-self: stretch;
  }
`;

const Header = styled.h2`
  font-family: 'Zen Antique Soft', serif;
  font-size: 2rem;
  @media (min-width: 768px) { font-size: 2.5rem; }
  color: var(--global-text-color);
  margin: 0 0 1rem;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const Text = styled.p`
  color: ;
  font-size: 1rem;
  line-height: 1.75rem;
  margin: 0 0 1.5rem;
`;

const AboutSection: React.FC = () => (
  <Section>
    <Glass>
      <Container>
        {/* 1 — About me */}
        <Column>
          <Header>Myself</Header>
          <Text>
            I'm a product &amp; software engineer who finds joy in crafting experiences—powerful yet quiet.
            <br /><br />
            Building since childhood (first project: a drowsy‑driver alarm), professional since 2022.
            What started with transistors became a fascination with the question of
            how those pulses end up in pop‑ups and spam. That curiosity still drives me.
          </Text>
        </Column>

        <Divider />

        {/* 2 — About this site */}
        <Column>
          <Header>This Site</Header>
          <Text>
            This page is an interactive piece that uses your location as its brush.
            No two visits are identical. A small statement that effort and care can move a stranger.
          </Text>
        </Column>
      </Container>
    </Glass>
  </Section>
);

export default AboutSection;
