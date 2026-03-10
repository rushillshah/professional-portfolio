import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Section from './Section';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '@/constants/projects';

type DayMode = 'day' | 'night';

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

    & > *:last-child:nth-child(odd) {
      grid-column: 1 / -1;
      max-width: 50%;
      justify-self: center;
    }
  }
`;

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const ProjectsSection: React.FC = () => {
  const mode = useMemo<DayMode>(() => getModeByHour(new Date().getHours()), []);
  const day = mode === 'day';
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const getRow = (index: number) => Math.floor(index / 2);

  const handleToggle = (index: number) => {
    const row = getRow(index);
    setExpandedRow((prev) => (prev === row ? null : row));
  };

  return (
    <Section>
      <Header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Title $day={day}>Projects</Title>
        <Subtitle>Things I've built and shipped</Subtitle>
      </Header>

      <Grid>
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            category={project.category}
            summary={project.summary}
            metric={project.metric}
            linkUrl={project.link}
            mode={mode}
            tools={project.tools}
            index={index}
            expanded={expandedRow === getRow(index)}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </Grid>
    </Section>
  );
};

export default ProjectsSection;
