// components/ContactSection.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { GitHubIcon, LinkedInIcon } from './icons';
import { FiMail } from 'react-icons/fi';

/* ── gentle sway ────────────────────────────────────────── */
const sway = keyframes`
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(1deg);  }
`;

/* ── layout wrappers ───────────────────────────────────── */
const Footer = styled.footer`
  padding: 4rem 1rem;
  text-align: center;
`;

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Heading = styled.h2`
  font-family: 'Sono', sans-serif;
  font-size: 2rem;
  color: var(--global-text-color);
  margin: 0;
  white-space: nowrap;
  z-index: 1000;
`;

/* ── container for the three icon wrappers ─────────────── */
const Social = styled.div`
  display: flex;
  gap: 1.25rem;
`;

/* ── individual glass wrapper for each icon ────────────── */
const IconBox = styled.a`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: inline-flex;
  transition: transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease, color 0.35s ease;
  color: var(--global-tertiary-color);

  svg { width: 1.75rem; height: 1.75rem; }

  &:hover {
    color: var(--global-text-color);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);

    svg { animation: ${sway} 3s ease-in-out infinite; }
  }
`;

/* ── component ─────────────────────────────────────────── */
const ContactSection: React.FC = () => (
  <Footer>
    <Bar>
      <Heading>Let’s connect →</Heading>

      <Social>
        <IconBox href="mailto:rushillshah2000@gmail.com" aria-label="Email">
          <FiMail />
        </IconBox>

        <IconBox href="https://github.com/rushillshah" aria-label="GitHub">
          <GitHubIcon />
        </IconBox>

        <IconBox href="https://linkedin.com/in/yourname" aria-label="LinkedIn">
          <LinkedInIcon />
        </IconBox>
      </Social>
    </Bar>
  </Footer>
);

export default ContactSection;
