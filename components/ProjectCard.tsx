import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiExternalLink } from 'react-icons/fi';

type DayMode = 'day' | 'night';

interface ProjectCardProps {
  title: string;
  summary: string;
  linkUrl?: string;
  tools?: string[];
  mode?: DayMode;
}

const Card = styled.article`
  position: relative;
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 0.9rem;
  padding: 1.1rem;
  border-radius: 10px;
  background: rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  transition: box-shadow .22s ease, border-color .22s ease;
  isolation: isolate;

  &::before{
    content:'';
    position:absolute; inset:0; pointer-events:none; border-radius: 10px;
    background: radial-gradient(220px 220px at var(--mx, -200px) var(--my, -200px), var(--glow) 0%, transparent 62%);
    transition: background 120ms ease;
    opacity: .95;
  }

  &:hover {
    box-shadow: 0 14px 34px rgba(0,0,0,.35);
    border-color: rgba(255,255,255,.22);
    --ul: 1;
  }
`;

const TitleBar = styled.div`
  position: relative;
  display: flex; align-items: center;
  gap: .75rem;
  padding-bottom: .4rem;

  &::after{
    content:''; position:absolute; left:0; right:0; bottom:-2px; height:2px;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    border-radius: 10px;
    transform-origin: left;
    transform: scaleX(var(--ul, .15));
    transition: transform .28s ease;
    opacity: .9;
  }
  
  @media (max-width: 990px) {
    flex-direction: column;
    align-items: flex-start;
    gap: .6rem;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-family: 'Sono', sans-serif;
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  font-weight: 600;
  letter-spacing: .01em;
  color: #fff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  flex: 1 1 auto;
`;

const Summary = styled.p`
  margin: .1rem 0 0;
  line-height: 1.55;
  color: #fff;
  opacity: .95;
`;

const VisitWrap = styled.div`
  display:flex; align-items:center; justify-content:flex-end;

  @media (max-width: 990px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const Pill = styled.span`
  --row-h: 38px;
  --desc-max: 0px;
  --desc-opacity: 0;

  position: relative; overflow: hidden;
  display: inline-flex; align-items: center;
  height: var(--row-h);
  gap: .5rem;
  padding: 0 .75rem;
  font-size: 12px;
  color: #fff;
  background: rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  transition: background .25s ease, box-shadow .25s ease;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute; inset: -2px;
    pointer-events: none;
    background: radial-gradient(140px 100px at var(--cx,-50px) var(--cy,-50px), rgba(255,255,255,.28) 0%, transparent 60%);
    filter: blur(12px);
    opacity: 0;
    transition: opacity .18s ease;
  }

  &:hover, &:focus-within {
    box-shadow: 0 8px 20px rgba(0,0,0,.22);
    --desc-max: 520px;
    --desc-opacity: 1;
  }
  &:hover::before, &:focus-within::before { opacity: 1; }
`;

const PillLink = styled(Pill).attrs({ as: 'a' })`
  text-decoration: none; cursor: pointer;
`;

const Label = styled.span` font-weight: 600; `;
const Sep   = styled.span` opacity: .5; `;
const Reveal = styled.span`
  max-width: var(--desc-max);
  opacity: var(--desc-opacity);
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width .3s ease, opacity .25s ease;
`;

const ToolsBlock = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: auto auto;
  gap: .4rem;
`;

const ToolsTrigger = styled.button`
  appearance: none; border: 0; background: transparent; padding: 0; cursor: pointer;
  width: 4rem;
  display: inline-flex; align-items: center;
  height: 38px; gap: .5rem; padding: 0 .75rem;
  font-size: 12px; color: #fff;
  background: rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  transition: box-shadow .25s ease;

  &:hover { box-shadow: 0 8px 20px rgba(0,0,0,.22); }
  &:focus { outline: none; box-shadow: 0 0 0 2px rgba(255,255,255,.25) inset; }
`;

const ToolsPanel = styled.div<{ open:boolean }>`
  background: rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 10px;
  padding: ${p => p.open ? '.6rem' : '0 .6rem'};
  margin: 0 .25rem;
  overflow: hidden;
  max-height: ${p => p.open ? '320px' : '0'};
  opacity: ${p => p.open ? 1 : 0};
  transition: max-height .28s ease, opacity .22s ease, padding .22s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  & > div {
    max-height: 280px;
    overflow: auto;
    padding-right: .25rem;
  }
  & > div::-webkit-scrollbar { width: 8px; }
  & > div::-webkit-scrollbar-thumb { background: rgba(255,255,255,.25); border-radius: 10px; }
  & > div::-webkit-scrollbar-track { background: transparent; }
`;

const ToolsList = styled.ul`
  margin: 0; padding: 0; list-style: none;
  display: flex; flex-wrap: wrap; gap: .45rem;
`;

const ToolTag = styled.li`
  padding: .28rem .55rem;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1;
  color: #fff;
  background: rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,.14);
`;

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  summary,
  linkUrl = '#',
  tools = [],
  mode = 'night',
}) => {
  const [open, setOpen] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const accents = useMemo(
    () =>
      (mode === 'day'
        ? {
            '--accent-start': '#ffdd80',
            '--accent-end':   '#ff9f43',
            '--glow':         'rgba(255,221,128,.18)',
          }
        : {
            '--accent-start': '#7c3aed',
            '--accent-end':   '#6ee7ff',
            '--glow':         'rgba(124,58,237,.22)',
          }) as React.CSSProperties,
    [mode]
  );

  const linkHost = useMemo(() => {
    try {
      const u = new URL(linkUrl!);
      return u.host.replace(/^www\./, '');
    } catch { return (linkUrl || '').replace(/^https?:\/\//, ''); }
  }, [linkUrl]);

  const onCardMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const onVisitMove: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const target = e.currentTarget as HTMLElement;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--cx', `${e.clientX - r.left}px`);
    target.style.setProperty('--cy', `${e.clientY - r.top}px`);
  };

  const openNow = () => {
    if (hoverTimer.current) { window.clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    setOpen(true);
  };
  const closeSoon = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  return (
    <Card ref={cardRef as any} style={accents} onMouseMove={onCardMove}>
      <TitleBar>
        <Title>{title}</Title>
        <VisitWrap>
          <PillLink
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${title} at ${linkHost}`}
            tabIndex={0}
            onMouseMove={onVisitMove}
          >
            <Label style={{ display:'inline-flex', alignItems:'center', gap:'.35rem' }}>
              <FiExternalLink size="1rem" />
              Visit
            </Label>
            <Sep>—</Sep>
            <Reveal>{linkHost}</Reveal>
          </PillLink>
        </VisitWrap>
      </TitleBar>

      <Summary>{summary}</Summary>

      <ToolsBlock
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
        onFocus={openNow}
        onBlur={(e) => {
          if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) closeSoon();
        }}
      >
        <ToolsTrigger
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="tools-panel"
          onClick={() => setOpen(v => !v)}
        >
          <Label>Tools</Label>
        </ToolsTrigger>

        <ToolsPanel id="tools-panel" role="region" open={open}>
          <div>
            <ToolsList>
              {tools.map((t) => <ToolTag key={t}>{t}</ToolTag>)}
            </ToolsList>
          </div>
        </ToolsPanel>
      </ToolsBlock>
    </Card>
  );
};

export default ProjectCard;