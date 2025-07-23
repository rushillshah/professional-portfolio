import React from 'react';
import Section from './Section';
import ExperienceItem from './ExperienceItem';

const experiences = [
  {
    company: 'Fishface Streams',
    role: 'Lead Frontend Engineer',
    timeline: '2021 – Present',
    summary:
      'Led the development of a real-time video streaming platform, focusing on performance and user experience for millions of concurrent users.',
  },
  {
    company: 'Ipserlab',
    role: 'Software Engineer',
    timeline: '2019 – 2021',
    summary:
      'Developed and maintained data-intensive applications for scientific research, improving data processing pipelines and visualization tools.',
  },
  {
    company: 'Quickwork',
    role: 'Engineering Intern',
    timeline: '2018',
    summary:
      'Contributed to a low-code automation platform, building new integrations and improving the user interface for workflow creation.',
  },
];

const ExperienceSection: React.FC = () => {
  return (
    <Section>
      <div className="text-center mb-12">
        {/* Heading uses primary text */}
        <h2 className="font-serif text-4xl font-medium text-main-text">
          Experience
        </h2>
        {/* Subheading uses secondary text */}
        <p className="mt-2 text-sub-text">
          Where I’ve honed my craft.
        </p>
      </div>
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <ExperienceItem
            key={index}
            company={exp.company}
            role={exp.role}
            timeline={exp.timeline}
            summary={exp.summary}
          />
        ))}
      </div>
    </Section>
  );
};

export default ExperienceSection;
