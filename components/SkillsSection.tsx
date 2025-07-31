import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import styled from 'styled-components';

import { TimeOfDay } from '../hooks/celestialPosition';


import { SKILL_GROUPS } from '@/constants/skills';

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
   background: rgba(0, 0, 0, 0.5);
`;

const Header = styled.header`
  text-align:center;
  margin-bottom: 1.25rem;
`;

const Title = styled.h2`
  position: relative;
  display: inline-block;
  margin: 0;
  font-family:'Sono',sans-serif;
  font-size: clamp(2rem,3.2vw,2.5rem);
  font-weight: 500;
  color: white;
  padding-bottom: 6px;
`;

const Ledger = styled.div`
  position: relative;
  display: grid;
  gap: .75rem;
  border-radius: 16px;
  padding: clamp(1rem,3vw,2rem);
  padding-top: 0;

  &::before{
    content:'';
    position:absolute; inset:0;
    pointer-events:none;
    background: radial-gradient(
      200px 200px at var(--mx,-200px) var(--my,-200px),
      var(--glow) 0%,
      transparent 60%
    );
    transition: background 120ms ease;
  }
`;

const Group = styled.div`
  display:grid;
  gap:.75rem;
  background:rgba(0,0,0,.24);
  border-radius:12px;
  padding:1.25rem;
  backdrop-filter:blur(12px);
  overflow: hidden;
`;

const GroupTitle = styled.h3<{ active:boolean }>`
  margin:0;
  font-size: clamp(14px,2vw,16px);
  font-weight: 500;
  color:white;
  position:relative;
  display:inline-block;
  padding-bottom:2px;

  &::after {
    content: '';
    position: absolute; left: 0; right: 0; bottom: -4px; height: 2px;
    background: linear-gradient(90deg,var(--accent-start),var(--accent-end));
    border-radius: 2px;
    transform-origin: left;
    transform: scaleX(${({ active }) => (active ? 1 : 0.10)});
    opacity: ${({ active }) => (active ? 0.95 : 0.6)};
    transition: transform .38s ease, opacity .38s ease;
  }
`;

const ChipsWrapper = styled.div`
  position: relative;
  min-width: 0;
`;

const Chips = styled.ul`
  --row-h: 36px;
  list-style:none; margin:0; padding: .25rem 0;
  display:flex; align-items:center;
  flex-wrap: nowrap;
  gap:.5rem;
  min-height: calc(var(--row-h) + .5rem);
  overflow-x: auto; overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ScrollArrow = styled.button<{ show: boolean; direction: 'left' | 'right' }>`
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%) ${({ show }) => (show ? 'scale(1)' : 'scale(0.5)')};
  ${({ direction }) => (direction === 'left' ? 'left: -22px;' : 'right: -22px;')}
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  padding: 0;
  opacity: ${({ show }) => (show ? 1 : 0)};
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  transition: all 0.25s ease;

  &:hover {
    background: rgba(0,0,0,0.6);
    transform: translateY(-50%) scale(1.05);
  }
`;

const Chip = styled.li<{ day:boolean }>`
  --desc-max: 0px;
  --desc-opacity: 0;
  position: relative; overflow: hidden;

  display:inline-flex;
  align-items:center;
  flex-shrink: 0;
  height: var(--row-h);
  gap:.45rem;
  padding: 0 .7rem;
  font-size:12px;
  color:white;
  background: rgba(0, 0, 0, 0.5);
  border:1px solid rgba(255,255,255,.12);
  border-radius:10px;
  backdrop-filter:blur(12px);
  transition: transform .38s ease,background .38s ease,box-shadow .38s ease;
  white-space:nowrap;
  cursor:default;
  outline:none;

  &::before{
    content:'';
    position:absolute; inset:-2px;
    pointer-events:none;
    background: radial-gradient(
      140px 100px at var(--cx,-50px) var(--cy,-50px),
      var(--chip-glow) 0%,
      transparent 60%
    );
    filter: blur(12px);
    opacity: 0;
    transition: opacity .18s ease;
  }

  &:hover,&:focus{
    transform:translateY(-1px);
    box-shadow:0 6px 18px rgba(0,0,0,.18);
    --desc-max: 420px;
    --desc-opacity: 1;
  }

  &:hover::before,&:focus::before{ opacity: 1; }
`;

const Label = styled.span` font-weight: 500; `;
const Sep   = styled.span` opacity:.5; `;
const Desc  = styled.span`
  max-width: var(--desc-max);
  opacity: var(--desc-opacity);
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width .38s ease, opacity .38s ease;
`;



interface ScrollingChipsProps {
  skills: Skill[];
  day: boolean;
  onChipMove: React.MouseEventHandler<HTMLUListElement>;
}

const ScrollingChips: React.FC<ScrollingChipsProps> = ({ skills, day }) => {
  const chipsRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = chipsRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(hasOverflow && el.scrollLeft > 5);
      setCanScrollRight(hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    const element = chipsRef.current;
    if (!element) return;
    checkScrollability();
    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(element);
    element.addEventListener('scroll', checkScrollability, { passive: true });

    return () => {
      resizeObserver.unobserve(element);
      element.removeEventListener('scroll', checkScrollability);
    };
  }, [skills, checkScrollability]);

  const pan = (direction: 'left' | 'right') => {
    const el = chipsRef.current;
    if (el) {
      const panAmount = el.clientWidth * 0.7;
      el.scrollBy({
        left: direction === 'left' ? -panAmount : panAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleChipHover = (e: React.MouseEvent<HTMLLIElement>) => {
    const liElement = e.currentTarget;
    const containerElement = chipsRef.current;
    if (!liElement || !containerElement) return;

    setTimeout(() => {
      if (liElement.matches(':hover')) {
        const chipLeft = liElement.offsetLeft;
        const chipRight = chipLeft + liElement.offsetWidth;
        const containerScrollLeft = containerElement.scrollLeft;
        const containerVisibleRight = containerScrollLeft + containerElement.clientWidth;

        if (chipLeft < containerScrollLeft) {
          containerElement.scrollTo({
            left: chipLeft - 15,
            behavior: 'smooth',
          });
        } else if (chipRight > containerVisibleRight) {
          const scrollAmount = chipRight - containerVisibleRight + 15;
          containerElement.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
          });
        }
      }
    }, 390);
  };

  return (
    <ChipsWrapper>
        <ScrollArrow show={canScrollLeft} direction="left" onClick={() => pan('left')} aria-label="Scroll left">
          <FiArrowLeft size={14} />
        </ScrollArrow>
      <Chips ref={chipsRef}>
        {skills.map(skill => (
          <Chip
            key={skill.name}
            day={day}
            data-chip
            tabIndex={0}
            aria-label={`${skill.name}: ${skill.desc}`}
            onMouseEnter={handleChipHover}
          >
            <Label>{skill.name}</Label>
            <Sep>—</Sep>
            <Desc>{skill.desc}</Desc>
          </Chip>
        ))}
      </Chips>
      <ScrollArrow show={canScrollRight} direction="right" onClick={() => pan('right')} aria-label="Scroll right">
        <FiArrowRight size={14}/>
      </ScrollArrow>
    </ChipsWrapper>
  );
};


const SkillsSection:React.FC<Props> = ({ timeOfDay })=>{
  const isDay = timeOfDay==='day';
  const ledgerRef = useRef<HTMLDivElement|null>(null);
  const [activeGroup,setActiveGroup] = useState<number|null>(null);

  const accents = useMemo(
    () =>
      (isDay
        ? {
            '--accent-start': '#ffdd80',
            '--accent-end':   '#ff9f43',
            '--glow':         'rgba(255,221,128,.18)',
            '--chip-glow':    'rgba(255,221,128,.30)',
          }
        : {
            '--accent-start': '#7c3aed',
            '--accent-end':   '#6ee7ff',
            '--glow':         'rgba(124,58,237,.22)',
            '--chip-glow':    'rgba(124,58,237,.28)',
          }) as React.CSSProperties,
    [isDay]
  );

  const handleMove:React.MouseEventHandler<HTMLDivElement> = e =>{
    const el = ledgerRef.current;
    if(!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx',`${e.clientX - r.left}px`);
    el.style.setProperty('--my',`${e.clientY - r.top}px`);
  };

  const handleChipMove:React.MouseEventHandler<HTMLUListElement> = (e) => {
    const target = (e.target as HTMLElement).closest('li[data-chip]') as HTMLElement | null;
    if (!target) return;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--cx', `${e.clientX - r.left}px`);
    target.style.setProperty('--cy', `${e.clientY - r.top}px`);
  };

  return(
    <Section id="skills" day={isDay} style={accents}>
      <Header>
        <Title>Skills</Title>
      </Header>

      <Ledger ref={ledgerRef} onMouseMove={handleMove}>
        {SKILL_GROUPS.map((g,i)=>(
          <Group key={g.title}
            onMouseEnter={()=>setActiveGroup(i)}
            onMouseLeave={()=>setActiveGroup(prev=>prev===i?null:prev)}
            onFocusCapture={()=>setActiveGroup(i)}
            onBlurCapture={()=>setActiveGroup(prev=>prev===i?null:prev)}
          >
            <GroupTitle active={activeGroup===i}>{g.title}</GroupTitle>
            <ScrollingChips
              skills={g.skills}
              day={isDay}
              onChipMove={handleChipMove}
            />
          </Group>
        ))}
      </Ledger>
    </Section>
  );
};

export default SkillsSection;