import type { CSSProperties } from 'react';
import { ChatPanel } from '@/components/chat/chat-panel';

export default function HomePage() {
  return (
    <main style={pageStyle}>
      <ChatPanel />
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '4rem 1.25rem',
};
