'use client';

import { useState, useEffect } from 'react';
import { HistoryItem } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('downloadHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка чтения истории', e);
      }
    }
  }, []);

  const addToHistory = (url: string, fileName: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      url,
      fileName,
      date: new Date().toLocaleString('ru-RU'),
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('downloadHistory', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('downloadHistory');
  };

  return { history, addToHistory, clearHistory };
}