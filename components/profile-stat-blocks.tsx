'use client';

import { motion } from 'framer-motion';

export function ProfileStatBlocks({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          whileHover={{ y: -6 }}
          className="glass-panel rounded-[24px] p-5"
        >
          <p className="text-sm text-slate-400">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
