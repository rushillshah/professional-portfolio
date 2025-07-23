import React from 'react';

interface ExperienceItemProps {
  company: string;
  role: string;
  timeline: string;
  summary: string;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  company,
  role,
  timeline,
  summary,
}) => (
  <div className="flex flex-col md:flex-row gap-x-8">
    <div className="md:w-1/3 mb-2 md:mb-0">
      <h3 className="text-xl font-semibold text-main-text">
        {company}
      </h3>
      <p className="text-sub-text">{role}</p>
      <p className="text-sm text-tertiary-text mt-1">
        {timeline}
      </p>
    </div>
    <div className="md:w-2/3">
      <p className="text-sub-text leading-relaxed">
        {summary}
      </p>
    </div>
  </div>
);

export default ExperienceItem;
