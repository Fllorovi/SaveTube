'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ResultCard } from '../components/ResultCard';
import { HowTo } from '../components/HowTo';
import { Footer } from '../components/Footer';
import { HistoryModal } from '../components/HistoryModal'; 
import { useHistory } from '../hooks/useHistory';
import { useLanguage } from '../context/LanguageContext'; // <-- Импорт

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [lastUrl, setLastUrl] = useState('');
  const [totalConversions, setTotalConversions] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { history, addToHistory, clearHistory } = useHistory();
  const { t } = useLanguage(); // <-- Получаем переводы

  useEffect(() => {
    const fetchCount = async () => {
      const { data, error } = await supabase.rpc('get_total_conversions');
      if (!error && data) setTotalConversions(data);
    };
    fetchCount();
  }, []);

    const handleConvert = async (url: string, quality: string) => {
    setLoading(true);
    setError('');
    setDownloadLink('');
    setLastUrl(url);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality }),
      });
      
      const data = await res.json();
      
      // Исправленный блок: закрыта фигурная скобка после throw
      if (!res.ok) {
        let errorMsg = t.errorServer;
        if (data.error === 'INVALID_URL') errorMsg = t.errorInvalidUrl;
        else if (data.error === 'DB_ERROR') errorMsg = t.errorDb;
        throw new Error(errorMsg);
      }

      const interval = setInterval(async () => {
        const { data: task, error: dbError } = await supabase
          .from('conversions')
          .select('status, file_name')
          .eq('id', data.taskId)
          .single();

        if (dbError) return;

        if (task?.status === 'done') {
          clearInterval(interval);
          setLoading(false);
          setDownloadLink(`/audio/${task.file_name}`);
          addToHistory(url, task.file_name);
          setTotalConversions(prev => prev + 1); 
        } else if (task?.status === 'error') {
          clearInterval(interval);
          setLoading(false);
          setError(t.errorConvert);
        }
      }, 3000);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[url('/images/bg-pattern.jpg')] bg-cover bg-center bg-fixed bg-autumn-light dark:bg-black relative transition-colors duration-300">
      <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none hidden dark:block"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onOpenHistory={() => setIsHistoryOpen(true)} />
        <main className="flex flex-col items-center w-full pb-20 flex-grow">
          <Hero 
            totalConversions={totalConversions} 
            onConvert={handleConvert} 
            loading={loading} 
          />
          
          {error && (
            <div className="mt-4 w-full max-w-md mx-auto px-4">
              <div className="bg-red-100/80 dark:bg-red-900/80 backdrop-blur-sm border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-xl text-center text-sm shadow-sm transition-colors">
                {error}
              </div>
            </div>
          )}

          <div className="w-full flex justify-center">
             <ResultCard 
               downloadLink={downloadLink} 
               videoUrl={lastUrl} 
               loading={loading} 
             />
          </div>

          <HowTo /> 
        </main>
        <Footer />
        <HistoryModal 
          isOpen={isHistoryOpen} 
          onClose={() => setIsHistoryOpen(false)} 
          history={history} 
          onClear={clearHistory} 
        />
      </div>
    </div>
  );
}