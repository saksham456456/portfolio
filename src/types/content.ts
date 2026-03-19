export type SocialLink = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  headline: string;
  location: string;
  summary: string;
  skills: string[];
  socialLinks: SocialLink[];
  assistant: {
    enabled: boolean;
    scopeNote: string;
  };
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  technologies: string[];
  href?: string;
  repository?: string;
  status: 'live' | 'case-study' | 'internal' | 'draft';
};

export type TimelineEntry = {
  title: string;
  organization: string;
  start: string;
  end?: string;
  location: string;
  highlights: string[];
};
