'use client';

import type { CSSProperties } from 'react';

export type ChatMode = 'about' | 'voice';

export function ChatModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
  disabled?: boolean;
}) {
  return (
    <div style={wrapperStyle}>
      <button
        type="button"
        onClick={() => onChange('about')}
        disabled={disabled}
        style={{ ...buttonStyle, ...(mode === 'about' ? activeStyle : inactiveStyle) }}
      >
        About me
      </button>
      <button
        type="button"
        onClick={() => onChange('voice')}
        disabled={disabled}
        style={{ ...buttonStyle, ...(mode === 'voice' ? activeStyle : inactiveStyle) }}
      >
        Answer like me
      </button>
    </div>
  );
}

const wrapperStyle: CSSProperties = {
  display: 'inline-flex',
  gap: '0.5rem',
  padding: '0.4rem',
  borderRadius: '999px',
  background: 'rgba(15, 23, 42, 0.9)',
  border: '1px solid rgba(148, 163, 184, 0.16)',
};

const buttonStyle: CSSProperties = {
  border: 'none',
  borderRadius: '999px',
  padding: '0.7rem 1rem',
  cursor: 'pointer',
  transition: 'all 160ms ease',
};

const activeStyle: CSSProperties = {
  background: 'var(--accent)',
  color: '#082f49',
  fontWeight: 700,
};

const inactiveStyle: CSSProperties = {
  background: 'transparent',
  color: 'var(--text)',
};
