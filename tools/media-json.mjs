// Gera src/media.json com largura, altura e duração de cada full.mp4
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const root = 'public/media';
const out = {};
for (const id of fs.readdirSync(root).sort()) {
  const f = `${root}/${id}/full.mp4`;
  if (!fs.existsSync(f)) continue;
  let j;
  try {
    j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', f], { stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch {
    console.warn('ignorado (incompleto):', id);
    continue;
  }
  out[id] = { w: j.streams[0].width, h: j.streams[0].height, dur: Math.round(parseFloat(j.format.duration) * 10) / 10 };
}
fs.writeFileSync('src/media.json', JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'itens');
