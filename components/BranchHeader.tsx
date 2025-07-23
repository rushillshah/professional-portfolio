// components/BranchHeader.tsx
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: -5vw;
  left: 0;
  width: 90%;
  pointer-events: none;
  z-index: 1;
`;

const BranchImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: top center; 
  mix-blend-mode: multiply;
`;

const BranchHeader: React.FC = () => (
  <Wrapper>
    <BranchImg src="/assets/branch.png" alt="Branch decorative header" />
  </Wrapper>
);

export default BranchHeader;
