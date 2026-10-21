'use client';
import { BackButton } from '../../components/BackButton';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';

export default function FAQPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[url('/images/bg-pattern.jpg')] bg-cover bg-center bg-fixed bg-autumn-light dark:bg-black relative transition-colors duration-300">
      <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none hidden dark:block"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onOpenHistory={() => {}} />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-8 text-autumn-coffee dark:text-gray-200 w-full relative">
          <BackButton />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center mt-4">{t.faqTitle}</h1>
          
          <div className="space-y-8">
            <section className="bg-white/60 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">{t.faqQ1}</h2>
              <p className="mb-3 leading-relaxed">{t.faqA1}</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>{t.faqA1_1.split(':')[0]}:</strong>{t.faqA1_1.split(':')[1]}</li>
                <li><strong>{t.faqA1_2.split(':')[0]}:</strong>{t.faqA1_2.split(':')[1]}</li>
              </ul>
            </section>

            <section className="bg-white/60 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">{t.faqQ2}</h2>
              <p className="leading-relaxed">{t.faqA2}</p>
            </section>

            <section className="bg-white/60 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">{t.faqQ3}</h2>
              <p className="leading-relaxed">{t.faqA3}</p>
            </section>

            <section className="bg-white/60 dark:bg-[#1a1512]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-autumn-amber">{t.faqQ4}</h2>
              <p className="leading-relaxed">{t.faqA4}</p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="inline-block bg-autumn-amber hover:bg-autumn-amberHover text-white px-8 py-3 rounded-xl font-bold transition">
              {t.backToMain}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}