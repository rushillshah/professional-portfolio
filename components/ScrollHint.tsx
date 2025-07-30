import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiArrowDown } from 'react-icons/fi';

const Wrap = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 6;
  pointer-events: none;
`;

const Pill = styled.button`
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 50px;
  font: 600 0.9rem/1 'Sono', sans-serif;
  color: hsl(0 0% 100% / 0.85);
  background: radial-gradient(circle at 50% 0%, hsl(0 0% 100% / 0.1), transparent),
              hsl(0 0% 12% / 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(0 0% 100% / 0.1);
  box-shadow: 0 4px 12px hsl(0 0% 0% / 0.2), 
              inset 0 1px 1px hsl(0 0% 100% / 0.05);
  transition: transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px hsl(0 0% 0% / 0.3), 
                inset 0 1px 1px hsl(0 0% 100% / 0.05);
  }


  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(6px);
  overflow: hidden;
`;

const Label = styled.span`
  opacity: 0.9;
`;

const ArrowIcon = styled(FiArrowDown)`
  width: 16px;
  height: 16px;
  stroke-width: 2.5px;
`;

const BottomMask = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 80px;
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(to top, hsl(0 0% 5% / 0.4), transparent);
`;

const ScrollHint: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    window.addEventListener('wheel', hide, { passive: true, once: true });
    window.addEventListener('touchstart', hide, { passive: true, once: true });
    window.addEventListener('keydown', hide, { once: true });

    return () => {
      window.removeEventListener('wheel', hide);
      window.removeEventListener('touchstart', hide);
      window.removeEventListener('keydown', hide);
    };
  }, []);

  if (!visible) return null;

  const scrollToNext = () => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section'));
    if (sections.length > 1) {
      sections[1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <BottomMask />
      <Wrap>
        <Pill onClick={scrollToNext} aria-label="Scroll to explore">
          <Label>Explore</Label>
          <ArrowIcon />
        </Pill>
      </Wrap>
    </>
  );
};

export default ScrollHint;