export type DateString = `${number}` | `${number}-${number}` | `${number}-${number}-${number}`;

export type Profile = {
  schemaVersion: number;
  identity: {
    name: string;
    preferredName?: string;
    role: string;
    location?: string;
    timeZone?: string;
    email?: string;
    website?: string;
  };
  bio: {
    short: string;
    long: string;
    lifeStory: string;
    mission?: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: DateString;
    endDate: DateString | null;
    location?: string;
    highlights: string[];
  }>;
  workExperience: Array<{
    id: string;
    company: string;
    title: string;
    employmentType?: string;
    location?: string;
    startDate: DateString;
    endDate: DateString | null;
    summary: string;
    highlights: string[];
    tools: string[];
  }>;
  achievements: Array<{
    id: string;
    title: string;
    date: DateString;
    description: string;
    tags: string[];
  }>;
  favorites: {
    tools: string[];
    technologies: string[];
    workflows: string[];
  };
  personality: {
    hobbies: string[];
    traits: string[];
    workingStyle: string[];
  };
  privacyBoundaries: {
    shareableTopics: string[];
    restrictedTopics: string[];
    answerRules: string[];
  };
};

export type Timeline = {
  schemaVersion: number;
  milestones: Array<{
    id: string;
    date: DateString;
    title: string;
    category: "education" | "work" | "achievement" | "personal" | "project";
    summary: string;
    details: string[];
    relatedIds?: string[];
  }>;
};

export type Projects = {
  schemaVersion: number;
  projects: Array<{
    id: string;
    name: string;
    slug: string;
    status: "active" | "completed" | "archived" | "planned";
    summary: string;
    description: string;
    startDate: DateString;
    endDate: DateString | null;
    roles: string[];
    highlights: string[];
    tools: string[];
    links: Array<{
      label: string;
      url: string;
    }>;
    tags: string[];
  }>;
};

export type Skills = {
  schemaVersion: number;
  skillGroups: Array<{
    id: string;
    label: string;
    skills: Array<{
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
      years?: number;
      keywords: string[];
    }>;
  }>;
};

export type FAQ = {
  schemaVersion: number;
  items: Array<{
    id: string;
    question: string;
    answer: string;
    tags: string[];
  }>;
};

export type Preferences = {
  schemaVersion: number;
  preferences: {
    availability: {
      collaborationModes: string[];
      engagementTypes: string[];
    };
    projectPreferences: {
      favoriteProblemTypes: string[];
      preferredTeamTraits: string[];
      nonPreferredWork: string[];
    };
    assistantBehavior: {
      defaultAnswerStyle: string;
      citationPreference: string;
      fallbackRule: string;
    };
  };
};

export type WritingStyle = {
  schemaVersion: number;
  voice: {
    tone: string[];
    communicationStyle: string[];
    dos: string[];
    donts: string[];
    sampleSignature?: string;
  };
};

export type RawPersonalContent = {
  profile: Profile;
  timeline: Timeline;
  projects: Projects;
  skills: Skills;
  faq: FAQ;
  preferences: Preferences;
  writingStyle: WritingStyle;
};

export type PageSectionProps = {
  hero: {
    name: string;
    role: string;
    shortBio: string;
    location?: string;
    mission?: string;
  };
  about: {
    longBio: string;
    lifeStory: string;
    traits: string[];
    hobbies: string[];
  };
  experience: Profile["workExperience"];
  education: Profile["education"];
  achievements: Profile["achievements"];
  projects: Projects["projects"];
  skills: Array<{
    label: string;
    items: string[];
  }>;
  faq: FAQ["items"];
  preferences: Preferences["preferences"];
  voice: WritingStyle["voice"];
};

export type NormalizedTimelineEntry = {
  id: string;
  date: DateString;
  title: string;
  category: string;
  description: string;
  relatedIds: string[];
};

export type AIContextChunk = {
  id: string;
  section: string;
  title: string;
  content: string;
  keywords: string[];
};

export type NormalizedPersonalContent = {
  pageSections: PageSectionProps;
  timelineEntries: NormalizedTimelineEntry[];
  aiContextChunks: AIContextChunk[];
};

export function normalizePersonalContent(raw: RawPersonalContent): NormalizedPersonalContent {
  return {
    pageSections: createPageSectionProps(raw),
    timelineEntries: createTimelineEntries(raw),
    aiContextChunks: createAIContextChunks(raw)
  };
}

export function createPageSectionProps(raw: RawPersonalContent): PageSectionProps {
  return {
    hero: {
      name: raw.profile.identity.preferredName ?? raw.profile.identity.name,
      role: raw.profile.identity.role,
      shortBio: raw.profile.bio.short,
      location: raw.profile.identity.location,
      mission: raw.profile.bio.mission
    },
    about: {
      longBio: raw.profile.bio.long,
      lifeStory: raw.profile.bio.lifeStory,
      traits: raw.profile.personality.traits,
      hobbies: raw.profile.personality.hobbies
    },
    experience: raw.profile.workExperience,
    education: raw.profile.education,
    achievements: raw.profile.achievements,
    projects: raw.projects.projects,
    skills: raw.skills.skillGroups.map((group) => ({
      label: group.label,
      items: group.skills.map((skill) => skill.name)
    })),
    faq: raw.faq.items,
    preferences: raw.preferences.preferences,
    voice: raw.writingStyle.voice
  };
}

export function createTimelineEntries(raw: RawPersonalContent): NormalizedTimelineEntry[] {
  return raw.timeline.milestones
    .map((milestone) => ({
      id: milestone.id,
      date: milestone.date,
      title: milestone.title,
      category: milestone.category,
      description: [milestone.summary, ...milestone.details].join(" "),
      relatedIds: milestone.relatedIds ?? []
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function createAIContextChunks(raw: RawPersonalContent): AIContextChunk[] {
  const profile = raw.profile;

  const baseChunks: AIContextChunk[] = [
    {
      id: "context-profile-summary",
      section: "profile",
      title: "Profile summary",
      content: [
        `${profile.identity.name} is a ${profile.identity.role}.`,
        profile.bio.short,
        profile.bio.long,
        `Mission: ${profile.bio.mission ?? "Not specified"}.`
      ].join(" "),
      keywords: [
        profile.identity.name,
        profile.identity.role,
        ...profile.personality.traits,
        ...profile.favorites.tools
      ]
    },
    {
      id: "context-life-story",
      section: "about",
      title: "Life story",
      content: profile.bio.lifeStory,
      keywords: [...profile.personality.hobbies, ...profile.personality.traits]
    },
    {
      id: "context-privacy-boundaries",
      section: "privacy",
      title: "Privacy boundaries",
      content: [
        `Shareable topics: ${profile.privacyBoundaries.shareableTopics.join(", ")}.`,
        `Restricted topics: ${profile.privacyBoundaries.restrictedTopics.join(", ")}.`,
        `Answer rules: ${profile.privacyBoundaries.answerRules.join(" ")}`
      ].join(" "),
      keywords: ["privacy", "boundaries", "safe answers"]
    }
  ];

  const experienceChunks = profile.workExperience.map<AIContextChunk>((job) => ({
    id: `context-work-${job.id}`,
    section: "experience",
    title: `${job.title} at ${job.company}`,
    content: [job.summary, ...job.highlights].join(" "),
    keywords: [job.company, job.title, ...job.tools]
  }));

  const educationChunks = profile.education.map<AIContextChunk>((education) => ({
    id: `context-education-${education.id}`,
    section: "education",
    title: `${education.degree} at ${education.institution}`,
    content: [education.fieldOfStudy, ...education.highlights].filter(Boolean).join(" "),
    keywords: [education.institution, education.degree, education.fieldOfStudy ?? "education"]
  }));

  const projectChunks = raw.projects.projects.map<AIContextChunk>((project) => ({
    id: `context-project-${project.id}`,
    section: "projects",
    title: project.name,
    content: [project.summary, project.description, ...project.highlights].join(" "),
    keywords: [...project.tags, ...project.tools, ...project.roles]
  }));

  const faqChunks = raw.faq.items.map<AIContextChunk>((item) => ({
    id: `context-faq-${item.id}`,
    section: "faq",
    title: item.question,
    content: item.answer,
    keywords: item.tags
  }));

  const preferenceChunk: AIContextChunk = {
    id: "context-preferences",
    section: "preferences",
    title: "Collaboration and assistant preferences",
    content: [
      `Preferred problem types: ${raw.preferences.preferences.projectPreferences.favoriteProblemTypes.join(", ")}.`,
      `Preferred team traits: ${raw.preferences.preferences.projectPreferences.preferredTeamTraits.join(", ")}.`,
      `Non-preferred work: ${raw.preferences.preferences.projectPreferences.nonPreferredWork.join(", ")}.`,
      `Assistant style: ${raw.preferences.preferences.assistantBehavior.defaultAnswerStyle}`,
      `Fallback rule: ${raw.preferences.preferences.assistantBehavior.fallbackRule}`,
      `Writing tone: ${raw.writingStyle.voice.tone.join(", ")}.`
    ].join(" "),
    keywords: ["preferences", "collaboration", "tone", ...raw.writingStyle.voice.tone]
  };

  return [
    ...baseChunks,
    ...experienceChunks,
    ...educationChunks,
    ...projectChunks,
    ...faqChunks,
    preferenceChunk
  ];
}
