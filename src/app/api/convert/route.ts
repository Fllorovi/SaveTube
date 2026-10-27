import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { supabase } from '../../../lib/supabase';

async function getVideoDuration(url: string): Promise<number | null> {
  // Запускаем yt-dlp только для получения длительности (без скачивания)
  const args = [
    '--get-duration',
    '--no-playlist',
    '--proxy', 'socks5://127.0.0.1:7890',
    '--js-runtimes', 'deno',
    '--extractor-args', 'youtubepot-bgutilhttp:base_url=http://127.0.0.1:4416',
    '--extractor-args', 'youtube:player_client=mweb',
    url
  ];
  
  try {
    const { code, stderr } = await runYtDlp(args);
    // yt-dlp с --get-duration выводит длительность в stdout, но наша функция читает stderr.
    // Проще использовать --print duration
    const printArgs = ['--print', 'duration', ...args.slice(1)]; // заменяем --get-duration на --print duration
    const { code: code2, stderr: out2 } = await runYtDlp(printArgs);
    
    if (code2 === 0) {
      // Ищем в выводе число (длительность в секундах)
      const match = out2.match(/^(\d+)$/m);
      if (match) return parseInt(match[1], 10);
    }
  } catch (e) {
    console.error('Ошибка получения длительности:', e);
  }
  return null; // Не удалось узнать — пропускаем проверку
}


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

// Очистка названия файла от запрещенных символов
function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim().substring(0, 100);
}

export async function POST(req: Request) {
  try {
    const { url, quality } = await req.json();

    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
      return NextResponse.json({ error: 'INVALID_URL' }, { status: 400 });
    }

    const { data: task, error: dbError } = await supabase
      .from('conversions')
      .insert([{ url, status: 'pending' }])
      .select()
      .single();

    if (dbError || !task) {
      console.error('Ошибка БД:', dbError);
      return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
    }

    processVideo(task.id, url, quality || '320');

    return NextResponse.json({ success: true, taskId: task.id });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}

async function processVideo(taskId: string, url: string, quality: string) {
  const outputDir = path.join(process.cwd(), 'public', 'audio');
    // Проверка длительности (лимит 2 часа = 7200 секунд)
  console.log('Проверка длительности видео...');
  const duration = await getVideoDuration(url);
  if (duration && duration > 7200) {
    console.error(`Видео слишком длинное: ${duration} сек.`);
    await supabase.from('conversions').update({ status: 'error' }).eq('id', taskId);
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = `${taskId}.mp3`;
  const outputPath = path.join(outputDir, fileName);

  await supabase.from('conversions').update({ status: 'processing' }).eq('id', taskId);

  const ytdlpArgs = [
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', quality === '128' ? '5' : '0',
    '--no-playlist',
    '--no-check-certificate',
    '--paths', `temp:${outputDir}`,
    '-o', outputPath,
    '--write-info-json',
    '--retries', '10',
    '--fragment-retries', '10',
    '--socket-timeout', '30',
    '--proxy', 'socks5://127.0.0.1:7890',
    '--js-runtimes', 'deno',
    '--extractor-args', 'youtubepot-bgutilhttp:base_url=http://127.0.0.1:4416',
    '--extractor-args', 'youtube:player_client=mweb',
    url
  ];

  console.log(`Запуск конвертации (mweb) для ${url}...`);

  try {
    const { code, stderr } = await runYtDlp(ytdlpArgs);

    if (code === 0) {
      console.log(`Успешно сконвертировано: ${fileName}`);
            // Проверка размера (лимит 100 Мб = 104857600 байт)
      const stats = fs.statSync(outputPath);
      const MAX_SIZE = 100 * 1024 * 1024; // 100 Мб
      
      if (stats.size > MAX_SIZE) {
        console.error(`Файл слишком большой: ${(stats.size / 1024 / 1024).toFixed(1)} Мб`);
        fs.unlinkSync(outputPath); // Удаляем файл
        await supabase.from('conversions').update({ status: 'error' }).eq('id', taskId);
        return;
      }
      let videoTitle = null;
      let finalFileName = fileName;
      const infoPath = `${outputPath}.info.json`;

      try {
        if (fs.existsSync(infoPath)) {
          const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
          videoTitle = info.title;
          
          if (videoTitle) {
            const safeTitle = sanitizeFileName(videoTitle);
            const newFileName = `${safeTitle}.mp3`;
            const newPath = path.join(outputDir, newFileName);

            if (newFileName !== fileName) {
              fs.renameSync(outputPath, newPath);
              finalFileName = newFileName;
              console.log(`Файл переименован: ${finalFileName}`);
            }
          }
          
          fs.unlinkSync(infoPath);
        }
      } catch (e) {
        console.error('Не удалось прочитать название или переименовать файл:', e);
      }

      await supabase
        .from('conversions')
        .update({ status: 'done', file_name: finalFileName, title: videoTitle })
        .eq('id', taskId);
    } else {
      console.error(`Ошибка yt-dlp (код ${code}): ${stderr}`);
      await supabase
        .from('conversions')
        .update({ status: 'error' })
        .eq('id', taskId);
    }
  } catch (err) {
    console.error('Критическая ошибка при конвертации:', err);
    await supabase.from('conversions').update({ status: 'error' }).eq('id', taskId);
  }
}