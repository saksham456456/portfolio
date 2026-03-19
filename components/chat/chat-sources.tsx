'use client';

import type { CSSProperties } from 'react';

export function ChatSources({
  sources,
  confidence,
}: {
  sources: string[];
  confidence: 'high' | 'medium' | 'low' | null;
}) {
  return (
    <section style={wrapperStyle}>
      <div style={badgeRowStyle}>
        <span style={badgeStyle}>Live content reload</span>
        <span style={badgeStyle}>Privacy allowlist + blocklist</span>
        <span style={badgeStyle}>Confidence: {confidence ?? 'pending'}</span>
      </div>
      <div>
        <p style={labelStyle}>Retrieved source sections</p>
        {sources.length > 0 ? (
          <ul style={listStyle}>
            {sources.map((source) => (
              <li key={source} style={sourceStyle}>
                {source}
              </li>
            ))}
          </ul>
        ) : (
          <p style={emptyStyle}>No sources retrieved yet. Ask a question to inspect the supporting context.</p>
        )}
      </div>
    </section>
  );
}

const wrapperStyle: CSSProperties = {
  padding: '1rem',
  borderRadius: '18px',
  background: 'rgba(15, 23, 42, 0.62)',
  border: '1px solid rgba(148, 163, 184, 0.12)',
};

const badgeRowStyle: CSSProperties = {
  display: 'flex',
  gap: '0.6rem',
  flexWrap: 'wrap',
  marginBottom: '0.9rem',
};

const badgeStyle: CSSProperties = {
  padding: '0.35rem 0.65rem',
  borderRadius: '999px',
  background: 'var(--accent-soft)',
  color: '#7dd3fc',
  fontSize: '0.85rem',
};

const labelStyle: CSSProperties = {
  margin: '0 0 0.75rem',
  color: 'var(--muted)',
  fontSize: '0.9rem',
};

const listStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.65rem',
};

const sourceStyle: CSSProperties = {
  padding: '0.45rem 0.7rem',
  borderRadius: '999px',
  border: '1px solid rgba(148, 163, 184, 0.14)',
  background: 'rgba(8, 15, 27, 0.68)',
};

const emptyStyle: CSSProperties = {
  margin: 0,
  color: 'var(--muted)',
};
