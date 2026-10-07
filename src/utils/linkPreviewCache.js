const cache = new Map();
const MAX_ENTRIES = 100;

export function loadLinkPreview(url) {
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) return cached.promise;
  const entry = { expires: Infinity };
  entry.promise = fetch(`/api/link-preview?url=${encodeURIComponent(url)}`, {
    signal: AbortSignal.timeout(6500),
    credentials: 'omit',
  }).then(async response => {
    if (!response.ok) return null;
    const { metadata } = await response.json();
    return metadata?.title ? metadata : null;
  }).catch(() => null).then(metadata => {
    entry.expires = Date.now() + (metadata ? 60 * 60 * 1000 : 60 * 1000);
    return metadata;
  });
  cache.delete(url);
  cache.set(url, entry);
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value);
  return entry.promise;
}
