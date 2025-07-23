// components/RevealSection.tsx
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section<{visible:boolean}>`
  opacity: ${({visible}) => (visible ? 1 : 0)};
  transform: translateY(${({visible}) => (visible ? '0' : '40px')});
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
`;

const RevealSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref   = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShow(true),
      { threshold: 0.25 }
    );
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return <Wrapper ref={ref} visible={show}>{children}</Wrapper>;
};

export default RevealSection;
