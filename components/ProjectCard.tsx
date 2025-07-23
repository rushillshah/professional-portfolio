// components/ProjectCard.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiExternalLink } from 'react-icons/fi';

interface ProjectCardProps {
  title: string;
  summary: string;
  linkUrl?: string;
}

const sway = keyframes`
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(1deg); }
`;

const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  background: rgba(16, 16, 24, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    animation: ${sway} 4s ease-in-out infinite;
  }
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-family: 'Zen Antique Soft', serif;
  font-size: 1.75rem;
  color: var(--global-text-color);
  margin: 0;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
`;

// here’s your IconWrapper:
const IconWrapper = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--global-tertiary-color);
  background: transparent;
  border: none;
  font-size: 1.25rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--global-tertiary-color);
    color: var(--global-card-color);
  }
`;

const Summary = styled.p`
  font-family: 'Inter', sans-serif;
  color: var(--global-subtext-color);
  line-height: 1.6;
  margin: 0 0 1.5rem;
  flex-grow: 1;
`;

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  summary,
  linkUrl = '#',
}) => (
  <Card>
    <TitleBar>
      <Title>{title}</Title>
      <IconWrapper
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${title}`}
      >
        <FiExternalLink size="1.25rem" />
      </IconWrapper>
    </TitleBar>

    <Summary>{summary}</Summary>
  </Card>
);

export default ProjectCard;
