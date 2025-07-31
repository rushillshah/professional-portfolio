type Skill = { name: string; desc: string };

export const SKILL_GROUPS: { title: string; skills: Skill[] }[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python',           desc: '6 yrs' },
      { name: 'TypeScript/JS',    desc: '4 yrs' },
      { name: 'Elixir/Erlang',    desc: '1 yr' },
      { name: 'SQL',              desc: '6 yrs' },
      { name: 'C++ & Java',       desc: '3 yrs' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React',            desc: '4 yrs' },
      { name: 'Next.js',          desc: '2 yrs' },
    ],
  },
  {
    title: 'Backend & Infra',
    skills: [
      { name: 'Elixir/Phoenix',   desc: '1 yr' },
      { name: 'Node.js',          desc: '5 yrs' },
      { name: 'Flask/Django',     desc: '4 yrs' },
      { name: 'PostgreSQL/MySQL', desc: '5 yrs' },
      { name: 'Docker',           desc: '3 yrs' },
      { name: 'AWS & K8s',        desc: '2 yrs' },
      { name: 'WebRTC',           desc: '1 yr' },
      { name: 'Unix/Linux',       desc: '6 yrs' },
    ],
  },
  {
    title: 'Misc',
    skills: [
      { name: 'RAG Systems',      desc: '1 yr' },
      { name: 'Weaviate',         desc: '1 yr' },
      { name: 'Cohere',           desc: '1 yr' },
      { name: 'CI/CD',            desc: '3 yrs' },
      { name: 'Git',              desc: '8 yrs' },
      { name: 'XSS & CSRF',       desc: '1 yr' },
    ],
  },
];