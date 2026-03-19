import type { Project } from '../types/content';

export const projects: Project[] = [
  {
    slug: 'ai-portfolio-assistant',
    name: 'AI Portfolio Assistant',
    summary: 'Conversational layer that helps visitors explore projects, experience, and skills.',
    technologies: ['Next.js', 'TypeScript', 'AI SDK'],
    href: 'https://example.com',
    repository: 'https://github.com/your-handle/portfolio',
    status: 'case-study'
  },
  {
    slug: 'design-system-foundations',
    name: 'Design System Foundations',
    summary: 'Reusable tokens and components for shipping consistent product interfaces faster.',
    technologies: ['React', 'Storybook', 'CSS Variables'],
    status: 'internal'
  }
];
