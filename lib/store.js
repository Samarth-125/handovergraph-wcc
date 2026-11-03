// Tiny key-value store. Uses Upstash/Vercel KV when its env vars exist,
// otherwise a Map in memory so local development works with zero setup.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const memory = (globalThis.__handoverMemory ??= new Map());

async function run(command) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
  });
  return (await res.json()).result;
}

const WEEK = 60 * 60 * 24 * 7;

export async function save(key, value) {
  if (url) await run(['SET', key, JSON.stringify(value), 'EX', WEEK]);
  else memory.set(key, value);
}

export async function load(key) {
  if (!url) return memory.get(key) ?? null;
  const raw = await run(['GET', key]);
  return raw ? JSON.parse(raw) : null;
}

export const newId = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12);
