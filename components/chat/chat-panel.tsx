'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { ChatComposer } from '@/components/chat/chat-composer';
import { ChatMessageList, type ChatMessage } from '@/components/chat/chat-message-list';
import { ChatModeToggle, type ChatMode } from '@/components/chat/chat-mode-toggle';
import { ChatSources } from '@/components/chat/chat-sources';

const STARTER_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Ask about background, projects, working style, or switch to “Answer like me” mode for a tone-matched response grounded in retrieved source material.',
  },
];

export function ChatPanel() {
  const [mode, setMode] = useState<ChatMode>('about');
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low' | null>(null);

  const placeholder = useMemo(
    () =>
      mode === 'about'
        ? 'Ask a factual question about experience, projects, or working style…'
        : 'Ask for an answer in a similar voice, grounded in the profile content…',
    [mode],
  );

  async function handleSubmit(input: string) {
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: input };
    const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '' };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsLoading(true);
    setSources([]);
    setConfidence(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('The chat request failed.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const line = event.split('\n').find((item) => item.startsWith('data: '));
          if (!line) continue;

          const payload = JSON.parse(line.slice(6)) as {
            type: 'meta' | 'token' | 'done' | 'error';
            delta?: string;
            sources?: string[];
            confidence?: 'high' | 'medium' | 'low';
            message?: string;
          };

          if (payload.type === 'meta') {
            setSources(payload.sources ?? []);
            setConfidence(payload.confidence ?? null);
          }

          if (payload.type === 'token' && payload.delta) {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessage.id
                  ? { ...message, content: `${message.content}${payload.delta}` }
                  : message,
              ),
            );
          }

          if (payload.type === 'error') {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessage.id
                  ? {
                      ...message,
                      content: payload.message ?? 'The response stream ended unexpectedly.',
                    }
                  : message,
              ),
            );
          }
        }
      }
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content:
                  error instanceof Error ? error.message : 'An unknown error prevented the response.',
              }
            : message,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section style={panelStyle}>
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Portfolio assistant</p>
          <h1 style={titleStyle}>Chat with a retrieval-backed profile</h1>
          <p style={subtitleStyle}>
            The assistant reloads content on each request, answers from public source sections, and separates facts from stylistic inference.
          </p>
        </div>
        <ChatModeToggle mode={mode} onChange={setMode} disabled={isLoading} />
      </div>

      <ChatSources sources={sources} confidence={confidence} />
      <ChatMessageList messages={messages} isLoading={isLoading} mode={mode} />
      <ChatComposer onSubmit={handleSubmit} disabled={isLoading} placeholder={placeholder} />
    </section>
  );
}

const panelStyle: CSSProperties = {
  width: 'min(920px, 100%)',
  margin: '0 auto',
  padding: '2rem',
  borderRadius: '24px',
  background: 'rgba(8, 15, 27, 0.8)',
  border: '1px solid rgba(148, 163, 184, 0.15)',
  boxShadow: '0 24px 80px rgba(2, 8, 23, 0.45)',
  backdropFilter: 'blur(18px)',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1.5rem',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  marginBottom: '1.5rem',
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontSize: '0.75rem',
  color: 'var(--accent)',
};

const titleStyle: CSSProperties = {
  margin: '0.5rem 0 0.75rem',
  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: '60ch',
  color: 'var(--muted)',
  lineHeight: 1.6,
};
