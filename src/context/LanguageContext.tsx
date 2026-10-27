'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'en';

const translations = {
  ru: {
    // Главная
    title: 'Скачать музыку с ютуба:',
    subtitle: 'конвертер YouTube в MP3',
    placeholder: 'Вставьте URL формата https://youtu.be/...',
    btnOk: 'ОК',
    btnLoading: '...',
    btnDownload: 'Скачать MP3',
    converting: 'Идет конвертация...',
    waitTime: 'Это может занять до 30 секунд',
    noCover: 'Обложка недоступна',
    conversions: 'успешных конвертаций',
    
    // HowTo (Карточки)
    howToTitle: 'Как это работает?',
    step1Title: '1. Скопируйте ссылку',
    step1Desc: 'Найдите нужное видео на YouTube и скопируйте его URL из адресной строки браузера или через кнопку «Поделиться».',
    step2Title: '2. Выберите качество',
    step2Desc: 'Вставьте ссылку в поле выше. Выберите 128 kbps для экономии места на устройстве или 320 kbps для максимального качества звука.',
    step3Title: '3. Скачайте',
    step3Desc: 'Нажмите «ОК», подождите несколько секунд, пока идет конвертация. Затем нажмите кнопку «Скачать MP3» и наслаждайтесь музыкой офлайн.',
    
    // История
    historyTitle: 'История',
    historyEmpty: 'Вы еще ничего не конвертировали.',
    clearHistory: 'Очистить всю историю',
    
    // Футер
    footerText: '© 2026 SaveTube',
    footerLegal: 'Скачивайте только тот контент, на который у вас есть права.',
    
    // FAQ (страница)
    faqTitle: 'Часто задаваемые вопросы (FAQ)',
    faqQ1: 'Почему конвертация не запускается?',
    faqA1: 'Если вы нажали «ОК», но ничего не происходит или появляется ошибка, скорее всего, дело в одном из двух:',
    faqA1_1: 'Блокировщик рекламы (AdBlock): Некоторые расширения блокируют фоновые запросы к Supabase. Попробуйте отключить AdBlock для этого сайта.',
    faqA1_2: 'VPN или Прокси: Сервис использует локальный прокси для обхода защиты YouTube. Убедитесь, что ваш VPN-клиент запущен и слушает порт 7890 (по умолчанию).',
    faqQ2: 'Есть ли ограничения по длительности видео?',
    faqA2: 'Да. Для стабильной работы сервиса в рамках MVP установлен лимит на длительность видео — до 2 часов. Кроме того, итоговый размер MP3-файла не должен превышать 100 Мб.',
    faqQ3: 'Как долго хранится история скачиваний?',
    faqA3: 'Ваша история хранится только в вашем браузере (в localStorage). Максимальное количество записей — 10 последних конвертаций. Сами файлы на сервере удаляются автоматически через 1 час после конвертации.',
    faqQ4: 'Легально ли это?',
    faqA4: 'Сервис создан в образовательных целях. Скачивайте только тот контент, на который у вас есть права, или который находится в свободном доступе.',
    backBtn: 'Назад',
    backToMain: 'Вернуться на главную',
    faqLink: 'FAQ',
    historyBtnTitle: 'История скачиваний',
    errorStart: 'Ошибка при запуске конвертации',
    errorConvert: 'Не удалось сконвертировать видео. Проверьте ссылку или попробуйте позже.',
    errorServer: 'Внутренняя ошибка сервера',
    errorInvalidUrl: 'Некорректная ссылка на видео',
    errorDb: 'Ошибка базы данных. Попробуйте позже.',
    errorTooLong: 'Видео слишком длинное. Максимальная длительность — 2 часа.',
    errorTooLarge: 'Файл слишком большой. Максимальный размер — 100 Мб.',
  },
  en: {
    // Main
    title: 'Download music from YouTube:',
    subtitle: 'YouTube to MP3 converter',
    placeholder: 'Paste URL like https://youtu.be/...',
    btnOk: 'OK',
    btnLoading: '...',
    btnDownload: 'Download MP3',
    converting: 'Converting...',
    waitTime: 'This may take up to 30 seconds',
    noCover: 'Cover not available',
    conversions: 'successful conversions',
    
    // HowTo
    howToTitle: 'How it works?',
    step1Title: '1. Copy the link',
    step1Desc: 'Find the video on YouTube and copy its URL from the browser address bar or via the "Share" button.',
    step2Title: '2. Choose quality',
    step2Desc: 'Paste the link in the field above. Choose 128 kbps to save space or 320 kbps for maximum sound quality.',
    step3Title: '3. Download',
    step3Desc: 'Click "OK", wait a few seconds while converting. Then click "Download MP3" and enjoy offline music.',
    
    // History
    historyTitle: 'History',
    historyEmpty: 'You haven\'t converted anything yet.',
    clearHistory: 'Clear all history',
    
    // Footer
    footerText: '© 2026 SaveTube',
    footerLegal: 'Download only content you have the rights to.',
    
    // FAQ
    faqTitle: 'Frequently Asked Questions (FAQ)',
    faqQ1: 'Why doesn\'t the conversion start?',
    faqA1: 'If you clicked "OK" but nothing happens or an error appears, it\'s likely one of two things:',
    faqA1_1: 'AdBlocker: Some extensions block background requests to Supabase. Try disabling AdBlock for this site.',
    faqA1_2: 'VPN or Proxy: The service uses a local proxy to bypass YouTube protection. Make sure your VPN client is running and listening on port 7890 (default).',
    faqQ2: 'Are there any duration limits?',
    faqA2: 'Yes. For stable operation within the MVP, there is a video duration limit of up to 2 hours. Also, the final MP3 file size must not exceed 100 MB.',
    faqQ3: 'How long is the download history stored?',
    faqA3: 'Your history is stored only in your browser (localStorage). Maximum number of records — 10 last conversions. Files on the server are automatically deleted 1 hour after conversion.',
    faqQ4: 'Is this legal?',
    faqA4: 'The service is created for educational purposes. Download only content you have the rights to or that is in the public domain.',
    backBtn: 'Back',
    backToMain: 'Back to main',
    faqLink: 'FAQ',
    historyBtnTitle: 'Download history',
    errorStart: 'Error starting conversion',
    errorConvert: 'Failed to convert video. Check the link or try again later.',
    errorServer: 'Internal server error',
    errorInvalidUrl: 'Invalid video link',
    errorDb: 'Database error. Please try again later.',
    errorTooLong: 'Video is too long. Maximum duration is 2 hours.',
    errorTooLarge: 'File is too large. Maximum size is 100 MB.',
  }
};

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['ru'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ru');
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}