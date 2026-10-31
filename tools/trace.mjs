import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'fs';
const src = 'tools/logo-src.webp';
// alpha -> black shape on white
const { data, info } = await sharp(src).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
const inv = Buffer.from(data.map(v => 255 - v));
await sharp(inv, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toFile('tools/logo-mask.png');
potrace.trace('tools/logo-mask.png', { threshold: 128, turdSize: 20, optTolerance: 0.3, color: '#000' }, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync('tools/logo-raw.svg', svg);
  console.log('ok', svg.length);
});
