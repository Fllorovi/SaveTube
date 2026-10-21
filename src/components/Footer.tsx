'use client';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-6 text-center bg-white/50 dark:bg-black/60 backdrop-blur-sm border-t border-amber-100 dark:border-gray-800 mt-auto transition-colors duration-300">
      <p className="text-sm text-autumn-coffee/70 dark:text-gray-300">{t.footerText}</p>
      <p className="mt-2 text-xs text-autumn-coffee/50 dark:text-gray-500">{t.footerLegal}</p>
    </footer>
  );
}