import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Section from './Section';

type DayMode = 'day' | 'night';
type Skill = { name: string; desc: string };

function getModeByHour(h: number): DayMode {
  return h >= 6 && h < 18 ? 'day' : 'night';
}

const Shell = styled.div<{ day: boolean }>`
  position: relative;
  z-index: 10;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  overflow: hidden;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 1.25rem;
`;

const Title = styled.h2<{ day: boolean }>`
  position: relative;
  display: inline-block;
  margin: 0;
  font-family: 'Sono', sans-serif;
  font-size: clamp(2rem, 3.2vw, 2.5rem);
  font-weight: 500;
  color: white;
  padding-bottom: 6px;
`;

const Ledger = styled.div<{ day: boolean }>`
  position: relative;
  display: grid;
  gap: .75rem;
  --glow: ${({ day }) => (day ? 'rgba(255,221,128,.18)' : 'rgba(124,58,237,.22)')};
  border-radius: 16px;

  &::before {
    content: '';
    position: absolute; inset: 0;
    pointer-events: none;
    background: radial-gradient(200px 200px at var(--mx, -200px) var(--my, -200px), var(--glow) 0%, transparent 60%);
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

const GroupTitle = styled.h3<{ day: boolean; active: boolean }>`
  margin: 0;
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 500;
  color: white;
  position: relative;
  display: inline-block;
  padding-bottom: 2px;

  &::after {
    content: '';
    position: absolute; left: 0; right: 0; bottom: -4px; height: 2px;
    background: ${({ day }) =>
      day
        ? 'linear-gradient(90deg,#ffdd80,#ff9f43)'
        : 'linear-gradient(90deg,#7c3aed,#6ee7ff)'};
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

const Chip = styled.li<{ day: boolean }>`
  --desc-max: 0px;
  --desc-opacity: 0;

  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  height: var(--row-h);
  gap: .45rem;
  padding: 0 .7rem;
  font-size: 12px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 10px;
  backdrop-filter: blur(12px);
  transition: transform .15s ease, background .15s ease, box-shadow .15s ease;
  white-space: nowrap;
  cursor: default;
  outline: none;

  &:hover,
  &:focus {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0,0,0,.18);
    --desc-max: 420px;
    --desc-opacity: 1;
  }
`;

const Label = styled.span`
  font-weight: 500;
`;

const Sep = styled.span`
  opacity: .5;
`;

const Desc = styled.span`
  max-width: var(--desc-max);
  opacity: var(--desc-opacity);
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width .25s ease, opacity .2s ease;
`;

const activities: Skill[] = [
  { name: 'Jiujitsu',     desc: '3 years — the art of polite strangling' },
  { name: 'Scuba Diving', desc: 'PADI diver — happiest twenty metres under' },
  { name: 'Guitar',       desc: 'played until my fingers bled' },
  { name: 'Cooking',      desc: 'every recipe is a science experiment' },
];

const interests: Skill[] = [
  { name: 'Manchester United', desc: 'supported for years — it builds character' },
  { name: 'Photography',       desc: 'favourite souvenirs from travels' },
];

interface ScrollingChipsProps {
  items: Skill[];
  day: boolean;
}

const ScrollingChips: React.FC<ScrollingChipsProps> = ({ items, day }) => {
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
  }, [items, checkScrollability]);

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
    }, 260);
  };

  return (
    <ChipsWrapper>
      <ScrollArrow show={canScrollLeft} direction="left" onClick={() => pan('left')} aria-label="Scroll left">
        <FiArrowLeft size={14} />
      </ScrollArrow>
      <Chips ref={chipsRef}>
        {items.map(({ name, desc }) => (
          <Chip
            key={name}
            day={day}
            tabIndex={0}
            aria-label={`${name}: ${desc}`}
            onMouseEnter={handleChipHover}
          >
            <Label>{name}</Label>
            <Sep>—</Sep>
            <Desc>{desc}</Desc>
          </Chip>
        ))}
      </Chips>
      <ScrollArrow show={canScrollRight} direction="right" onClick={() => pan('right')} aria-label="Scroll right">
        <FiArrowRight size={14} />
      </ScrollArrow>
    </ChipsWrapper>
  );
};

const InterestsSection: React.FC = () => {
  const mode = useMemo<DayMode>(() => getModeByHour(new Date().getHours()), []);
  const day = mode === 'day';
  const ledgerRef = useRef<HTMLDivElement | null>(null);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = ledgerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Section>
      <Shell day={day}>
        <Header>
          <Title day={day}>Interests</Title>
        </Header>

        <Ledger ref={ledgerRef} day={day} onMouseMove={onMove}>
          <Group
            onMouseEnter={() => setActiveGroup(0)}
            onMouseLeave={() => setActiveGroup(prev => (prev === 0 ? null : prev))}
            onFocusCapture={() => setActiveGroup(0)}
            onBlurCapture={() => setActiveGroup(prev => (prev === 0 ? null : prev))}
          >
            <GroupTitle day={day} active={activeGroup === 0}>Activities</GroupTitle>
            <ScrollingChips items={activities} day={day} />
          </Group>

          <Group
            onMouseEnter={() => setActiveGroup(1)}
            onMouseLeave={() => setActiveGroup(prev => (prev === 1 ? null : prev))}
            onFocusCapture={() => setActiveGroup(1)}
            onBlurCapture={() => setActiveGroup(prev => (prev === 1 ? null : prev))}
          >
            <GroupTitle day={day} active={activeGroup === 1}>Interests</GroupTitle>
            <ScrollingChips items={interests} day={day} />
          </Group>
        </Ledger>
      </Shell>
    </Section>
  );
};

export default InterestsSection;