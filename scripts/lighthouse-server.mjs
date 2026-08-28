import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { createGzip } from 'node:zlib';

const root = resolve(process.argv[2] || 'docs');
const port = Number(process.env.PORT || 4173);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
const compressible = new Set(['.css', '.csv', '.html', '.js', '.json', '.svg', '.xml']);

createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) throw new Error('invalid path');
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
    const stat = statSync(file);
    const extension = extname(file).toLowerCase();
    const gzip = compressible.has(extension) && /\bgzip\b/.test(request.headers['accept-encoding'] || '');
    response.writeHead(200, {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': types[extension] || 'application/octet-stream',
      ...(gzip ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : { 'Content-Length': stat.size }),
    });
    if (request.method === 'HEAD') return response.end();
    const stream = createReadStream(file);
    if (gzip) stream.pipe(createGzip()).pipe(response);
    else stream.pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Lighthouse server: http://127.0.0.1:${port}`);
});
