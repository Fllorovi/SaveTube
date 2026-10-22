import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { supabase } from '../../../lib/supabase';

// Вспомогательная функция для запуска yt-dlp
function runYtDlp(args: string[]) {
  return new Promise<{ code: number | null, stderr: string }>((resolve) => {
    const child = spawn('yt-dlp', args, { shell: false });
    let stderrData = '';

    child.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    child.on('error', (err) => {
      console.error('Не удалось запустить yt-dlp напрямую:', err.message);
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
      return NextResponse.json({ error: 'INVALID_URL' }, { status: 400 });
    }

    // 2. Создаем запись в Supabase
    const { data: task, error: dbError } = await supabase
      .from('conversions')
      .insert([{ url, status: 'pending' }])
      .select()
      .single();

    if (dbError || !task) {
      console.error('Ошибка БД:', dbError);
      return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
    }

    // 3. Запускаем конвертацию в фоне
    processVideo(task.id, url, quality || '320');

    return NextResponse.json({ success: true, taskId: task.id });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}

async function processVideo(taskId: string, url: string, quality: string) {
  const outputDir = path.join(process.cwd(), 'public', 'audio');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = `${taskId}.mp3`;
  const outputPath = path.join(outputDir, fileName);

  await supabase.from('conversions').update({ status: 'processing' }).eq('id', taskId);

  // Аргументы для yt-dlp (добавили --write-info-json)
  const ytdlpArgs = [
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', quality === '128' ? '5' : '0',
    '--no-playlist',
    '--no-check-certificate',
    '--paths', `temp:${outputDir}`,
    '-o', outputPath,
    '--write-info-json', // <-- Сохраняем метаданные
    '--retries', '10',
    '--fragment-retries', '10',
    '--socket-timeout', '30',
    '--proxy', 'socks5://127.0.0.1:7890', // VPN
    '--js-runtimes', 'deno',
    '--extractor-args', 'youtubepot-bgutilhttp:base_url=http://127.0.0.1:4416', // PO Token
    '--extractor-args', 'youtube:player_client=mweb', // Только mweb
    url
  ];

  console.log(`Запуск конвертации (mweb) для ${url}...`);

  try {
    const { code, stderr } = await runYtDlp(ytdlpArgs);

        if (code === 0) {
      console.log(`Успешно сконвертировано: ${fileName}`);
      
      // Пытаемся прочитать название видео из info.json
      let videoTitle = null;
      // yt-dlp сохраняет файл как <имя>.mp3.info.json
      const infoPath = `${outputPath}.info.json`; 
      
      console.log('Ищем info.json по пути:', infoPath);
      console.log('Файл существует:', fs.existsSync(infoPath));

      try {
        if (fs.existsSync(infoPath)) {
          const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
          videoTitle = info.title;
          console.log('Найдено название:', videoTitle);
          // Удаляем временный json, чтобы не засорять папку
          fs.unlinkSync(infoPath);
        }
      } catch (e) {
        console.error('Не удалось прочитать название видео:', e);
      }

      await supabase
        .from('conversions')
        .update({ status: 'done', file_name: fileName, title: videoTitle })
        .eq('id', taskId);
    }
  } catch (err) {
    console.error('Критическая ошибка при конвертации:', err);
    await supabase.from('conversions').update({ status: 'error' }).eq('id', taskId);
  }
}