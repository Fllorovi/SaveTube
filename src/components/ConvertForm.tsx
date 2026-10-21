'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

type Props = {
  onConvert: (url: string, quality: string) => void;
  loading: boolean;
};

export function ConvertForm({ onConvert, loading }: Props) {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('320');
  const { t } = useLanguage(); // <-- Получаем переводы

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onConvert(url, quality);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-center bg-white/40 dark:bg-black/40 backdrop-blur-lg border border-white/60 dark:border-gray-700 rounded-2xl p-2 shadow-lg shadow-autumn-coffee/5 transition-colors">
        
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t.placeholder} // <-- Используем перевод
          className="flex-1 w-full bg-transparent border-none px-4 py-3 text-autumn-coffee dark:text-white placeholder-autumn-coffee/50 dark:placeholder-gray-400 focus:outline-none text-base"
          disabled={loading}
        />
        
        <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto px-2 md:px-0">
          <select 
            value={quality} 
            onChange={(e) => setQuality(e.target.value)}
            className="bg-white/50 dark:bg-gray-800 border border-amber-200/50 dark:border-gray-600 rounded-xl px-3 py-2.5 text-autumn-coffee dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-autumn-amber/50 cursor-pointer transition-colors"
            disabled={loading}
          >
            <option value="128">128 kbps</option>
            <option value="320">320 kbps</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-autumn-amber hover:bg-autumn-amberHover text-white px-6 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 whitespace-nowrap shadow-md shadow-autumn-amber/20"
          >
            {loading ? t.btnLoading : t.btnOk} {/* <-- Используем перевод */}
          </button>
        </div>
      </div>
    </form>
  );
}