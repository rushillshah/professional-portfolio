import React from 'react'
import styled from 'styled-components'

interface SectionProps {
  children: React.ReactNode
}

const SectionWrapper = styled.section`
  width: 100%;
  padding: 4rem 0;
  @media (min-width: 640px) {
    padding: 6rem 0;
  }
`

const SectionContent = styled.div`
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  @media (min-width: 1024px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`

const Section: React.FC<SectionProps> = ({ children }) => (
  <SectionWrapper>
    <SectionContent>{children}</SectionContent>
  </SectionWrapper>
)

export default Section
