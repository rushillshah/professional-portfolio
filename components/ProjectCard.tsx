import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiExternalLink } from 'react-icons/fi';

type DayMode = 'day' | 'night';

interface ProjectCardProps {
  title: string;
  summary: string;
  linkUrl?: string;
  index?: number;
  mode?: DayMode;
}

const float = keyframes`
  from { transform: translateY(0); }
  50%  { transform: translateY(-2px); }
  to   { transform: translateY(0); }
`;

const Card = styled.article<{ mode: DayMode }>`
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  padding: 1.25rem 1.25rem 1.1rem;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: ${({ mode }) => (mode === 'day' ? 'rgba(255,255,255,0.12)' : 'rgba(16,16,24,0.6)')};
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute; inset: 0;
    pointer-events: none;
    background:
      radial-gradient(220px 220px at var(--mx, -200px) var(--my, -200px),
        ${({ mode }) => (mode === 'day' ? 'rgba(255,221,128,.18)' : 'rgba(124,58,237,.18)')} 0%,
        transparent 60%);
    opacity: .9;
    transition: background 120ms ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px rgba(0,0,0,.35);
    border-color: rgba(255,255,255,0.22);
  }
`;

const TitleBar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-family: 'Sono', sans-serif;
  font-size: clamp(1.05rem, 1.9vw, 1.2rem);
  font-weight: 500;
  letter-spacing: .02em;
  color: var(--global-text-color);
  animation: ${float} 6s ease-in-out infinite;
`;

const Summary = styled.p`
  margin: .25rem 0 .25rem;
  color: var(--global-subtext-color);
  line-height: 1.6;
`;

const Visit = styled.a<{ mode: DayMode }>`
  display: inline-flex; align-items: center; gap: .35rem;
  padding: .45rem .7rem; border-radius: 10px;
  font-size: .9rem; text-decoration: none;
  color: var(--global-text-color);
  background: ${({ mode }) =>
    mode === 'day' ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.08)'};
  border: 1px solid rgba(255,255,255,.16);
  transition: transform .15s ease, background .15s ease, box-shadow .15s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ mode }) =>
      mode === 'day' ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.12)'};
    box-shadow: 0 8px 18px rgba(0,0,0,.2);
  }
`;

const Actions = styled.div`
  display: flex; align-items: center; justify-content: flex-end; gap: .5rem;
`;

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  summary,
  linkUrl = '#',
  index = 0,
  mode = 'night',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <Card ref={cardRef as any} onMouseMove={onMove} mode={mode}>

      <TitleBar>
        <Title>{title}</Title>
        <Actions>
          <Visit href={linkUrl} target="_blank" rel="noopener noreferrer" mode={mode} aria-label={`Visit ${title}`}>
            <FiExternalLink size="1rem" />
            <span>Visit</span>
          </Visit>
        </Actions>
      </TitleBar>

      <Summary>{summary}</Summary>
    </Card>
  );
};

export default ProjectCard;
