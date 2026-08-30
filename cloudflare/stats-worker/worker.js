// itu-ders.com "ziyaret sayacı" Worker.
//
// Masthead'deki .statbar'da gerçek ziyaret sayısını göstermek için: statik
// sitenin (GitHub Pages) kendisi bunu yapamaz, o yüzden ayrı bir Worker
// Cloudflare'ın GraphQL Analytics API'sine (zaten sahip olduğumuz veri —
// dashboard'daki "Web Analytics" sayfasının kaynağı) sunucu tarafında sorar,
// ediğer sonucu kısa süreliğine önbelleğe alır ve yalnız küçük bir sayı
// döner. Gerçek API token TARAYICIYA HİÇ gitmez — yalnız bu Worker'ın
// secret'ı olarak saklanır.
//
// Kurulum: bkz. README.md.

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const allowed = new Set(['https://itu-ders.com', 'https://www.itu-ders.com']);
    const cors = {
      'Access-Control-Allow-Origin': allowed.has(origin) ? origin : 'https://itu-ders.com',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405, headers: cors });

    const cache = caches.default;
    const cacheKey = new Request(new URL('/__visits30d', request.url).toString(), { method: 'GET' });
    const hit = await cache.match(cacheKey);
    if (hit) {
      const res = new Response(hit.body, hit);
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      return res;
    }

    const until = new Date();
    const since = new Date(until.getTime() - 30 * 86400000);
    const iso = (d) => d.toISOString().slice(0, 10);

    const query = `
      query Visits($zoneTag: String!, $since: Date!, $until: Date!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            httpRequests1dGroups(limit: 31, filter: { date_geq: $since, date_leq: $until }) {
              uniq { uniques }
            }
          }
        }
      }`;

    let visits30d = null;
    try {
      const resp = await fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables: { zoneTag: env.ZONE_TAG, since: iso(since), until: iso(until) } }),
      });
      const data = await resp.json();
      const groups = data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups;
      if (Array.isArray(groups)) {
        visits30d = groups.reduce((sum, g) => sum + (g?.uniq?.uniques || 0), 0);
      }
    } catch {
      visits30d = null; // yukarıda: veri yoksa istemci rozeti sessizce göstermez
    }

    const body = JSON.stringify({ visits30d, updatedAt: until.toISOString() });
    const res = new Response(body, {
      headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
    });
    if (visits30d != null) ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  },
};
