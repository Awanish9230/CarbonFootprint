import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('cft_theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('cft_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cft_theme', 'light');
    }
  }, [dark]);

  return (
    <button
      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
      title="Toggle theme"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
