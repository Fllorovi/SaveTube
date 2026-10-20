'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ConvertForm } from '../components/ConvertForm';
import { HistoryList } from '../components/HistoryList';
import { useHistory } from '../hooks/useHistory';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const { history, addToHistory, clearHistory } = useHistory();

  const handleConvert = async (url: string, quality: string) => {
    setLoading(true);
    setError('');
    setDownloadLink('');

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при запуске');

      const interval = setInterval(async () => {
        const { data: task } = await supabase
          .from('conversions')
          .select('status, file_name')
          .eq('id', data.taskId)
          .single();

        if (task?.status === 'done') {
          clearInterval(interval);
          setLoading(false);
          const fileLink = `/audio/${task.file_name}`;
          setDownloadLink(fileLink);
          addToHistory(url, task.file_name);
        } else if (task?.status === 'error') {
          clearInterval(interval);
          setLoading(false);
          setError('Не удалось сконвертировать. Проверьте ссылку.');
        }
      }, 3000);
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

        <ConvertForm onConvert={handleConvert} loading={loading} />

        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}

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

        <HistoryList history={history} onClear={clearHistory} />
      </div>
    </main>
  );
}