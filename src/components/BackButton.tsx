'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      // fixed left-4 md:left-10: жестко привязываем к левому краю окна (16px на мобильных, 40px на десктопе)
      // top-24: отступ сверху, чтобы не наезжать на шапку
      // z-40: поверх контента
      className="fixed left-4 md:left-10 top-24 z-40 inline-flex items-center justify-center w-12 h-12 rounded-full bg-autumn-amber hover:bg-autumn-amberHover text-white shadow-lg transition-all hover:scale-110"
      title="Назад"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
    </button>
  );
}