'use client';
import { BackButton } from '../../components/BackButton';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/images/bg-pattern.jpg')] bg-cover bg-center bg-fixed bg-autumn-light dark:bg-black relative transition-colors duration-300">
      {/* Слой для затемнения фона в темной теме */}
      <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none hidden dark:block"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onOpenHistory={() => {}} />
        
        <main className="flex-grow max-w-4xl mx-auto px-4 py-8 text-autumn-coffee dark:text-gray-200 w-full relative">
          
          <BackButton />

          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center mt-4">
            Часто задаваемые вопросы (FAQ)
          </h1>
          
          <div className="space-y-8">
            
            <section className="bg-white/60 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">Почему конвертация не запускается?</h2>
              <p className="mb-3 leading-relaxed">
                Если вы нажали «ОК», но ничего не происходит или появляется ошибка, скорее всего, дело в одном из двух:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Блокировщик рекламы (AdBlock):</strong> Некоторые расширения блокируют фоновые запросы к Supabase. Попробуйте отключить AdBlock для этого сайта.</li>
                <li><strong>VPN или Прокси:</strong> Сервис использует локальный прокси для обхода защиты YouTube. Убедитесь, что ваш VPN-клиент запущен и слушает порт <code className="bg-amber-100 text-autumn-coffee px-1 rounded">7890</code> (по умолчанию).</li>
              </ul>
            </section>

            <section className="bg-white/60 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">Есть ли ограничения по длительности видео?</h2>
              <p className="leading-relaxed">
                Да. Для стабильной работы сервиса в рамках MVP установлен лимит на длительность видео — <strong>до 2 часов</strong>. Кроме того, итоговый размер MP3-файла не должен превышать 100 Мб.
              </p>
            </section>

            <section className="bg-white/60 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">Как долго хранится история скачиваний?</h2>
              <p className="leading-relaxed">
                Ваша история хранится <strong>только в вашем браузере</strong> (в localStorage). Максимальное количество записей — 10 последних конвертаций. Сами файлы на сервере удаляются автоматически через 1 час после конвертации.
              </p>
            </section>

            <section className="bg-white/60 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">Легально ли это?</h2>
              <p className="leading-relaxed">
                Сервис создан в образовательных целях. Скачивайте только тот контент, на который у вас есть права, или который находится в свободном доступе.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="inline-block bg-autumn-amber hover:bg-autumn-amberHover text-white px-8 py-3 rounded-xl font-bold transition">
              Вернуться на главную
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}