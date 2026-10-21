'use client';

export function HowTo() {
  return (
    <section id="faq" className="w-full max-w-5xl mx-auto py-16 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-autumn-coffee mb-10 drop-shadow-sm">
        Как это работает?
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Шаг 1 */}
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl text-center border border-white/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-5xl mb-4"></div>
          <h3 className="text-xl font-bold text-autumn-coffee mb-3">1. Скопируйте ссылку</h3>
          <p className="text-autumn-coffee/80 text-sm leading-relaxed">
            Найдите нужное видео на YouTube и скопируйте его URL из адресной строки браузера или через кнопку «Поделиться».
          </p>
        </div>

        {/* Шаг 2 */}
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl text-center border border-white/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-5xl mb-4"></div>
          <h3 className="text-xl font-bold text-autumn-coffee mb-3">2. Выберите качество</h3>
          <p className="text-autumn-coffee/80 text-sm leading-relaxed">
            Вставьте ссылку в поле выше. Выберите 128 kbps для экономии места на устройстве или 320 kbps для максимального качества звука.
          </p>
        </div>

        {/* Шаг 3 */}
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl text-center border border-white/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-5xl mb-4"></div>
          <h3 className="text-xl font-bold text-autumn-coffee mb-3">3. Скачайте</h3>
          <p className="text-autumn-coffee/80 text-sm leading-relaxed">
            Нажмите «ОК», подождите несколько секунд, пока идет конвертация. Затем нажмите кнопку «Скачать MP3» и наслаждайтесь музыкой офлайн.
          </p>
        </div>

      </div>
    </section>
  );
}