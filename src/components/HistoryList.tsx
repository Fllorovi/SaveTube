import { HistoryItem } from '../types';

type Props = {
  history: HistoryItem[];
  onClear: () => void;
};

export function HistoryList({ history, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-700">История</h2>
        <button onClick={onClear} className="text-sm text-red-500 hover:text-red-700">
          Очистить
        </button>
      </div>
      <ul className="space-y-2">
        {history.map((item) => (
          <li key={item.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded border">
            <div className="truncate pr-2">
              <p className="truncate text-gray-700">{item.url}</p>
              <p className="text-xs text-gray-400">{item.date}</p>
            </div>
            <a
              href={`/audio/${item.fileName}`}
              download
              className="text-blue-600 hover:underline whitespace-nowrap"
            >
              Скачать
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}