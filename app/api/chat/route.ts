import { buildFallbackAnswer, buildPromptBundle } from '@/lib/ai/system-prompt';
import { formatSources, retrieveRelevantContext, type AssistantMode } from '@/lib/ai/retrieval';

export const runtime = 'nodejs';

type ChatRequest = {
  messages?: Array<{ role?: 'user' | 'assistant'; content?: string }>;
  mode?: AssistantMode;
};

function encoderStream(lines: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(`${line}\n`));
      }
      controller.close();
    },
  });
}

function emitEvent(type: string, payload: Record<string, unknown>): string {
  return `data: ${JSON.stringify({ type, ...payload })}\n`;
}

async function streamOpenAIResponse(systemPrompt: string, userPrompt: string): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      stream: true,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${detail}`);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      let buffer = '';

      const push = (line: string) => controller.enqueue(encoder.encode(`${line}\n`));

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';

          for (const part of parts) {
            const dataLine = part
              .split('\n')
              .find((line) => line.startsWith('data: '));

            if (!dataLine) {
              continue;
            }

            const payload = dataLine.slice(6);
            if (payload === '[DONE]') {
              push(emitEvent('done', {}));
              controller.close();
              return;
            }

            const json = JSON.parse(payload) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              push(emitEvent('token', { delta }));
            }
          }
        }

        push(emitEvent('done', {}));
        controller.close();
      } catch (error) {
        push(
          emitEvent('error', {
            message: error instanceof Error ? error.message : 'Unknown streaming error.',
          }),
        );
        controller.close();
      }
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const mode: AssistantMode = body.mode === 'voice' ? 'voice' : 'about';
  const latestUserMessage = [...(body.messages ?? [])].reverse().find((message) => message.role === 'user');
  const question = latestUserMessage?.content?.trim();

  if (!question) {
    return new Response(JSON.stringify({ error: 'A user question is required.' }), { status: 400 });
  }

  const retrieval = await retrieveRelevantContext(question, mode);
  const sources = formatSources([...retrieval.factualChunks, ...retrieval.styleChunks]);

  if (retrieval.refused || retrieval.confidence === 'low') {
    const fallback = buildFallbackAnswer(mode, retrieval);
    return new Response(
      encoderStream([
        emitEvent('meta', { mode, confidence: retrieval.confidence, sources }),
        emitEvent('token', { delta: fallback }),
        emitEvent('done', {}),
      ]),
      {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      },
    );
  }

  const { systemPrompt, userPrompt } = buildPromptBundle(mode, retrieval);

  try {
    const stream = process.env.OPENAI_API_KEY
      ? await streamOpenAIResponse(systemPrompt, userPrompt)
      : encoderStream([
          emitEvent('meta', { mode, confidence: retrieval.confidence, sources }),
          emitEvent(
            'token',
            {
              delta: [
                'OPENAI_API_KEY is not configured, so this response is generated from the retrieval fallback path.',
                '',
                'Facts:',
                ...retrieval.factualChunks.map(
                  (chunk) => `- ${chunk.sectionLabel}: ${chunk.content}`,
                ),
                mode === 'voice' && retrieval.styleChunks.length > 0
                  ? `\nVoice inference: ${retrieval.styleChunks[0]?.content}`
                  : '',
              ]
                .filter(Boolean)
                .join('\n'),
            },
          ),
          emitEvent('done', {}),
        ]);

    if (!process.env.OPENAI_API_KEY) {
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    const prefix = encoderStream([emitEvent('meta', { mode, confidence: retrieval.confidence, sources })]);
    const prefixed = new ReadableStream<Uint8Array>({
      async start(controller) {
        const prefixReader = prefix.getReader();
        const mainReader = stream.getReader();

        for (const reader of [prefixReader, mainReader]) {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        }

        controller.close();
      },
    });

    return new Response(prefixed, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      encoderStream([
        emitEvent('meta', { mode, confidence: retrieval.confidence, sources }),
        emitEvent('token', {
          delta: `${buildFallbackAnswer(mode, retrieval)} Error: ${error instanceof Error ? error.message : 'Unknown error.'}`,
        }),
        emitEvent('done', {}),
      ]),
      {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      },
    );
  }
}
