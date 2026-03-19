'use client';

import { motion } from 'framer-motion';
import { navItems } from '@/content/site';

export function StickyNav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-3 z-50 pt-3"
    >
      <div className="container-frame">
        <nav className="glass-panel flex items-center justify-between rounded-full px-4 py-3 sm:px-6">
          <a href="#hero" className="text-sm font-semibold tracking-[0.24em] text-white/90 uppercase">
            Your Name
          </a>
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5"
          >
            Let&apos;s talk
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
