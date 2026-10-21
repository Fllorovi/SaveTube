'use client';
import { BackButton } from '../../components/BackButton';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/images/bg-pattern.jpg')] bg-cover bg-center bg-fixed bg-autumn-light relative">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onOpenHistory={() => {}} /> {/* Заглушка, чтобы шапка работала */}
        
<main className="flex-grow max-w-4xl mx-auto px-4 py-8 text-autumn-coffee w-full relative">
  
  {/* Кнопка Назад (sticky) */}
  <BackButton />

  {/* Заголовок (добавили mt-4 для отступа) */}
  <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center mt-4">
    Часто задаваемые вопросы (FAQ)
  </h1>
          
          <div className="space-y-8">
            
            {/* Блок 1: Ошибки и блокировщики */}
            <section className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">Почему конвертация не запускается?</h2>
              <p className="mb-3 leading-relaxed">
                Если вы нажали «ОК», но ничего не происходит или появляется ошибка, скорее всего, дело в одном из двух:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Блокировщик рекламы (AdBlock):</strong> Некоторые расширения блокируют фоновые запросы к Supabase. Попробуйте отключить AdBlock для этого сайта.</li>
                <li><strong>VPN или Прокси:</strong> Сервис использует локальный прокси для обхода защиты YouTube. Убедитесь, что ваш VPN-клиент запущен и слушает порт <code className="bg-amber-100 px-1 rounded">7890</code> (по умолчанию).</li>
              </ul>
            </section>

            {/* Блок 2: Ограничения */}
            <section className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">Есть ли ограничения по длительности видео?</h2>
              <p className="leading-relaxed">
                Да. Для стабильной работы сервиса в рамках MVP установлен лимит на длительность видео — <strong>до 2 часов</strong>. Кроме того, итоговый размер MP3-файла не должен превышать 100 Мб. Это связано с ограничениями дискового пространства и временем обработки на сервере.
              </p>
            </section>

            {/* Блок 3: История */}
            <section className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">Как долго хранится история скачиваний?</h2>
              <p className="leading-relaxed">
                Ваша история хранится <strong>только в вашем браузере</strong> (в localStorage) и не передается на сервер. Максимальное количество записей — 10 последних конвертаций. Если вы очистите кэш браузера или нажмете кнопку «Очистить» в модальном окне истории, записи удалятся навсегда. Сами файлы на сервере удаляются автоматически через 1 час после конвертации.
              </p>
            </section>

            {/* Блок 4: Правовая информация */}
            <section className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">Легально ли это?</h2>
              <p className="leading-relaxed">
                Сервис создан в образовательных целях. Скачивайте только тот контент, на который у вас есть права, или который находится в свободном доступе. Мы не храним ваши файлы и не несем ответственности за нарушение авторских прав третьими лицами.
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