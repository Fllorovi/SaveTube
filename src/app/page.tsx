'use client'; // Обязательно, так как мы используем интерактивность (useState)

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('320');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDownloadLink('');

    try {
      // 1. Отправляем запрос на наш API
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при запуске конвертации');
      }

      const taskId = data.taskId;

      // 2. Опрашиваем базу данных Supabase каждые 3 секунды, пока не закончится
      const interval = setInterval(async () => {
        const { data: task, error } = await supabase
          .from('conversions')
          .select('status, file_name')
          .eq('id', taskId)
          .single();

        if (error) {
          console.error(error);
          return;
        }

        if (task.status === 'done') {
          clearInterval(interval);
          setLoading(false);
          // Формируем ссылку на файл в папке public/audio
          setDownloadLink(`/audio/${task.file_name}`);
          setUrl(''); // Очищаем поле ввода
        } else if (task.status === 'error') {
          clearInterval(interval);
          setLoading(false);
          setError('Не удалось сконвертировать видео. Проверьте ссылку или попробуйте позже.');
        }
      }, 3000); // 3000 мс = 3 секунды

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          SaveTube: YouTube в MP3
        </h1>

        <form onSubmit={handleConvert} className="flex flex-col gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Вставьте ссылку на YouTube"
            className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setQuality('128')}
              className={`flex-1 py-2 rounded-lg border ${quality === '128' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600'}`}
              disabled={loading}
            >
              Экономно (128 kbps)
            </button>
            <button
              type="button"
              onClick={() => setQuality('320')}
              className={`flex-1 py-2 rounded-lg border ${quality === '320' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600'}`}
              disabled={loading}
            >
              HQ (320 kbps)
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Конвертируем...' : 'Конвертировать'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}

        {downloadLink && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 mb-2">Файл готов!</p>
            <a
              href={downloadLink}
              download
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Скачать MP3
            </a>
          </div>
        )}
      </div>
    </main>
  );
}