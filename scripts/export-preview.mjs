import { readdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const types = { jpg: 'image/jpeg', webp: 'image/webp', mp4: 'video/mp4' };
const scriptTag = /<script type="module" crossorigin src="\/([^"]+)"><\/script>/;
const styleTag = /<link rel="stylesheet" crossorigin href="\/([^"]+)">/;
const html = await readFile(new URL('index.html', dist), 'utf8');
const script = html.match(scriptTag)?.[1];
const style = html.match(styleTag)?.[1];
if (!script || !style) throw new Error('Missing JavaScript or stylesheet from the Vite output');

const media = [
  'hero.jpg',
  'hero.mp4',
  'portrait.jpg',
  ...(await readdir(new URL('media/gallery/full/', dist))).map((file) => `gallery/full/${file}`),
];
const embedded = await Promise.all(media.map(async (file) => {
  const data = await readFile(new URL(`media/${file}`, dist));
  return [file, `data:${types[file.split('.').at(-1)]};base64,${data.toString('base64')}`];
}));
const [js, css] = await Promise.all([script, style].map((file) => readFile(new URL(file, dist), 'utf8')));
const preview = html
  .replace(scriptTag, () => `<script>globalThis.portfolioPreviewMedia=${JSON.stringify(Object.fromEntries(embedded))}</script>
    <script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`)
  .replace(styleTag, () => `<style>${css}</style>`);

await writeFile(new URL('portfolio-preview.html', root), preview);
console.log(`portfolio-preview.html · ${media.length} bundled assets`);
