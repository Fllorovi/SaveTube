'use client';

import { useState } from 'react';

type Props = {
  onConvert: (url: string, quality: string) => void;
  loading: boolean;
};

export function ConvertForm({ onConvert, loading }: Props) {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('320');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onConvert(url, quality);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
  );
}