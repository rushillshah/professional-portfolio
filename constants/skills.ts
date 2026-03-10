type Skill = { name: string; desc: string };

export const SKILL_GROUPS: { title: string; skills: Skill[] }[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python',           desc: '7 yrs' },
      { name: 'TypeScript/JS',    desc: '6 yrs' },
      { name: 'SQL',              desc: '7 yrs' },
      { name: 'Elixir/Erlang',    desc: '2 yrs' },
      { name: 'C++',              desc: '4 yrs' },
      { name: 'Java',             desc: '4 yrs' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React',              desc: '5 yrs' },
      { name: 'Next.js',            desc: '3 yrs' },
      { name: 'Styled-components',  desc: '' },
    ],
  },
  {
    title: 'Backend & Infra',
    skills: [
      { name: 'Node.js',          desc: '6 yrs' },
      { name: 'Flask/Django',      desc: '5 yrs' },
      { name: 'Elixir/Phoenix',    desc: '2 yrs' },
      { name: 'PostgreSQL/MySQL',  desc: '6 yrs' },
      { name: 'Docker',            desc: '4 yrs' },
      { name: 'AWS',               desc: '3 yrs' },
      { name: 'Kubernetes',        desc: 'working knowledge' },
      { name: 'WebRTC',            desc: '2 yrs' },
      { name: 'Unix/Linux',        desc: '7 yrs' },
      { name: 'CI/CD',             desc: '4 yrs' },
    ],
  },
  {
    title: 'AI / LLM',
    skills: [
      { name: 'RAG systems',            desc: '2 yrs' },
      { name: 'Embeddings & semantic search', desc: '' },
      { name: 'Vector databases (Weaviate)', desc: '2 yrs' },
      { name: 'Cohere',                 desc: '2 yrs' },
      { name: 'Prompt engineering',      desc: '' },
      { name: 'LoRA/QLoRA fine-tuning', desc: 'familiarity' },
      { name: 'LLM eval & validation',  desc: '' },
    ],
  },
  {
    title: 'Misc',
    skills: [
      { name: 'Git',                    desc: '9 yrs' },
      { name: 'API integrations',       desc: '' },
      { name: 'Schema & data modeling', desc: '' },
      { name: 'Testing & debugging',    desc: '' },
    ],
  },
];
