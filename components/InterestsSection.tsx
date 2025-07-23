// components/InterestsSection.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Section from './Section';

const sway = keyframes`
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(1deg); }
`;

const facts = [
  { preview: 'Manchester United', full: 'I’ve supported Man United for years. I’m told it builds character' },
  { preview: 'Jiujitsu',          full: 'Spent 3 years training the art of politely strangling friends.' },
  { preview: 'Scuba Diving',      full: 'PADI diver - happiest twenty metres under.' },
  { preview: 'Guitar',            full: 'Truly played it till my fingers bled.' },
  { preview: 'Photography',       full: 'My favorite souvenirs are the photos I bring back from my travels' },
];

const Glass = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  z-index: 10000;
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  background: rgba(16,16,24,.55);
  backdrop-filter: blur(6px);
  box-shadow: 0 20px 40px rgba(0,0,0,.25);
  position: relative;
`;

/* ─── grid layout ─── */
const Grid = styled.ul`
  list-style:none;
  display:grid;
  gap:1.5rem;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  margin:0;
  padding:0;
  z-index: 1000;
`;

/* ─── toggle card ─── */
const Toggle = styled.details`
  padding:1.5rem;
  border-radius:1rem;
  background:rgba(0,0,0,.3);
  border:1px solid rgba(255,255,255,.15);
  backdrop-filter:blur(6px);
  transition:transform .4s ease,box-shadow .4s ease,background .4s ease;
  overflow:hidden;

  &:hover{
    box-shadow:0 8px 24px rgba(0,0,0,.6);
    animation:${sway} 3s ease-in-out infinite;
  }

  summary{
    list-style:none;
    font-family:'Inter',sans-serif;
    font-size:1.125rem;
    color:var(--global-text-color);
    display:flex;
    align-items:center;
    gap:.75rem;
    cursor:pointer;
    &::-webkit-details-marker{display:none;}
  }

  summary::before{
    content:'';
    width:.9rem;height:.9rem;
    border-radius:50% 50% 0 50%;
    background:var(--global-tertiary-color);
    transform:rotate(-45deg);
    flex-shrink:0;
    transition:transform .35s ease;
  }
  &[open] summary::before{transform:rotate(0deg) scale(1.15);}

  p{
    margin:.75rem 0 0;
    font-size:1rem;
    line-height:1.6;
    color:var(--global-subtext-color);
  }
`;

/* ─── component ─── */
const InterestsSection: React.FC = () => (
  <Section>
    <Glass>
      <h2 className="font-serif text-4xl font-medium text-main-text text-center mb-8">
        Interests
      </h2>

      <Grid>
        {facts.map(({ preview, full }) => (
          <li key={preview}>
            <Toggle open>
              <summary>{preview}</summary>
              <p>{full}</p>
            </Toggle>
          </li>
        ))}
      </Grid>
    </Glass>
  </Section>
);

export default InterestsSection;
