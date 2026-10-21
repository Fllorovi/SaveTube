'use client';

import { ConvertForm } from './ConvertForm';
import { useLanguage } from '../context/LanguageContext';

type Props = {
  totalConversions: number;
  onConvert: (url: string, quality: string) => void;
  loading: boolean;
};

export function Hero({ totalConversions, onConvert, loading }: Props) {
  const { t, lang } = useLanguage(); // <-- Получаем язык

  // Выбираем локаль для форматирования чисел
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US';

  return (
    <section className="flex flex-col items-center justify-center text-center py-16 px-4">
      
      <div className="mb-6 inline-block px-4 py-1.5 bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-gray-700 text-autumn-amber rounded-full text-sm font-bold shadow-sm transition-colors">
        {/* Используем локаль и перевод */}
        {totalConversions.toLocaleString(locale)} + {t.conversions}
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-autumn-coffee dark:text-white mb-8 leading-tight tracking-tight transition-colors">
        {t.title}<br />
        <span className="text-autumn-amber drop-shadow-sm">{t.subtitle}</span>
      </h1>

      <div className="w-full">
        <ConvertForm onConvert={onConvert} loading={loading} />
      </div>
    </section>
  );
}