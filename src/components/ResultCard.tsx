'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext'; // <-- Импорт

type Props = {
  downloadLink: string;
  videoUrl: string;
  loading: boolean;
};

export function ResultCard({ downloadLink, videoUrl, loading }: Props) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const { t } = useLanguage(); // <-- Получаем переводы

  useEffect(() => {
    if (!videoUrl) return;
    let id = null;
    if (videoUrl.includes('youtu.be/')) {
      id = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    } else if (videoUrl.includes('v=')) {
      id = videoUrl.split('v=')[1]?.split('&')[0];
    }
    setVideoId(id);
  }, [videoUrl]);

  if (loading) {
    return (
      <div className="mt-10 w-full max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/40 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 rounded-2xl border border-white/50 dark:border-gray-700 text-center shadow-sm transition-colors">
          <p className="text-autumn-coffee dark:text-white font-semibold mb-3">{t.converting}</p>
          <div className="h-2.5 w-full bg-amber-200/50 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-autumn-amber animate-pulse w-3/4 rounded-full"></div>
          </div>
          <p className="text-xs text-autumn-coffee/60 dark:text-gray-400 mt-2">{t.waitTime}</p>
        </div>
      </div>
    );
  }

  if (!downloadLink) return null;

  return (
    <div className="mt-10 w-full max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/50 dark:bg-[#1a1512]/80 backdrop-blur-lg p-6 rounded-2xl border border-white/60 dark:border-gray-700 text-center shadow-lg transition-colors">
        
        {videoId ? (
          <img 
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
            alt="Обложка видео" 
            className="w-full h-auto aspect-video object-cover rounded-xl shadow-md mb-5 border border-white/20 dark:border-gray-600"
          />
        ) : (
          <div className="w-full aspect-video bg-amber-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-5">
            <span className="text-autumn-coffee/50 dark:text-gray-400 text-sm">{t.noCover}</span>
          </div>
        )}

        <a
          href={downloadLink}
          download
          className="block w-full bg-autumn-amber hover:bg-autumn-amberHover text-white px-8 py-3.5 rounded-xl font-bold transition-all text-lg shadow-md shadow-autumn-amber/20 hover:scale-[1.02]"
        >
          {t.btnDownload}
        </a>
      </div>
    </div>
  );
}