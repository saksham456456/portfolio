# Portfolio project setup guide

This repository includes baseline project-level setup for environment variables, content management, deployment, and AI assistant documentation. The content files in `src/content/` are intended to be the single source of truth for personal information, projects, and timeline entries so the site remains easy to maintain.

## What is included

- `.env.example` with required and optional environment variables.
- `vercel.json` for a Vercel deployment baseline.
- `src/content/` files for profile data, project data, timeline data, and AI assistant context.
- `docs/content-editing.md` with quick editing instructions for non-code updates.

## Local setup

1. Install your package manager dependencies for the framework you are using.
2. Copy the example environment file.
   ```bash
   cp .env.example .env.local
   ```
3. Fill in the required variables for your AI provider before starting local development.
4. Start the development server for your app framework, for example:
   ```bash
   npm install
   npm run dev
   ```
5. Open the local site URL configured in your app, usually `http://localhost:3000`.

## Environment variables

### Required for AI/chat

| Variable | Required | Purpose |
| --- | --- | --- |
| `AI_PROVIDER` | Yes | The model provider identifier, such as `openai` or another vendor supported by your app. |
| `AI_MODEL` | Yes | The default model name used by the assistant route. |
| `AI_PROVIDER_API_KEY` | Yes | Secret API key for the selected model provider. Keep server-side only. |

### Optional site configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Public site origin used for metadata, links, and callback URLs. |
| `NEXT_PUBLIC_ANALYTICS_KEY` | No | Browser-safe analytics key for page tracking. |

### Optional email/contact integration

| Variable | Required | Purpose |
| --- | --- | --- |
| `CONTACT_PROVIDER` | No | Provider name for your contact or email workflow. |
| `CONTACT_API_KEY` | No | Secret API key for the email/contact service. |
| `CONTACT_TO_EMAIL` | No | Inbox address that receives contact messages. |
| `CONTACT_FROM_EMAIL` | No | Verified sender address used by the provider. |

### Optional abuse prevention and rate limiting

| Variable | Required | Purpose |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` | No | Backing store for request throttling or chat quotas. |
| `UPSTASH_REDIS_REST_TOKEN` | No | Secret token for the Upstash Redis REST API. |
| `TURNSTILE_SECRET_KEY` | No | Server-side CAPTCHA validation secret for forms or chat. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Public CAPTCHA site key rendered in the browser. |

## Where to edit personal information

Use the files in `src/content/` as the canonical editing surface:

- `src/content/profile.ts`: name, role, location, bio, skills, contact links, and assistant configuration.
- `src/content/projects.ts`: featured and archived projects displayed on the site.
- `src/content/timeline.ts`: career, education, awards, and milestone entries.
- `src/content/assistant-context.md`: long-form notes that the AI assistant can reference when answering questions.

Keeping content in dedicated files makes redesigns safer because presentation components can change without rewriting the underlying personal data.

## How to add new timeline entries or projects

### Add a project

1. Open `src/content/projects.ts`.
2. Add a new object to the exported `projects` array.
3. Keep the `slug` unique so routes, anchors, or analytics remain stable.
4. Prefer concise `summary` text and 3-6 technology tags.
5. If the project should not appear publicly yet, use a draft workflow in your app before rendering it.

### Add a timeline entry

1. Open `src/content/timeline.ts`.
2. Add a new object to the exported `timeline` array.
3. Use ISO-like date strings where possible so sorting stays predictable.
4. Put the newest items first unless your rendering layer sorts automatically.
5. Keep bullet highlights short so cards stay readable on mobile layouts.

More editing guidance is available in `docs/content-editing.md`.

## How the AI assistant reads personal data

A recommended pattern is:

1. The server-side chat route imports structured content from `src/content/profile.ts`, `src/content/projects.ts`, and `src/content/timeline.ts`.
2. The route optionally appends curated long-form context from `src/content/assistant-context.md`.
3. The route serializes only the fields needed for the prompt, then sends that compact context to the model provider.
4. The browser should call your server route rather than the model provider directly so API keys remain secret.

This design keeps personal data centralized, reviewable in Git, and easy to redact.

## Expected AI request/response flow for server-side routes

If you implement a server-side endpoint such as `POST /api/chat`, the expected flow is:

1. The browser sends the user message history to your app server.
2. The server validates request shape, origin, and optional anti-abuse checks.
3. The server loads allowed portfolio context from `src/content/`.
4. The server builds a constrained prompt with personal data and instructions.
5. The server forwards the request to the configured model provider using `AI_PROVIDER_API_KEY`.
6. The provider returns a completion or stream.
7. The server strips unsafe metadata, logs minimal telemetry, and returns the assistant response to the browser.

A minimal JSON contract is:

### Request

```json
{
  "messages": [
    { "role": "user", "content": "Tell me about your recent projects." }
  ]
}
```

### Response

```json
{
  "message": {
    "role": "assistant",
    "content": "Here are a few recent projects from the portfolio..."
  }
}
```

### Rate-limit considerations

- Apply per-IP, per-session, or per-user limits on the server, not only in the client.
- Store rate-limit counters in Redis or your deployment platform's managed KV store.
- Cap message length and conversation depth to control token cost.
- Consider a lower-cost fallback model for anonymous traffic.
- Log only high-level metrics; avoid storing full prompts if they contain sensitive details.

## Privacy guidance for sensitive information

- Do not store secrets, private addresses, personal phone numbers, or non-public client names in `src/content/` unless you are comfortable exposing them.
- Treat `assistant-context.md` as published content if the AI assistant can access it.
- Prefer generalized descriptions for confidential work, such as “enterprise internal tooling” instead of naming restricted customers.
- Keep API keys only in local or hosted environment variables.
- Review every field added to structured content as if it may be surfaced by the AI assistant.

## Deployment

This repository includes a baseline `vercel.json` configuration for Vercel.

### Deploy on Vercel

1. Import the repository into Vercel.
2. Add the environment variables from `.env.example` in the Vercel project settings.
3. Confirm your framework preset in Vercel matches the app you build in this repository.
4. If you add `api/` routes, Vercel will deploy them as serverless functions under the limits defined in `vercel.json`.
5. Redeploy after changing environment variables.

If you use another platform later, keep `.env.example` and `src/content/` unchanged so migration stays low risk.

## Maintainability notes

- Keep content edits separate from component refactors when possible.
- Add new structured fields to `src/types/content.ts` before using them in rendering code.
- Prefer one canonical source for personal data to avoid inconsistencies between the UI and AI assistant.
- Document every new integration in this README and `.env.example`.
