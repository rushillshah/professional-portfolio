import React, { useMemo } from 'react';
import styled from 'styled-components';
import Section from './Section';
import ProjectCard from './ProjectCard';

type DayMode = 'day' | 'night';

const Glass = styled.div<{ mode: DayMode }>`
  position: relative;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: ${({ mode }) => (mode === 'day' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.32)')};
  overflow: hidden;

  @media (min-width: 768px) { padding: 3rem 2.5rem; }

  &::before {
    content: '';
    position: absolute; inset: -20% -10% auto -10%;
    height: 35%;
    background: ${({ mode }) =>
      mode === 'day'
        ? 'linear-gradient(90deg, rgba(255,221,128,.22), rgba(255,159,67,.12), rgba(255,221,128,.22))'
        : 'linear-gradient(90deg, rgba(124,58,237,.22), rgba(110,231,255,.12), rgba(124,58,237,.22))'};
    filter: blur(28px);
    pointer-events: none;
  }

  z-index: 3;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2<{ mode: DayMode }>`
  margin: 0;
  font-family: 'Sono', sans-serif;
  font-size: clamp(2rem, 3.2vw, 2.5rem);
  font-weight: 500;
  color: var(--global-text-color);
  display: inline-block;
  position: relative;
  padding-bottom: 6px;
`;

const Subtitle = styled.p`
  margin: .5rem 0 0;
  font-size: 1rem;
  color: var(--global-subtext-color);
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    gap: 2rem;
    grid-template-columns: repeat(2, 1fr);
  }
`;

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const ProjectsSection: React.FC = () => {
  const projects = [
    {
      title: 'CodeWiser',
      summary:
        'Adaptive software education with code quizzes, classrooms, analytics, and an interactive learning flow. Powered by AI.',
      link: 'https://codewiser.io',
    },
    {
      title: 'Resume Parser PDF Export',
      summary:
        'High‑fidelity PDF export for AI‑parsed CVs. 20,000+ exports since last quarter; deeply customizable branding.',
      link: 'https://www.candidately.com/ai-resume-builder#:~:text=resumes%20into%20branded-,PDFs,-or%20Word%20files',
    },
  ];

  const mode = useMemo<DayMode>(() => getModeByHour(new Date().getHours()), []);

  return (
    <Section>
      <Glass mode={mode}>
        <Header>
          <Title mode={mode}>Projects</Title>
          <Subtitle>A few builds worth sharing</Subtitle>
        </Header>

        <Grid>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              title={p.title}
              summary={p.summary}
              linkUrl={p.link}
              index={i}
              mode={mode}
            />
          ))}
        </Grid>
      </Glass>
    </Section>
  );
};

export default ProjectsSection;
