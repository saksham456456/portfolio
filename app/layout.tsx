import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio AI Chat',
  description: 'Retrieval-backed assistant for a personal portfolio.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
