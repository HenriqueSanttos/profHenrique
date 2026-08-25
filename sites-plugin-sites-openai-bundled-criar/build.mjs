// Empacota o portfólio estático em um Worker compatível com o ambiente Sites.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const css = await readFile('styles.css', 'utf8');
const script = await readFile('script.js', 'utf8');
const resume = (await readFile('outputs/curriculo-prof-henrique-santos.pdf')).toString('base64');
const portrait = (await readFile('assets/henrique-retrato.png')).toString('base64');
const workspace = (await readFile('assets/henrique-programando.jpg')).toString('base64');
const document = html
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>${css}</style>`)
  .replace('<script src="script.js"></script>', `<script>${script}</script>`);

await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', `const page = ${JSON.stringify(document)};\nconst resume = ${JSON.stringify(resume)};\nconst portrait = ${JSON.stringify(portrait)};\nconst workspace = ${JSON.stringify(workspace)};\nconst decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));\nexport default { async fetch(request) { const path = new URL(request.url).pathname; if (path === '/curriculo-prof-henrique-santos.pdf') return new Response(decode(resume), { headers: { 'content-type': 'application/pdf', 'content-disposition': 'attachment; filename=curriculo-prof-henrique-santos.pdf' } }); if (path === '/henrique-retrato.png') return new Response(decode(portrait), { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=86400' } }); if (path === '/henrique-programando.jpg') return new Response(decode(workspace), { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=86400' } }); return new Response(page, { headers: { 'content-type': 'text/html; charset=UTF-8', 'cache-control': 'public, max-age=300' } }); } };\n`);
