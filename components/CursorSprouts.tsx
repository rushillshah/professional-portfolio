// FallingLeafCursor.tsx
import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const Leaf = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  background: url('/public/assets/leaf.svg') no-repeat center;
  background-size: contain;
  pointer-events: none;
  z-index: 9999;
  animation: fall-spin 4s infinite ease-in-out;

  @keyframes fall-spin {
    0% { transform: rotate(0deg) translateY(0); opacity: 1; }
    50% { transform: rotate(180deg) translateY(10px); opacity: 0.8; }
    100% { transform: rotate(360deg) translateY(20px); opacity: 1; }
  }
`;

const FallingLeafCursor: React.FC = () => {
  const leafRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (leafRef.current) {
        leafRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <Leaf ref={leafRef} />;
};

export default FallingLeafCursor;
