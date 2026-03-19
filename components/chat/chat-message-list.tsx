'use client';

import type { CSSProperties } from 'react';

import type { ChatMode } from '@/components/chat/chat-mode-toggle';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function ChatMessageList({
  messages,
  isLoading,
  mode,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
  mode: ChatMode;
}) {
  return (
    <div style={listStyle}>
      {messages.map((message) => (
        <article
          key={message.id}
          style={{
            ...bubbleStyle,
            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            background:
              message.role === 'user' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.92)',
          }}
        >
          <p style={labelStyle}>{message.role === 'user' ? 'You' : mode === 'voice' ? 'Assistant · facts + voice' : 'Assistant · factual'}</p>
          <div style={contentStyle}>
            {message.content.split('\n').map((line, index) => (
              <p key={`${message.id}-${index}`} style={paragraphStyle}>
                {line || '\u00a0'}
              </p>
            ))}
          </div>
        </article>
      ))}
      {isLoading ? <p style={loadingStyle}>Streaming response…</p> : null}
    </div>
  );
}

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  minHeight: '420px',
  maxHeight: '60vh',
  overflowY: 'auto',
  padding: '1rem 0',
};

const bubbleStyle: CSSProperties = {
  width: 'min(100%, 720px)',
  borderRadius: '20px',
  padding: '1rem 1.1rem',
  border: '1px solid rgba(148, 163, 184, 0.14)',
};

const labelStyle: CSSProperties = {
  margin: '0 0 0.75rem',
  color: 'var(--muted)',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const contentStyle: CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
};

const paragraphStyle: CSSProperties = {
  margin: 0,
  lineHeight: 1.65,
};

const loadingStyle: CSSProperties = {
  margin: 0,
  color: 'var(--muted)',
};
