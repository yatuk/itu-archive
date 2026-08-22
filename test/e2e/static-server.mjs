import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.argv[2] || 8799);
const root = resolve(fileURLToPath(new URL('../../docs/', import.meta.url)));
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const relative = normalize(pathname).replace(/^([/\\])+/, '');
  let filename = resolve(join(root, relative));
  if (filename !== root && !filename.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    if (statSync(filename).isDirectory()) filename = join(filename, 'index.html');
    const size = statSync(filename).size;
    response.writeHead(200, {
      'Content-Type': mime[extname(filename).toLowerCase()] || 'application/octet-stream',
      'Content-Length': size,
      'Cache-Control': 'no-store',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(filename).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(port, '127.0.0.1');
