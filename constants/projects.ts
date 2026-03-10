export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  title: string;
  category: string;
  summary: string;
  metric?: ProjectMetric;
  link: string;
  tools: string[];
}

export const PROJECTS: Project[] = [
  {
    title: 'CodeWiser',
    category: 'AI Education',
    summary:
      'CodeWiser turns textbooks, documentation, and internal APIs into engineering exercises and practical workflows. Master complex systems before touching production. We also host hackathons and seminars, building lasting communities on campuses.',
    metric: { value: '2', label: 'hackathons' },
    link: 'https://codewiser.io',
    tools: ['TypeScript', 'Next.js', 'PostgreSQL', 'QLoRA', 'RAG', 'pgvector', 'Knex'],
  },
  {
    title: 'Resume Builder Export',
    category: 'SaaS Platform',
    summary:
      'High-fidelity PDF and Word export engine for AI-parsed CVs. Deeply customizable branding, multi-template support, and real-time preview.',
    metric: { value: '300k+', label: 'exports' },
    link: 'https://www.candidately.com/ai-resume-builder#:~:text=resumes%20into%20branded-,PDFs,-or%20Word%20files',
    tools: ['Elixir', 'Erlang', 'React', 'OpenAI API', 'AWS'],
  },
  {
    title: 'MarketLens',
    category: 'FinTech',
    summary:
      'Market analysis tool with live data, breakouts, options profiling, and relevant news feeds.',
    link: 'https://marketlens.codewiser.io',
    tools: ['TypeScript', 'Python', 'Next.js', 'FastAPI'],
  },
  {
    title: 'The Best Planner',
    category: 'AI Productivity',
    summary:
      'AI-powered habit tracker with daily planning via Google Gemini, flexible scheduling, streak tracking, GitHub-style heatmaps, and a conversational assistant for hands-free task management.',
    link: 'https://thebestplanner.xyz',
    tools: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind', 'Auth.js', 'Vercel AI SDK'],
  },
  {
    title: 'pgvector-rag',
    category: 'Open Source',
    summary:
      'Lightweight RAG toolkit for PostgreSQL + pgvector. Hybrid search, MMR, RRF fusion — 15 KB, zero dependencies.',
    link: 'https://www.npmjs.com/package/pgvector-rag',
    tools: ['TypeScript', 'PostgreSQL', 'pgvector', 'MMR', 'RRF'],
  },
  {
    title: 'kite-auto-login',
    category: 'Open Source',
    summary:
      'Auth boilerplate for Zerodha Kite that handles one-time login and persistent session management, keeping trading apps connected without manual re-auth.',
    link: 'https://www.npmjs.com/package/kite-auto-login',
    tools: ['Node.js', 'Zerodha Kite', 'Puppeteer', 'npm'],
  },
];
