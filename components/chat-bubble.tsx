import { cn } from '@/lib/utils';

export function ChatBubble({ role, message }: { role: 'assistant' | 'user'; message: string }) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[88%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-[0_12px_30px_rgba(0,0,0,0.18)]',
          isUser
            ? 'bg-white text-slate-950'
            : 'border border-white/10 bg-white/6 text-slate-100 backdrop-blur-xl',
        )}
      >
        {message}
      </div>
    </div>
  );
}
