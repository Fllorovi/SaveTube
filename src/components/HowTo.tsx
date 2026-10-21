'use client';
import { useLanguage } from '../context/LanguageContext';

export function HowTo() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="w-full max-w-5xl mx-auto py-16 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-autumn-coffee dark:text-white mb-10 drop-shadow-sm transition-colors">
        {t.howToTitle}
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/40 dark:bg-[#1a1512]/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="text-5xl mb-4"></div>
          <h3 className="text-xl font-bold text-autumn-coffee dark:text-white mb-3">{t.step1Title}</h3>
          <p className="text-autumn-coffee/80 dark:text-gray-300 text-sm leading-relaxed">{t.step1Desc}</p>
        </div>

        <div className="bg-white/40 dark:bg-[#1a1512]/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="text-5xl mb-4"></div>
          <h3 className="text-xl font-bold text-autumn-coffee dark:text-white mb-3">{t.step2Title}</h3>
          <p className="text-autumn-coffee/80 dark:text-gray-300 text-sm leading-relaxed">{t.step2Desc}</p>
        </div>

        <div className="bg-white/40 dark:bg-[#1a1512]/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="text-5xl mb-4"></div>
          <h3 className="text-xl font-bold text-autumn-coffee dark:text-white mb-3">{t.step3Title}</h3>
          <p className="text-autumn-coffee/80 dark:text-gray-300 text-sm leading-relaxed">{t.step3Desc}</p>
        </div>
      </div>
    </section>
  );
}