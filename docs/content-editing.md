# Content editing guide

## Primary editing files

- `src/content/profile.ts` for biography, links, skills, and assistant settings.
- `src/content/projects.ts` for portfolio projects.
- `src/content/timeline.ts` for experience and milestones.
- `src/content/assistant-context.md` for extra context the AI assistant may use.

## Editing workflow

1. Update only the content file that matches the change.
2. Keep text concise and presentation-agnostic.
3. Avoid embedding secrets or private notes.
4. Preview locally before deploying.
5. Commit content updates separately from layout or component changes when possible.

## Project entry checklist

- Unique slug.
- Clear project name.
- One-sentence summary.
- Accurate status.
- Demo and repository links, if public.
- Short list of technologies.

## Timeline entry checklist

- Clear title and organization.
- Start and end dates.
- Short location string.
- Two to four highlights.
- Public-safe wording for confidential work.
