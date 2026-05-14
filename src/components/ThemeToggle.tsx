'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <div className="w-4 h-4 bg-slate-500/50 rounded-full animate-pulse" />
      </div>
    );
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className={`absolute transition-transform duration-500 ease-in-out ${isDark ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 rotate-90'}`}>
        <Moon size={18} className="text-brand-blue group-hover:text-brand-orange transition-colors" />
      </div>
      <div className={`absolute transition-transform duration-500 ease-in-out ${!isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-10 opacity-0 -rotate-90'}`}>
        <Sun size={18} className="text-brand-orange" />
      </div>
    </button>
  );
}
