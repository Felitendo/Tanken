'use client';

import { useEffect } from 'react';

/**
 * shadcn's `dark:` utilities resolve via the `.dark` class (see
 * `@custom-variant dark (&:is(.dark *))` in admin.css).
 *
 * The main app persists an explicit theme choice (auto|light|dark) in
 * localStorage `tank_settings`; honour it here so /admin doesn't flip to
 * the opposite theme of the app the user just came from. Only in `auto`
 * (or with no stored choice) do we follow the OS preference.
 */
function storedTheme(): 'light' | 'dark' | null {
  try {
    const t = JSON.parse(localStorage.getItem('tank_settings') || '{}').theme;
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

export function ThemeSync() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const chosen = storedTheme();
      document.documentElement.classList.toggle('dark', chosen ? chosen === 'dark' : mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    // Theme changed in the app in another tab → storage event keeps us in sync.
    window.addEventListener('storage', apply);
    return () => {
      mq.removeEventListener('change', apply);
      window.removeEventListener('storage', apply);
    };
  }, []);
  return null;
}
