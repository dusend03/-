#!/usr/bin/env node
// 앨범 템플릿을 1080×1920 MP4 릴스 영상으로 렌더링합니다.
//   node render.js                       → out/reels.mp4
//   node render.js --bgm music.mp3       → 배경음악 포함
//   node render.js --fps 30 --out out/my.mp4
//   node render.js --from 0 --to 8       → 일부 구간만 (테스트용)
//   node render.js --still 6.5           → 해당 시각 한 장만 PNG 로 저장
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const FPS = +opt('fps', 30);
const OUT = path.resolve(opt('out', 'out/reels.mp4'));
const BGM = opt('bgm', null);
const FROM = +opt('from', 0);
const TO = opt('to', null);
const STILL = opt('still', null);
const ROOT = __dirname;
const CACHE = path.join(ROOT, '.cache');

// content.js 읽어서 영상 목록 파악
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'content.js'), 'utf8'), sandbox);
const ALBUM = sandbox.window.ALBUM;
const isVideo = s => /\.(mp4|mov|webm|m4v)$/i.test(s);

// 영상 → 프레임 이미지 (정확한 프레임 동기화를 위해)
const videos = {};
for (const p of ALBUM.pages.filter(p => isVideo(p.media))) {
  const src = path.join(ROOT, p.media);
  if (!fs.existsSync(src)) throw new Error('파일 없음: ' + p.media);
  const full = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).toString().trim();
  const start = p.start || 0;
  const len = Math.min(full - start, (p.duration ?? ALBUM.timing.videoMax) + ALBUM.timing.flip + 0.2);
  const key = Buffer.from(`${p.media}|${start}|${len}|${FPS}|${fs.statSync(src).mtimeMs}`).toString('base64url').slice(-40);
  const dir = path.join(CACHE, key);
  if (!fs.existsSync(path.join(dir, 'done'))) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('🎞  영상 프레임 추출:', p.media);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(start), '-t', String(len), '-i', src,
      '-vf', `fps=${FPS},scale=900:900:force_original_aspect_ratio=increase`, '-q:v', '3', path.join(dir, '%05d.jpg')]);
    fs.writeFileSync(path.join(dir, 'done'), '');
  }
  const count = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).length;
  videos[p.media] = { dir: '.cache/' + key, count, fps: FPS, duration: full };
}

// 로컬 정적 서버
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, r));
  const url = `http://127.0.0.1:${server.address().port}/album.html?render`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.addInitScript(v => { window.RENDER = v; }, { videos });
  page.on('pageerror', e => console.error('페이지 오류:', e.message));
  await page.goto(url);
  const DUR = await page.evaluate(() => window.albumReady);
  console.log(`⏱  전체 길이 ${DUR.toFixed(1)}초`);

  if (STILL != null) {
    await page.evaluate(t => window.renderAt(t), +STILL);
    const f = OUT.replace(/\.mp4$/, '') + `-${STILL}s.png`;
    fs.mkdirSync(path.dirname(f), { recursive: true });
    await page.screenshot({ path: f });
    console.log('🖼 ', f);
    await browser.close(); server.close(); return;
  }

  const end = TO != null ? Math.min(+TO, DUR) : DUR;
  const frames = Math.round((end - FROM) * FPS);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const ff = ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-'];
  if (BGM) ff.push('-i', BGM);
  ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', String(FPS), '-movflags', '+faststart');
  if (BGM) ff.push('-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k',
    '-af', `afade=t=in:d=0.5,afade=t=out:st=${Math.max(0, end - FROM - 1.5)}:d=1.5`, '-t', String(end - FROM));
  ff.push(OUT);
  const enc = spawn('ffmpeg', ff, { stdio: ['pipe', 'inherit', 'inherit'] });

  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.renderAt(t), FROM + i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`\r🎬 ${i}/${frames} 프레임 (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  enc.stdin.end();
  await new Promise(r => enc.on('close', r));
  console.log(`\n✅ 완료: ${OUT}`);
  await browser.close(); server.close();
})().catch(e => { console.error(e); process.exit(1); });
