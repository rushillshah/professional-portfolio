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
      { name: 'RAG systems',              desc: '2 yrs' },
      { name: 'Embeddings pipelines',     desc: '' },
      { name: 'Semantic search',          desc: '' },
      { name: 'Hybrid retrieval',         desc: '' },
      { name: 'Reranking',                desc: '' },
      { name: 'Vector databases',         desc: '' },
      { name: 'Weaviate',                 desc: '2 yrs' },
      { name: 'Cohere',                   desc: '2 yrs' },
      { name: 'LLM eval & validation',    desc: '' },
      { name: 'Prompt engineering',        desc: '' },
      { name: 'Synthetic data generation', desc: '' },
      { name: 'LoRA/QLoRA fine-tuning',   desc: 'familiarity' },
      { name: 'Inference pipeline design', desc: '' },
    ],
  },
  {
    title: 'Misc',
    skills: [
      { name: 'Git',                    desc: '9 yrs' },
      { name: 'API integrations',       desc: '' },
      { name: 'Schema & data modeling', desc: '' },
      { name: 'Auth systems',           desc: '' },
      { name: 'Testing & debugging',    desc: '' },
      { name: 'Performance optimization', desc: '' },
      { name: 'Web security fundamentals', desc: '' },
    ],
  },
];
