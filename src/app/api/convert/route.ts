import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { supabase } from '../../../lib/supabase';

// Вспомогательная функция для запуска yt-dlp с перебором клиентов
function runYtDlp(args: string[]) {
  return new Promise<{ code: number | null, stderr: string }>((resolve) => {
    // Пробуем запустить yt-dlp напрямую
    const child = spawn('yt-dlp', args, { shell: false });
    let stderrData = '';

    child.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    child.on('error', (err) => {
      console.error('Не удалось запустить yt-dlp напрямую:', err.message);
      // Фолбэк на запуск через python, если yt-dlp нет в PATH
      const pyChild = spawn('python', ['-m', 'yt_dlp', ...args], { shell: false });
      let pyStderr = '';
      
      pyChild.stderr.on('data', (data) => {
        pyStderr += data.toString();
      });

      pyChild.on('close', (code) => {
        resolve({ code, stderr: pyStderr });
      });
    });

    child.on('close', (code) => {
      resolve({ code, stderr: stderrData });
    });
  });
}

export async function POST(req: Request) {
  try {
    const { url, quality } = await req.json();

    // 1. Валидация ссылки
    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
      return NextResponse.json({ error: 'Некорректная ссылка' }, { status: 400 });
    }

    // 2. Создаем запись в Supabase
    const { data: task, error: dbError } = await supabase
      .from('conversions')
      .insert([{ url, status: 'pending' }])
      .select()
      .single();

    if (dbError || !task) {
      console.error('Ошибка БД:', dbError);
      return NextResponse.json({ error: 'Ошибка базы данных' }, { status: 500 });
    }

    // 3. Запускаем конвертацию в фоне
    processVideo(task.id, url, quality || '320');

    return NextResponse.json({ success: true, taskId: task.id });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

async function processVideo(taskId: string, url: string, quality: string) {
  const outputDir = path.join(process.cwd(), 'public', 'audio');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = `${taskId}.mp3`;
  const outputPath = path.join(outputDir, fileName);

  // Обновляем статус на 'processing'
  await supabase.from('conversions').update({ status: 'processing' }).eq('id', taskId);

  // Базовые аргументы, которые нужны всегда
  const baseArgs = [
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', quality === '128' ? '5' : '0',
    '--no-playlist',
    '--no-check-certificate',
    '--paths', `temp:${outputDir}`,
    '-o', outputPath,
    '--retries', '10', // Увеличенное число попыток
    '--fragment-retries', '10',
    '--socket-timeout', '30',
    '--proxy', 'socks5://127.0.0.1:7890', // ВАШ VPN ПОРТ
    '--js-runtimes', 'deno',
    '--extractor-args', 'youtubepot-bgutilhttp:base_url=http://127.0.0.1:4416',
    url
    
  ];

  // Список клиентов для перебора (сначала tv, потом web_safari)
  const clients = ['tv', 'web_safari', 'mweb'];

  let success = false;

  for (const client of clients) {
    console.log(`Попытка конвертации с клиентом: ${client}...`);
    
    // Добавляем аргумент клиента к базовым
    const currentArgs = [
      ...baseArgs,
      '--extractor-args', `youtube:player_client=${client}`
    ];

    try {
      const { code, stderr } = await runYtDlp(currentArgs);

      if (code === 0) {
        console.log(`Успешно сконвертировано с клиентом ${client}: ${fileName}`);
        await supabase
          .from('conversions')
          .update({ status: 'done', file_name: fileName })
          .eq('id', taskId);
        success = true;
        break; // Выходим из цикла, если успех
      } else {
        console.warn(`Клиент ${client} не сработал. Код: ${code}. Ошибка: ${stderr.substring(0, 200)}...`);
      }
    } catch (err) {
      console.error(`Критическая ошибка при клиенте ${client}:`, err);
    }
  }

  if (!success) {
    console.error('Все попытки конвертации провалились.');
    await supabase.from('conversions').update({ status: 'error' }).eq('id', taskId);
  }
}