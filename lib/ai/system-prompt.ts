import type { AssistantMode, RetrievalResult } from './retrieval.ts';

type PromptBundle = {
  systemPrompt: string;
  userPrompt: string;
};

function renderFactsSection(retrieval: RetrievalResult): string {
  return retrieval.factualChunks
    .map(
      (chunk, index) =>
        `[Fact ${index + 1}] ${chunk.sectionLabel} | ${chunk.heading}\n${chunk.content}`,
    )
    .join('\n\n');
}

function renderStyleSection(retrieval: RetrievalResult): string {
  if (retrieval.styleChunks.length === 0) {
    return 'No style guidance retrieved.';
  }

  return retrieval.styleChunks
    .map(
      (chunk, index) =>
        `[Style ${index + 1}] ${chunk.sectionLabel} | ${chunk.heading}\n${chunk.content}`,
    )
    .join('\n\n');
}

export function buildPromptBundle(mode: AssistantMode, retrieval: RetrievalResult): PromptBundle {
  const modeInstruction =
    mode === 'voice'
      ? 'Answer in two clearly labeled parts: Facts and Voice inference. Facts must only restate retrieved evidence. Voice inference may mirror tone and preference cues, but it must never introduce new biographical facts.'
      : 'Answer in a factual voice. Use only the retrieved evidence and avoid stylistic roleplay.';

  const systemPrompt = [
    'You are a retrieval-grounded portfolio assistant.',
    'Use only the retrieved context provided by the application.',
    'If the answer is missing or incomplete, say so plainly instead of guessing.',
    'Never reveal blocked, private, or speculative personal details.',
    'Cite source labels inline using the provided section labels when relevant.',
    modeInstruction,
  ].join(' ');

  const userPrompt = [
    `Mode: ${mode}`,
    `Confidence: ${retrieval.confidence}`,
    `Question: ${retrieval.question}`,
    'Retrieved factual context:',
    renderFactsSection(retrieval),
    'Retrieved style context:',
    renderStyleSection(retrieval),
    'Response requirements:',
    '- Keep the answer grounded in the factual context.',
    '- Make uncertainty explicit.',
    '- Mention source labels such as From timeline / From projects / From profile where helpful.',
    mode === 'voice'
      ? '- In the Voice inference section, present tone/style inference separately from facts.'
      : '- Do not imitate the subject unless the mode explicitly requests it.',
  ].join('\n\n');

  return { systemPrompt, userPrompt };
}

export function buildFallbackAnswer(mode: AssistantMode, retrieval: RetrievalResult): string {
  const intro =
    mode === 'voice'
      ? 'I can answer in a similar tone when there is source material, but I do not have enough retrieved evidence to do that responsibly.'
      : 'I do not have enough retrieved source material to answer that confidently.';

  return [
    intro,
    retrieval.refusalReason ?? 'No relevant public source sections were found.',
    'If you add the missing detail to content/profile.md, content/timeline.md, or content/projects.md, I can pick it up on the next request.',
  ].join(' ');
}
