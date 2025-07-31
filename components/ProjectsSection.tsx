import React, { useMemo } from 'react';
import styled from 'styled-components';
import Section from './Section';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '@/constants/projects';

type DayMode = 'day' | 'night';

const Glass = styled.div<{ mode: DayMode }>`
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

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2<{ mode: DayMode }>`
  margin: 0;
  font-family: 'Sono', sans-serif;
  font-size: clamp(2rem, 3.2vw, 2.5rem);
  font-weight: 500;
  color: white;
  display: inline-block;
  position: relative;
  padding-bottom: 6px;
`;

const Subtitle = styled.p`
  margin: .5rem 0 0;
  font-size: 1rem;
  color: white;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 990px) {
    gap: 2rem;
    grid-template-columns: repeat(2, 1fr);
  }
`;

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const ProjectsSection: React.FC = () => {
  const mode = useMemo<DayMode>(() => getModeByHour(new Date().getHours()), []);

  return (
    <Section>
      <Glass mode={mode}>
        <Header>
          <Title mode={mode}>Projects</Title>
          <Subtitle>A few builds worth sharing</Subtitle>
        </Header>

        <Grid>
          {PROJECTS.map((p) => (
            <ProjectCard
              key={p.title}
              title={p.title}
              summary={p.summary}
              linkUrl={p.link}
              mode={mode}
              tools={p.tools}
            />
          ))}
        </Grid>
      </Glass>
    </Section>
  );
};

export default ProjectsSection;
