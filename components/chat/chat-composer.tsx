'use client';

import { useState, type CSSProperties, type FormEvent } from 'react';

export function ChatComposer({
  onSubmit,
  disabled,
  placeholder,
}: {
  onSubmit: (value: string) => Promise<void>;
  disabled?: boolean;
  placeholder: string;
}) {
  const [value, setValue] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    setValue('');
    await onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        rows={4}
        disabled={disabled}
        style={textareaStyle}
      />
      <div style={footerStyle}>
        <p style={hintStyle}>Responses are grounded in retrieved source sections and should hedge when information is missing.</p>
        <button type="submit" disabled={disabled || !value.trim()} style={buttonStyle}>
          Send
        </button>
      </div>
    </form>
  );
}

const formStyle: CSSProperties = {
  marginTop: '1rem',
  display: 'grid',
  gap: '0.85rem',
};

const textareaStyle: CSSProperties = {
  width: '100%',
  resize: 'vertical',
  minHeight: '120px',
  borderRadius: '18px',
  padding: '1rem',
  background: 'rgba(15, 23, 42, 0.88)',
  color: 'var(--text)',
  border: '1px solid rgba(148, 163, 184, 0.14)',
};

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const hintStyle: CSSProperties = {
  margin: 0,
  color: 'var(--muted)',
  maxWidth: '56ch',
  lineHeight: 1.5,
};

const buttonStyle: CSSProperties = {
  border: 'none',
  borderRadius: '999px',
  padding: '0.8rem 1.3rem',
  background: 'var(--accent)',
  color: '#082f49',
  fontWeight: 700,
  cursor: 'pointer',
};
