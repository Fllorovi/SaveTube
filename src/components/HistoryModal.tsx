'use client';

import { HistoryItem } from '../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
};

export function HistoryModal({ isOpen, onClose, history, onClear }: Props) {
  if (!isOpen) return null;

  return (
    // Затемненный фон (оверлей)
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Само окно */}
      <div 
        className="bg-autumn-light w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl border border-amber-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Чтобы клик внутри окна не закрывал его
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-autumn-coffee">История</h2>
          <button 
            onClick={onClose}
            className="text-autumn-coffee/50 hover:text-red-500 transition-colors text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {history.length === 0 ? (
          <p className="text-center text-autumn-coffee/60 py-8">
            Вы еще ничего не конвертировали.
          </p>
        ) : (
          <>
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {history.map((item) => (
                <li key={item.id} className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-white/60">
                  <div className="truncate pr-4">
                    <p className="truncate text-autumn-coffee text-sm font-medium" title={item.url}>
                      {item.url}
                    </p>
                    <p className="text-xs text-autumn-coffee/50 mt-1">{item.date}</p>
                  </div>
                  <a
                    href={`/audio/${item.fileName}`}
                    download
                    className="bg-autumn-amber hover:bg-autumn-amberHover text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition whitespace-nowrap"
                  >
                    Скачать
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 text-center border-t border-amber-200/50 pt-4">
              <button 
                onClick={onClear}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Очистить всю историю
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}