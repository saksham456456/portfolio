'use client';

import { motion } from 'framer-motion';

export type TimelineEntry = {
  year: string;
  title: string;
  body: string;
  tag: string;
};

export function TimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="relative pl-10"
    >
      <span className="absolute left-[7px] top-2 h-3 w-3 rounded-full border border-cyan-300/60 bg-slate-950 shadow-[0_0_18px_rgba(66,217,200,0.65)]" />
      <div className="glass-panel rounded-[26px] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{entry.year}</p>
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
            {entry.tag}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">{entry.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{entry.body}</p>
      </div>
    </motion.article>
  );
}
