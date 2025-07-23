// components/ProjectsSection.tsx
import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import ProjectCard from './ProjectCard';

/* ——— shared header ——— */
const Header = styled.header`
  text-align:center;
  margin-bottom:3rem;
`;
const Title = styled.h2`
  font-family:'Noto Serif JP',serif;
  font-size:2.25rem;
  font-weight:500;
  color:var(--global-text-color);
  @media(min-width:768px){ font-size:2.5rem; }
`;
const Subtitle = styled.p`
  margin-top:.5rem;
  font-size:1rem;
  color:var(--global-subtext-color);
`;

/* ——— projects grid ——— */
const Grid = styled.div`
  display:grid;
  gap:2rem;
  grid-template-columns:1fr;
  @media(min-width:768px){ grid-template-columns:repeat(2,1fr); }
`;

/* ——— glassy dark card wrapper ——— */
const Card = styled.div`
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

const ProjectsSection:React.FC = () => {
  const projects = [
    { title:'CodeWiser',        summary:'Adaptive software education platform with code quizzes, classrooms and more', link:'https://codewiser.io' },
    { title:'Resume Parser PDF Export',             summary:'PDF export system for AI-parsed CVs. Since launch last quarter -> 20000+ resume exports. Also super customizable!', link: 'https://www.candidately.com/ai-resume-builder#:~:text=resumes%20into%20branded-,PDFs,-or%20Word%20files'},
  ];

  return (
    <Section>
      <Card>
        <Header>
          <Title>Projects</Title>
          <Subtitle>A selection of works worth sharing.</Subtitle>
        </Header>

        <Grid>
          {projects.map((p, idx)=>(
            <ProjectCard key={idx} title={p.title} summary={p.summary} linkUrl={p.link}/>
          ))}
        </Grid>
      </Card>
    </Section>
  );
};

export default ProjectsSection;
