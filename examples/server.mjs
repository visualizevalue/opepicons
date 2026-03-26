import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { renderSVG } from '../dist/index.js';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.cjs':  'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.json': 'application/json',
};

const root = new URL('..', import.meta.url).pathname;

createServer(async (req, res) => {
  // Dynamic SVG endpoint: /icon/<seed>.svg?size=160
  const iconMatch = req.url.match(/^\/icon\/([^?]+?)(?:\.svg)?(?:\?(.*))?$/);
  if (iconMatch) {
    const seed = decodeURIComponent(iconMatch[1]);
    const params = new URLSearchParams(iconMatch[2] || '');
    const size = parseInt(params.get('size')) || undefined;

    const svg = renderSVG({ seed, size });
    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    res.end(svg);
    return;
  }

  const url = req.url === '/' ? '/examples/random-samples.html' : req.url;
  const filePath = join(root, url);

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(8080, () => console.log('Listening on http://localhost:8080'));
