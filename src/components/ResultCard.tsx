'use client';

import { useEffect, useState } from 'react';

type Props = {
  downloadLink: string;
  videoUrl: string; // Нужен, чтобы вытащить ID для обложки
  loading: boolean;
};

export function ResultCard({ downloadLink, videoUrl, loading }: Props) {
  const [videoId, setVideoId] = useState<string | null>(null);

  // Вытаскиваем ID видео из ссылки при изменении URL
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

  // Состояние загрузки (прогресс-бар)
  if (loading) {
    return (
      <div className="mt-10 w-full max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/50 text-center shadow-sm">
          <p className="text-autumn-coffee font-semibold mb-3">Идет конвертация...</p>
          {/* Анимированный прогресс-бар */}
          <div className="h-2.5 w-full bg-amber-200/50 rounded-full overflow-hidden">
            <div className="h-full bg-autumn-amber animate-pulse w-3/4 rounded-full"></div>
          </div>
          <p className="text-xs text-autumn-coffee/60 mt-2">Это может занять до 30 секунд</p>
        </div>
      </div>
    );
  }

  // Если ссылки на скачивание нет, ничего не показываем
  if (!downloadLink) return null;

  // Состояние успеха (обложка + кнопка)
  return (
    <div className="mt-10 w-full max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-white/60 text-center shadow-lg shadow-autumn-coffee/5">
        
        {/* Обложка видео */}
        {videoId ? (
          <img 
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
            alt="Обложка видео" 
            className="w-full h-auto aspect-video object-cover rounded-xl shadow-md mb-5 border border-white/20"
          />
        ) : (
          <div className="w-full aspect-video bg-amber-100 rounded-xl flex items-center justify-center mb-5">
            <span className="text-autumn-coffee/50 text-sm">Обложка недоступна</span>
          </div>
        )}

        <a
          href={downloadLink}
          download
          className="block w-full bg-autumn-amber hover:bg-autumn-amberHover text-white px-8 py-3.5 rounded-xl font-bold transition-all text-lg shadow-md shadow-autumn-amber/20 hover:scale-[1.02]"
        >
          Скачать MP3
        </a>
      </div>
    </div>
  );
}