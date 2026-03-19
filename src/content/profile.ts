import type { Profile } from '../types/content';

export const profile: Profile = {
  name: 'Your Name',
  headline: 'Product engineer building thoughtful AI-enhanced web experiences.',
  location: 'City, Country',
  summary:
    'Replace this summary with a short introduction that explains your background, specialties, and the kind of work you want to attract.',
  skills: ['TypeScript', 'React', 'Next.js', 'Design Systems', 'AI UX'],
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/your-handle' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
    { label: 'Email', href: 'mailto:you@example.com' }
  ],
  assistant: {
    enabled: true,
    scopeNote:
      'The assistant may answer questions using the public profile, projects, timeline entries, and curated context stored in this repository.'
  }
};
