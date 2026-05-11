'use client';

import { useEffect } from 'react';

/**
 * shadcn's `dark:` utilities resolve via the `.dark` class (see
 * `@custom-variant dark (&:is(.dark *))` in admin.css). We mirror the OS
 * color-scheme preference onto <html> so that both the @media-driven CSS
 * variables and shadcn's class-based dark utilities stay in sync.
 */
export function ThemeSync() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.classList.toggle('dark', mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return null;
}
