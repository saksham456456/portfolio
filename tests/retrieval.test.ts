import test from 'node:test';
import assert from 'node:assert/strict';

import { retrieveRelevantContext } from '../lib/ai/retrieval.ts';
import { buildPromptBundle } from '../lib/ai/system-prompt.ts';

test('retrieval returns factual chunks for project-related questions', async () => {
  const result = await retrieveRelevantContext('What projects are most relevant to AI interfaces?', 'about');

  assert.equal(result.refused, false);
  assert.ok(result.factualChunks.length > 0);
  assert.equal(result.factualChunks[0]?.sectionLabel.startsWith('From'), true);
});

test('voice mode retrieves style guidance and builds a separated prompt', async () => {
  const result = await retrieveRelevantContext('Answer like you about your working style', 'voice');
  const prompt = buildPromptBundle('voice', result);

  assert.ok(result.styleChunks.length > 0);
  assert.match(prompt.userPrompt, /Voice inference section/i);
  assert.match(prompt.systemPrompt, /Facts and Voice inference/i);
});

test('retrieval refuses unrelated questions when no relevant content exists', async () => {
  const result = await retrieveRelevantContext('What is your favorite pizza topping?', 'about');

  assert.equal(result.refused, true);
  assert.equal(result.confidence, 'low');
});
