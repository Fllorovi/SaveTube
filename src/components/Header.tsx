'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

type Props = {
  onOpenHistory: () => void;
};

export function Header({ onOpenHistory }: Props) {
  const pathname = usePathname();
  return (
    // Добавили dark:bg-black/50 и dark:border-gray-700
    <header className="w-full h-20 px-6 flex items-center justify-between bg-white/70 dark:bg-black/60 backdrop-blur-md border-b border-amber-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-14 h-14 relative group-hover:scale-105 transition-transform">
            <Image 
              src="/images/logo.png" 
              alt="SaveTube Logo" 
              fill 
              sizes="64px" 
              className="object-contain" 
            />
          </div>
          <span className="text-2xl font-bold text-autumn-coffee dark:text-white group-hover:text-autumn-amber transition-colors hidden sm:block">
            SaveTube
          </span>
        </Link>

        <button 
          onClick={onOpenHistory}
          className="p-2 ml-2 rounded-full hover:bg-amber-100 dark:hover:bg-gray-800 text-autumn-coffee dark:text-gray-200 transition-colors"
          title="История скачиваний"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
      </div>

      <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-autumn-coffee dark:text-gray-200">
        <Link 
          href="/faq" 
          className={`transition hidden sm:block ${pathname === '/faq' ? 'text-autumn-amber font-bold' : 'hover:text-autumn-amber'}`}
        >
          FAQ
        </Link>
        
        <ThemeToggle />

        <select className="bg-transparent border-none outline-none cursor-pointer hover:text-autumn-amber transition font-medium dark:text-gray-200">
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
      </nav>
    </header>
  );
}