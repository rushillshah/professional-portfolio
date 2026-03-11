import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiChevronDown } from 'react-icons/fi';

type DayMode = 'day' | 'night';

interface ProjectCardProps {
  title: string;
  category: string;
  summary: string;
  metric?: { value: string; label: string };
  secondaryMetric?: { value: string; label: string };
  badge?: string;
  linkUrl?: string;
  tools?: string[];
  mode?: DayMode;
  index?: number;
  expanded?: boolean;
  onToggle?: () => void;
}

const Card = styled(motion.div)<{ $day: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1.1rem 1.3rem;
  border-radius: 0.85rem;
  background: rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  cursor: pointer;
  transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease,
    background 0.25s ease;
  isolation: isolate;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: radial-gradient(
      200px 200px at var(--mx, -200px) var(--my, -200px),
      var(--glow) 0%,
      transparent 62%
    );
    transition: background 120ms ease;
    opacity: 0.9;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--accent-start), var(--accent-end));
    border-radius: 3px 0 0 3px;
    opacity: 0.5;
    transition: opacity 0.25s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(0, 0, 0, 0.5);

    &::after {
      opacity: 1;
    }
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
`;

const Category = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TitleRow = styled.div`
  position: relative;
  padding-bottom: 0.35rem;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    border-radius: 10px;
    transform-origin: left;
    transform: scaleX(0.25);
    transition: transform 0.28s ease;
    opacity: 0.8;
  }

  ${Card}:hover &::after {
    transform: scaleX(1);
  }
`;

const Title = styled.h3`
  margin: 0;
  font-family: 'Quicksand', sans-serif;
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #fff;
`;

const MetricInline = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  flex-shrink: 0;
  margin-left: auto;
`;

const MetricValue = styled.span`
  font-family: 'Quicksand', sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MetricLabel = styled.span`
  font-size: 0.72rem;
  opacity: 0.55;
  color: #fff;
`;

const MetricDivider = styled.span`
  font-size: 0.8rem;
  opacity: 0.3;
  color: #fff;
  margin: 0 0.15rem;
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: -0.4rem;
  transform: translateY(-50%);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
  color: #000;
  z-index: 2;
`;

const ExpandIcon = styled.span<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  transition: background 0.2s ease, color 0.2s ease;
  align-self: center;

  svg {
    transition: transform 0.25s ease;
    transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
  }

  ${Card}:hover & {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }
`;

const ClipWrapper = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.3s ease;
`;

const ClipInner = styled.div`
  overflow: hidden;
`;

const ExpandedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.25rem;
`;

const Summary = styled.p`
  margin: 0;
  line-height: 1.5;
  color: #fff;
  opacity: 0.75;
  font-size: 0.82rem;
`;

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const Tag = styled.span`
  padding: 0.15rem 0.42rem;
  border-radius: 5px;
  font-size: 10px;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const VisitLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-top: 0.35rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.85);
  }

  svg {
    flex-shrink: 0;
  }
`;

const VisitHost = styled.span`
  opacity: 0.6;
  font-weight: 400;
`;

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  category,
  summary,
  metric,
  secondaryMetric,
  badge,
  linkUrl = '#',
  tools = [],
  mode = 'night',
  index = 0,
  expanded = false,
  onToggle,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const day = mode === 'day';

  const accents = useMemo(
    () =>
      (day
        ? {
            '--accent-start': '#ffdd80',
            '--accent-end': '#ff9f43',
            '--glow': 'rgba(255,221,128,.15)',
          }
        : {
            '--accent-start': '#7c3aed',
            '--accent-end': '#6ee7ff',
            '--glow': 'rgba(124,58,237,.18)',
          }) as React.CSSProperties,
    [day],
  );

  const linkHost = useMemo(() => {
    try {
      const u = new URL(linkUrl!);
      return u.host.replace(/^www\./, '');
    } catch {
      return (linkUrl || '').replace(/^https?:\/\//, '');
    }
  }, [linkUrl]);

  const onCardMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    onToggle?.();
  };

  return (
    <Card
      ref={cardRef as any}
      $day={day}
      style={accents}
      onMouseMove={onCardMove}
      onClick={handleClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {badge && <Badge>{badge}</Badge>}
      <TopRow>
        <TopLeft>
          <Category>{category}</Category>
          <TitleRow>
            <Title>{title}</Title>
          </TitleRow>
        </TopLeft>
        {metric && (
          <MetricInline>
            <MetricValue>{metric.value}</MetricValue>
            <MetricLabel>{metric.label}</MetricLabel>
            {secondaryMetric && (
              <>
                <MetricDivider>·</MetricDivider>
                <MetricValue>{secondaryMetric.value}</MetricValue>
                <MetricLabel>{secondaryMetric.label}</MetricLabel>
              </>
            )}
          </MetricInline>
        )}
        <ExpandIcon $expanded={expanded}>
          <FiChevronDown size={14} />
        </ExpandIcon>
      </TopRow>

      <ClipWrapper $open={expanded}>
        <ClipInner>
          <ExpandedContent>
            <Summary>{summary}</Summary>

            {tools.length > 0 && (
              <TagsWrap>
                {tools.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </TagsWrap>
            )}

            <VisitLink
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={12} />
              <span>Visit</span>
              <VisitHost>— {linkHost}</VisitHost>
            </VisitLink>
          </ExpandedContent>
        </ClipInner>
      </ClipWrapper>
    </Card>
  );
};

export default ProjectCard;
