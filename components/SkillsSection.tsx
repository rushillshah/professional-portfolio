import React, { useRef, useState } from 'react';
import styled from 'styled-components';

type TimeOfDay = 'day' | 'night';
interface Props { timeOfDay: TimeOfDay }
type Skill = { name: string; desc: string };

const Section = styled.div<{ day:boolean }>`
  width: 80%;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  padding: 1.6rem 0 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,.15);
  backdrop-filter: blur(6px);
  background: ${({day})=>day?'rgba(255,255,255,.15)':'rgba(0,0,0,.3)'};
`;

const Header = styled.header`
  text-align:center;
  margin-bottom: 1.25rem;
`;

const Title = styled.h2<{ day:boolean }>`
  position: relative;
  display: inline-block;
  margin: 0;
  font-family:'Sono',sans-serif;
  font-size: clamp(2rem,3.2vw,2.5rem);
  font-weight: 500;
  color: var(--global-text-color);
  padding-bottom: 6px;
`;

const Ledger = styled.div<{ day:boolean }>`
  position: relative;
  display: grid;
  gap: .75rem;
  --glow:${({day})=>day?'rgba(255,221,128,.18)':'rgba(124,58,237,.22)'};
  border-radius: 16px;
  padding: clamp(1rem,3vw,2rem);
  padding-top: 0;

  &::before{
    content:'';
    position:absolute; inset:0;
    pointer-events:none;
    background:radial-gradient(200px 200px at var(--mx,-200px) var(--my,-200px),var(--glow) 0%,transparent 60%);
    transition:background 120ms ease;
  }
`;

const Group = styled.div`
  display:grid;
  gap:.75rem;
  background:rgba(0,0,0,.24);
  border-radius:12px;
  padding:1.25rem;
  backdrop-filter:blur(12px);
`;

const GroupTitle = styled.h3<{ day:boolean; active:boolean }>`
  margin:0;
  font-size: clamp(14px,2vw,16px);
  font-weight: 500;
  color:var(--global-text-color);
  position:relative;
  display:inline-block;
  padding-bottom:2px;

  &::after{
    content:'';
    position:absolute;left:0;right:0;bottom:-4px;height:2px;
    background:${({day})=>day
      ?'linear-gradient(90deg,#ffdd80,#ff9f43)'
      :'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
    border-radius:2px;
    transform-origin:left;
    transform:scaleX(${({active})=>active?1:.1});
    opacity:${({active})=>active?.95:.6};
    transition:transform .38s ease,opacity .18s ease;
  }
`;

/* ────────────────────────── horizontally scrolling chips ────────────────────────── */
const Chips = styled.ul`
  --row-h: 36px;                 /* fixed row height to prevent vertical jitter */
  list-style:none; margin:0; padding: .25rem .25rem;
  display:flex; align-items:center;
  flex-wrap: nowrap;             /* keep a single row */
  gap:.5rem;
  min-height: calc(var(--row-h) + .5rem); /* stable container height */
  overflow-x: auto; overflow-y: hidden;   /* horizontal scroll if overflow */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  /* subtle edge fade to hint scroll */
  mask-image: linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%);

  /* thin scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.25) transparent;
}
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,.25); border-radius: 8px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

/* Chip expands text horizontally only; height stays fixed via --row-h */
const Chip = styled.li<{ day:boolean }>`
  --desc-max: 0px;
  --desc-opacity: 0;

  display:inline-flex;
  align-items:center;
  height: var(--row-h);          /* lock chip height */
  gap:.45rem;
  padding: 0 .7rem;              /* vertical height comes from fixed row height */
  font-size:12px;
  color:var(--global-text-color);
  background:${({day})=>day?'rgba(255,255,255,.75)':'rgba(255,255,255,.06)'};
  border:1px solid rgba(255,255,255,.12);
  border-radius:10px;
  backdrop-filter:blur(12px);
  transition: transform .38s ease,background .38s ease,box-shadow .38s ease;
  white-space:nowrap;
  cursor:default;
  outline:none;

  &:hover,&:focus{
    transform:translateY(-1px);
    background:${({day})=>day?'rgba(255,255,255,.9)':'rgba(255,255,255,.1)'};
    box-shadow:0 6px 18px rgba(0,0,0,.18);
    --desc-max: 420px;           /* expand horizontally */
    --desc-opacity: 1;
  }
`;

const Label = styled.span`
  font-weight: 500;
`;

const Sep = styled.span`
  opacity:.5;
`;

const Desc = styled.span`
  max-width: var(--desc-max);
  opacity: var(--desc-opacity);
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width .38s ease, opacity .38s ease;
`;

const groups: { title: string; skills: Skill[] }[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python',           desc: '6 yrs' },
      { name: 'TypeScript/JS',    desc: '4 yrs' },
      { name: 'Elixir/Erlang',    desc: '1 yr' },
      { name: 'SQL',              desc: '6 yrs' },
      { name: 'C++ & Java',       desc: '3 yrs' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React',            desc: '4 yrs' },
      { name: 'Next.js',          desc: '2 yrs' },
    ],
  },
  {
    title: 'Backend & Infra',
    skills: [
      { name: 'Elixir/Phoenix',   desc: '1 yr' },
      { name: 'Node.js',          desc: '5 yrs' },
      { name: 'Flask/Django',     desc: '4 yrs' },
      { name: 'PostgreSQL/MySQL', desc: '5 yrs' },
      { name: 'Docker',           desc: '3 yrs' },
      { name: 'AWS & K8s',        desc: '2 yrs' },
      { name: 'WebRTC',           desc: '1 yr' },
      { name: 'Unix/Linux',       desc: '6 yrs' },
    ],
  },
  {
    title: 'Misc',
    skills: [
      { name: 'RAG Systems',      desc: '1 yr' },
      { name: 'Weaviate',         desc: '1 yr' },
      { name: 'Cohere',           desc: '1 yr' },
      { name: 'CI/CD',                   desc: '3 yrs' },
      { name: 'Git',                     desc: '8 yrs' },
      { name: 'XSS & CSRF',              desc: '1 yr' },
    ],
  },
];

const SkillsSection:React.FC<Props> = ({ timeOfDay })=>{
  const isDay = timeOfDay==='day';
  const ledgerRef = useRef<HTMLDivElement|null>(null);
  const [activeGroup,setActiveGroup] = useState<number|null>(null);

  const handleMove:React.MouseEventHandler<HTMLDivElement> = e =>{
    const el = ledgerRef.current;
    if(!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx',`${e.clientX - r.left}px`);
    el.style.setProperty('--my',`${e.clientY - r.top}px`);
  };

  return(
    <Section id="skills" day={isDay}>
      <Header>
        <Title day={isDay}>Skills</Title>
      </Header>

      <Ledger ref={ledgerRef} day={isDay} onMouseMove={handleMove}>
        {groups.map((g,i)=>(
          <Group key={g.title}
            onMouseEnter={()=>setActiveGroup(i)}
            onMouseLeave={()=>setActiveGroup(prev=>prev===i?null:prev)}
            onFocusCapture={()=>setActiveGroup(i)}
            onBlurCapture={()=>setActiveGroup(prev=>prev===i?null:prev)}
          >
            <GroupTitle day={isDay} active={activeGroup===i}>{g.title}</GroupTitle>
            <Chips>
              {g.skills.map(skill=>(
                <Chip key={skill.name} day={isDay} tabIndex={0} aria-label={`${skill.name}: ${skill.desc}`}>
                  <Label>{skill.name}</Label>
                  <Sep>—</Sep>
                  <Desc>{skill.desc}</Desc>
                </Chip>
              ))}
            </Chips>
          </Group>
        ))}
      </Ledger>
    </Section>
  );
};

export default SkillsSection;
