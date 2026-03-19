'use client';

import { motion } from 'framer-motion';

export type CardItem = {
  title: string;
  subtitle: string;
  summary: string;
  stack: string[];
};

export function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item, index) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
          whileHover={{ y: -10, scale: 1.01 }}
          className="glass-panel group rounded-[28px] p-6"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/75">{item.subtitle}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">{item.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {item.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
