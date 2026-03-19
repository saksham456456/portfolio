import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type {
  FAQ,
  Preferences,
  Profile,
  Projects,
  RawPersonalContent,
  Skills,
  Timeline,
  WritingStyle
} from "./personal-content";
import { normalizePersonalContent } from "./personal-content";

async function readJsonFile<T>(filePath: string): Promise<T> {
  const file = await readFile(filePath, "utf8");
  return JSON.parse(file) as T;
}

export async function loadRawPersonalContent(contentDir = join(process.cwd(), "content")): Promise<RawPersonalContent> {
  const [profile, timeline, projects, skills, faq, preferences, writingStyle] = await Promise.all([
    readJsonFile<Profile>(join(contentDir, "profile.json")),
    readJsonFile<Timeline>(join(contentDir, "timeline.json")),
    readJsonFile<Projects>(join(contentDir, "projects.json")),
    readJsonFile<Skills>(join(contentDir, "skills.json")),
    readJsonFile<FAQ>(join(contentDir, "faq.json")),
    readJsonFile<Preferences>(join(contentDir, "preferences.json")),
    readJsonFile<WritingStyle>(join(contentDir, "writing-style.json"))
  ]);

  return {
    profile,
    timeline,
    projects,
    skills,
    faq,
    preferences,
    writingStyle
  };
}

export async function loadNormalizedPersonalContent(contentDir?: string) {
  const raw = await loadRawPersonalContent(contentDir);
  return normalizePersonalContent(raw);
}
