export const heroMetrics = [
  { label: 'Years building', value: '8+' },
  { label: 'Products launched', value: '19' },
  { label: 'Cities lived', value: '5' },
];

export const navItems = [
  { label: 'Intro', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
  { label: 'Assistant', href: '#assistant' },
];

export const timelineEntries = [
  {
    year: '2016',
    title: 'First shipped side project',
    body: 'Published a scrappy community app and learned how product decisions, storytelling, and engineering shape each other.',
    tag: 'Launch moment',
  },
  {
    year: '2019',
    title: 'Moved into product design systems',
    body: 'Built cross-platform UI kits and motion guidelines that made product teams feel faster and more consistent.',
    tag: 'Systems thinking',
  },
  {
    year: '2022',
    title: 'Led immersive brand experiences',
    body: 'Partnered with founders and teams to craft interactive narratives, marketing sites, and internal tools with real human warmth.',
    tag: 'Creative direction',
  },
  {
    year: 'Now',
    title: 'Designing the next chapter',
    body: 'Focused on AI-native experiences, personal storytelling, and portfolio moments that feel alive without feeling loud.',
    tag: 'Current focus',
  },
];

export const projectCards = [
  {
    title: 'Signal Atlas',
    subtitle: 'AI research cockpit',
    summary: 'A glassy dashboard for tracking emerging market signals, conversation summaries, and next actions in one place.',
    stack: ['Next.js', 'TypeScript', 'OpenAI', 'D3'],
  },
  {
    title: 'Northstar OS',
    subtitle: 'Design system & story engine',
    summary: 'Unified visual language, motion specs, and reusable content blocks for a distributed product and brand team.',
    stack: ['Design Tokens', 'Storybook', 'Motion'],
  },
  {
    title: 'Memory Lane',
    subtitle: 'Private family archive',
    summary: 'Turned fragmented photos, voice notes, and timelines into a warm searchable “life book” for shared remembrance.',
    stack: ['Search', 'Media', 'Accessibility'],
  },
];

export const skillGroups = [
  {
    name: 'Front-end craft',
    items: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Server Components'],
  },
  {
    name: 'Experience design',
    items: ['Information architecture', 'Interaction systems', 'Rapid prototyping', 'Motion direction', 'Brand storytelling'],
  },
  {
    name: 'AI product thinking',
    items: ['Assistant UX', 'Prompt design', 'Evaluation loops', 'Conversation design', 'Knowledge workflows'],
  },
];

export const galleryMoments = [
  {
    title: 'Mountain reset',
    caption: 'Early hikes, crisp air, and the kind of stillness that helps new ideas surface.',
  },
  {
    title: 'Studio midnight',
    caption: 'Those quiet late-night sessions where interfaces start to feel like music.',
  },
  {
    title: 'Family archive',
    caption: 'Scanning old prints and pairing them with notes so stories do not fade.',
  },
  {
    title: 'Team offsite',
    caption: 'Whiteboards, snacks, and the spark that only happens when people build together in person.',
  },
];

export const contactLinks = [
  { label: 'Email', value: 'hello@yourdomain.com' },
  { label: 'LinkedIn', value: 'linkedin.com/in/yourname' },
  { label: 'GitHub', value: 'github.com/yourname' },
];

export const assistantConversation = [
  {
    role: 'assistant' as const,
    message: 'Hi — ask me about projects, wins, career pivots, or what kind of team environments I thrive in.',
  },
  {
    role: 'user' as const,
    message: 'What kind of product work energizes you most?',
  },
  {
    role: 'assistant' as const,
    message: 'I love product spaces where systems thinking meets emotion: thoughtful tooling, AI-native flows, and interfaces that feel calm under pressure.',
  },
];
