import { promises as fs } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const WORD_MATCHER = /[a-z0-9][a-z0-9'-]*/gi;
const BLOCKED_PATTERN = /(password|secret|api[-_ ]?key|ssn|social security|bank account|routing number|private address|home address)/i;
const BLOCKED_SOURCE_NAMES = new Set(['private', 'drafts', 'secrets']);
const DEFAULT_ALLOWLIST = new Set(['profile', 'timeline', 'projects', 'voice', 'writing']);
const STOPWORDS = new Set(['a','an','and','are','as','at','be','by','for','from','how','i','in','is','it','like','me','my','of','on','or','that','the','to','what','when','where','who','why','with','you','your']);

export type AssistantMode = 'about' | 'voice';

export type RetrievedChunk = {
  id: string;
  title: string;
  sectionLabel: string;
  filePath: string;
  kind: 'facts' | 'style';
  visibility: string;
  heading: string;
  content: string;
  tokens: string[];
  score: number;
};

export type RetrievalResult = {
  question: string;
  factualChunks: RetrievedChunk[];
  styleChunks: RetrievedChunk[];
  confidence: 'high' | 'medium' | 'low';
  refused: boolean;
  refusalReason?: string;
};

type ContentDoc = {
  filePath: string;
  slug: string;
  title: string;
  sectionLabel: string;
  kind: 'facts' | 'style';
  visibility: string;
  body: string;
};

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith('---\n')) {
    return { meta: {}, body: raw };
  }

  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) {
    return { meta: {}, body: raw };
  }

  const frontmatter = raw.slice(4, end).split('\n');
  const meta = Object.fromEntries(
    frontmatter
      .map((line) => line.split(':'))
      .filter((parts) => parts.length >= 2)
      .map(([key, ...rest]) => [key.trim(), rest.join(':').trim()]),
  );

  return {
    meta,
    body: raw.slice(end + 5),
  };
}

function tokenize(value: string): string[] {
  return (value.toLowerCase().match(WORD_MATCHER) ?? []).filter((token) => Boolean(token) && !STOPWORDS.has(token));
}

function chunkDocument(doc: ContentDoc): RetrievedChunk[] {
  const lines = doc.body.split('\n');
  const chunks: RetrievedChunk[] = [];
  let heading = doc.title;
  let paragraphBuffer: string[] = [];
  let sectionIndex = 0;

  const flush = () => {
    const content = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
    paragraphBuffer = [];

    if (!content) {
      return;
    }

    chunks.push({
      id: `${doc.slug}-${sectionIndex += 1}`,
      title: doc.title,
      sectionLabel: doc.sectionLabel,
      filePath: doc.filePath,
      kind: doc.kind,
      visibility: doc.visibility,
      heading,
      content,
      tokens: tokenize(`${heading} ${content}`),
      score: 0,
    });
  };

  for (const line of lines) {
    if (/^#{1,3}\s+/.test(line)) {
      flush();
      heading = line.replace(/^#{1,3}\s+/, '').trim();
      continue;
    }

    if (!line.trim()) {
      flush();
      continue;
    }

    paragraphBuffer.push(line.trim());
  }

  flush();
  return chunks;
}

async function loadContentDocs(): Promise<ContentDoc[]> {
  const dirEntries = await fs.readdir(CONTENT_DIR, { withFileTypes: true }).catch(() => []);
  const docs: ContentDoc[] = [];

  for (const entry of dirEntries) {
    if (!entry.isFile()) {
      continue;
    }

    if (!/\.(md|mdx|txt)$/i.test(entry.name)) {
      continue;
    }

    const absolutePath = path.join(CONTENT_DIR, entry.name);
    const raw = await fs.readFile(absolutePath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const slug = entry.name.replace(/\.[^.]+$/, '');

    docs.push({
      filePath: `content/${entry.name}`,
      slug,
      title: meta.title ?? slug,
      sectionLabel: meta.sectionLabel ?? `From ${slug}`,
      kind: meta.kind === 'style' ? 'style' : 'facts',
      visibility: meta.visibility ?? 'public',
      body,
    });
  }

  return docs;
}

function isBlocked(doc: ContentDoc | RetrievedChunk): boolean {
  const slug = 'slug' in doc ? doc.slug : doc.filePath;

  if (BLOCKED_SOURCE_NAMES.has(slug.toLowerCase())) {
    return true;
  }

  const visibility = doc.visibility.toLowerCase();
  if (visibility === 'private' || visibility === 'blocked') {
    return true;
  }

  const content = 'body' in doc ? doc.body : doc.content;
  return BLOCKED_PATTERN.test(content);
}

function isAllowed(doc: ContentDoc): boolean {
  if (doc.visibility.toLowerCase() === 'public') {
    return true;
  }

  return DEFAULT_ALLOWLIST.has(doc.slug.toLowerCase());
}

function scoreChunk(questionTokens: string[], chunk: RetrievedChunk): number {
  const uniqueQuestion = new Set(questionTokens);
  const uniqueChunk = new Set(chunk.tokens);
  let overlap = 0;

  for (const token of uniqueQuestion) {
    if (uniqueChunk.has(token)) {
      overlap += token.length > 5 ? 2 : 1;
    }
  }

  const headingTokens = new Set(tokenize(chunk.heading));
  const phraseBoost = questionTokens.some((token) => headingTokens.has(token)) ? 2 : 0;
  return overlap + phraseBoost;
}

export async function retrieveRelevantContext(question: string, mode: AssistantMode): Promise<RetrievalResult> {
  const docs = (await loadContentDocs()).filter((doc) => isAllowed(doc) && !isBlocked(doc));
  const chunks = docs.flatMap(chunkDocument);
  const questionTokens = tokenize(question);

  const scored = chunks
    .map((chunk) => ({ ...chunk, score: scoreChunk(questionTokens, chunk) }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score);

  const factualChunks = scored.filter((chunk) => chunk.kind === 'facts').slice(0, 5);
  const styleFallback = chunks.filter((chunk) => chunk.kind === 'style').slice(0, 2);
  const styleChunks =
    mode === 'voice'
      ? (() => {
          const matched = scored.filter((chunk) => chunk.kind === 'style').slice(0, 3);
          return matched.length > 0 ? matched : styleFallback;
        })()
      : [];

  const totalScore = factualChunks.reduce((sum, chunk) => sum + chunk.score, 0);
  const confidence: RetrievalResult['confidence'] =
    factualChunks.length === 0 ? 'low' : totalScore >= 10 ? 'high' : totalScore >= 5 ? 'medium' : 'low';

  const insufficientEvidence = factualChunks.length === 0 || totalScore < 3;

  if (insufficientEvidence) {
    return {
      question,
      factualChunks,
      styleChunks,
      confidence,
      refused: true,
      refusalReason: 'No sufficiently relevant public source sections were found for this question.',
    };
  }

  return {
    question,
    factualChunks,
    styleChunks,
    confidence,
    refused: false,
  };
}

export function formatSources(chunks: RetrievedChunk[]): string[] {
  return chunks.map((chunk) => `${chunk.sectionLabel} — ${chunk.heading}`);
}
