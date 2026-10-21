/**
 * Parama.lk — Worker for the gallery API. Everything else is served from public/ by the assets binding.
 *
 * Bindings (wrangler.jsonc):  GALLERY_BUCKET (R2), ASSETS, R2_PUBLIC_URL (var)
 * Secrets:                    ADMIN_USERNAME, ADMIN_PASSWORD  →  npx wrangler secret put <NAME>
 *
 * GET    /api/gallery               public list of gallery items
 * POST   /api/admin/login           check username + password
 * PUT    /api/admin/gallery         replace the whole list (used once to import gallery-data.js)
 * POST   /api/admin/upload          multipart: file, title, category, description, featured
 * DELETE /api/admin/images/:id      remove item and its R2 object
 */

const DATA_KEY = 'gallery/gallery.json';
const UPLOAD_PREFIX = 'gallery/uploads/';
const MAX_BYTES = 10 * 1024 * 1024;
const CATEGORIES = ['Exhibitions', 'Company Events'];
const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }
    try {
      return await handleApi(request, env, url);
    } catch (err) {
      console.error(err);
      return json({ error: 'Server error' }, 500);
    }
  },
};

async function handleApi(request, env, url) {
  const { pathname } = url;
  const method = request.method;

  if (pathname === '/api/gallery' && method === 'GET') {
    const items = await readItems(env);
    if (!items) return json({ error: 'Gallery not initialised' }, 404);
    return json({ items }, 200, { 'Cache-Control': 'public, max-age=60' });
  }

  if (!pathname.startsWith('/api/admin/')) return json({ error: 'Not found' }, 404);

  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
    return json({ error: 'ADMIN_USERNAME / ADMIN_PASSWORD secrets are not set' }, 500);
  }
  if (!(await isAuthorised(request, env))) return json({ error: 'Unauthorised' }, 401);

  if (pathname === '/api/admin/login' && method === 'POST') {
    const items = await readItems(env);
    return json({ ok: true, initialised: Boolean(items) });
  }

  if (pathname === '/api/admin/gallery' && method === 'PUT') {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.items)) return json({ error: 'Expected { items: [] }' }, 400);
    const items = body.items.map(sanitiseItem).filter(Boolean);
    await writeItems(env, items);
    return json({ items });
  }

  if (pathname === '/api/admin/upload' && method === 'POST') {
    return upload(request, env);
  }

  const del = pathname.match(/^\/api\/admin\/images\/(\d+)$/);
  if (del && method === 'DELETE') {
    return remove(env, Number(del[1]));
  }

  return json({ error: 'Not found' }, 404);
}

async function upload(request, env) {
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return json({ error: 'No file uploaded' }, 400);

  const ext = IMAGE_TYPES[file.type];
  if (!ext) return json({ error: 'Only JPG, PNG, WebP, GIF or AVIF images are allowed' }, 400);
  if (file.size > MAX_BYTES) return json({ error: 'Image must be 10 MB or smaller' }, 400);

  const items = (await readItems(env)) || [];
  const category = CATEGORIES.includes(form.get('category')) ? form.get('category') : CATEGORIES[0];
  const title = clean(form.get('title'), 120) || 'Gallery photo';
  const key = `${UPLOAD_PREFIX}${Date.now()}-${slug(title)}.${ext}`;

  await env.GALLERY_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
  });

  const item = {
    id: items.reduce((max, it) => Math.max(max, it.id), 0) + 1,
    image: publicUrl(env, key),
    title,
    category,
    description: clean(form.get('description'), 500),
    date: String(new Date().getFullYear()),
    featured: form.get('featured') === 'true',
    alt: clean(form.get('alt'), 200) || `${title} — Parama Group`,
  };

  // Newest first so fresh uploads show at the top of the gallery
  items.unshift(item);
  await writeItems(env, items);
  return json({ item, items }, 201);
}

async function remove(env, id) {
  const items = await readItems(env);
  if (!items) return json({ error: 'Gallery not initialised' }, 404);
  const item = items.find((it) => it.id === id);
  if (!item) return json({ error: 'Image not found' }, 404);

  const remaining = items.filter((it) => it.id !== id);
  await writeItems(env, remaining);

  // Only delete objects that live in our bucket's gallery/ folder
  const key = keyFromUrl(env, item.image);
  if (key && key.startsWith('gallery/') && key !== DATA_KEY) {
    await env.GALLERY_BUCKET.delete(key);
  }
  return json({ items: remaining });
}

/* ---------- storage ---------- */

async function readItems(env) {
  const obj = await env.GALLERY_BUCKET.get(DATA_KEY);
  if (!obj) return null;
  const data = await obj.json();
  return Array.isArray(data) ? data : null;
}

function writeItems(env, items) {
  return env.GALLERY_BUCKET.put(DATA_KEY, JSON.stringify(items, null, 2), {
    httpMetadata: { contentType: 'application/json', cacheControl: 'no-cache' },
  });
}

/* ---------- helpers ---------- */

async function isAuthorised(request, env) {
  // Authorization: Basic base64("username:password")
  const header = request.headers.get('Authorization') || '';
  let given = '';
  try {
    given = header.startsWith('Basic ') ? decodeURIComponent(escape(atob(header.slice(6)))) : '';
  } catch (e) {
    given = '';
  }
  const expected = `${env.ADMIN_USERNAME}:${env.ADMIN_PASSWORD}`;
  // Compare digests so the check takes the same time regardless of where strings differ
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(given)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return given.length > 0 && diff === 0;
}

function sanitiseItem(it) {
  if (!it || typeof it.image !== 'string' || !/^https:\/\//.test(it.image)) return null;
  const title = clean(it.title, 120) || 'Gallery photo';
  return {
    id: Number(it.id) || 0,
    image: it.image,
    title,
    category: CATEGORIES.includes(it.category) ? it.category : CATEGORIES[0],
    description: clean(it.description, 500),
    date: clean(it.date, 20),
    featured: Boolean(it.featured),
    alt: clean(it.alt, 200) || `${title} — Parama Group`,
  };
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'photo';
}

function publicUrl(env, key) {
  return `${env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
}

function keyFromUrl(env, imageUrl) {
  const base = env.R2_PUBLIC_URL.replace(/\/$/, '') + '/';
  return imageUrl.startsWith(base) ? decodeURIComponent(imageUrl.slice(base.length)) : null;
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}
