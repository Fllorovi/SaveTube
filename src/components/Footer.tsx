export function Footer() {
  const currentYear = 2026; 
  return (
    <footer className="w-full py-6 text-center text-sm text-autumn-coffee/70 bg-white/50 backdrop-blur-sm border-t border-amber-100 mt-auto">
      <p>© {currentYear} SaveTube</p>
      <p className="mt-2 text-xs text-autumn-coffee/50">
        Скачивайте только тот контент, на который у вас есть права.
      </p>
    </footer>
  );
}