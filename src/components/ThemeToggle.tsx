'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!mounted) return <div className="w-14 h-7 rounded-full bg-gray-300 opacity-50"></div>;

  return (
    <button 
      onClick={toggleTheme}
      // Увеличили размер: w-14 (56px) и h-7 (28px)
      className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none bg-gray-300 dark:bg-autumn-amber"
      title="Сменить тему"
    >
      <span className="sr-only">Переключить тему</span>
      
      {/* Иконка Солнца (справа на дорожке, видна в светлой теме) */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`absolute right-2 w-4 h-4 text-white transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`}
      >
        <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M6.34 17.66l-1.41 1.41" />
        <path d="M19.07 4.93l-1.41 1.41" />
      </svg>

      {/* Иконка Луны (слева на дорожке, видна в темной теме) */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`absolute left-2 w-4 h-4 text-autumn-coffee transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      {/* Белый кружок (ездит поверх иконок) */}
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          isDark ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  );
}