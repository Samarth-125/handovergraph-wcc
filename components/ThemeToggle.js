'use client';
import { useEffect, useState } from 'react';

// The page already has the right class before it paints (see the script in layout.js); this just flips it.
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);

  function flip() {
    document.documentElement.classList.toggle('dark', !dark);
    try { localStorage.theme = dark ? 'light' : 'dark'; } catch {}
    setDark(!dark);
  }
  return (
    <button onClick={flip} aria-label="Switch between light and dark" className="no-print rounded-lg border px-3 py-1 text-sm hover:bg-soft">
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
