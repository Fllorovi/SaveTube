export function Footer() {
  const currentYear = 2026; 
  return (
    <footer className="w-full py-6 text-center text-sm text-autumn-coffee/70 dark:text-gray-400 bg-white/50 dark:bg-black/60 backdrop-blur-sm border-t border-amber-100 dark:border-gray-800 mt-auto transition-colors duration-300">
      <p className="text-sm text-autumn-coffee/70 dark:text-gray-300">© {currentYear} SaveTube</p>
      <p className="text-sm text-autumn-coffee/70 dark:text-gray-300">
        Скачивайте только тот контент, на который у вас есть права.
      </p>
    </footer>
  );
}