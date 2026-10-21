'use client';

import { ConvertForm } from './ConvertForm';

type Props = {
  totalConversions: number;
  onConvert: (url: string, quality: string) => void;
  loading: boolean;
};

export function Hero({ totalConversions, onConvert, loading }: Props) {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 px-4">
      
      {/* Счетчик конвертаций */}
      <div className="mb-6 inline-block px-4 py-1.5 bg-white/30 backdrop-blur-md border border-white/40 text-autumn-amber rounded-full text-sm font-bold shadow-sm">
        {totalConversions.toLocaleString('ru-RU')} + успешных конвертаций
      </div>

      {/* Заголовок */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-autumn-coffee mb-8 leading-tight tracking-tight">
        Скачать музыку с ютуба:<br />
        <span className="text-autumn-amber drop-shadow-sm">конвертер YouTube в MP3</span>
      </h1>

      {/* Форма ввода */}
      <div className="w-full">
        <ConvertForm onConvert={onConvert} loading={loading} />
      </div>
    </section>
  );
}