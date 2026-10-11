// questports-media: static assets are served directly by Cloudflare.
// This script only runs for /previews/* (run_worker_first) to add byte-range (206) support,
// which Safari/iOS needs for <video>.
const EXTRA = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
  'Accept-Ranges': 'bytes',
};
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Allow-Headers': 'Range', 'Access-Control-Max-Age': '86400' } });
    }
    const range = request.headers.get('Range');
    const assetReq = new Request(request.url, { method: request.method === 'HEAD' ? 'HEAD' : 'GET' });
    const res = await env.ASSETS.fetch(assetReq);
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(EXTRA)) headers.set(k, v);
    if (res.status !== 200 || !range) return new Response(res.body, { status: res.status, headers });
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!m || (m[1] === '' && m[2] === '')) return new Response(res.body, { status: 200, headers });
    let size = Number(res.headers.get('Content-Length'));
    let buf = null;
    if (!size) { buf = new Uint8Array(await res.arrayBuffer()); size = buf.length; } // asset body may be streamed without a length
    if (!size) return new Response(buf, { status: 200, headers });
    let start, end;
    if (m[1] === '') { start = Math.max(0, size - Number(m[2])); end = size - 1; }
    else { start = Number(m[1]); end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1); }
    if (start >= size || start > end) {
      if (!buf && res.body) res.body.cancel();
      headers.set('Content-Range', `bytes */${size}`); headers.delete('Content-Length');
      return new Response(null, { status: 416, headers });
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    if (request.method === 'HEAD') { if (!buf && res.body) res.body.cancel(); return new Response(null, { status: 206, headers }); }
    if (buf) return new Response(buf.subarray(start, end + 1), { status: 206, headers });
    // Stream only the requested slice.
    let pos = 0;
    const reader = res.body.getReader();
    const stream = new ReadableStream({
      async pull(ctrl) {
        while (true) {
          const { done, value } = await reader.read();
          if (done || pos > end) { reader.cancel().catch(() => {}); ctrl.close(); return; }
          const cs = pos, ce = pos + value.length - 1; pos += value.length;
          if (ce < start) continue;
          ctrl.enqueue(value.subarray(Math.max(0, start - cs), Math.min(value.length, end - cs + 1)));
          if (pos > end) { reader.cancel().catch(() => {}); ctrl.close(); }
          return;
        }
      },
      cancel() { reader.cancel().catch(() => {}); },
    });
    return new Response(stream, { status: 206, headers });
  },
};
