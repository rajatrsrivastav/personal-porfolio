import { lookup as dnsLookup } from 'node:dns/promises';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { isIP } from 'node:net';
import ipaddr from 'ipaddr.js';
import { parse } from 'parse5';

const MAX_URL_LENGTH = 2048;
const REDIRECT_CODES = new Set([301, 302, 303, 307, 308]);
const INTERNAL_HOST = /(?:^|\.)(?:localhost|local|localdomain|internal|intranet|home|lan|test|invalid|onion)$/i;
const GLOBAL_IPV6 = ipaddr.parseCIDR('2000::/3');
const SPECIAL_IPV6 = ipaddr.parseCIDR('2001::/23');

export function isPublicAddress(address) {
  try {
    const ip = ipaddr.parse(address);
    // Azure's host services address is routable-looking but internal to VMs.
    if (address === '168.63.129.16') return false;
    if (ip.range() !== 'unicast') return false;
    return ip.kind() === 'ipv4' || (ip.match(GLOBAL_IPV6) && !ip.match(SPECIAL_IPV6));
  } catch { return false; }
}

export function parsePublicUrl(value) {
  if (typeof value !== 'string' || value.length > MAX_URL_LENGTH) throw new Error('Invalid URL');
  const url = new URL(value);
  const hostname = url.hostname.replace(/^\[|\]$/g, '').replace(/\.$/, '').toLowerCase();
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password
    || (url.port && url.port !== (url.protocol === 'https:' ? '443' : '80'))
    || INTERNAL_HOST.test(hostname) || (!isIP(hostname) && !hostname.includes('.'))
    || (isIP(hostname) && !isPublicAddress(hostname))) throw new Error('Blocked URL');
  url.hash = '';
  return url;
}

function withAbort(promise, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason || new Error('Timed out'));
    if (signal.aborted) { abort(); return; }
    signal.addEventListener('abort', abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

export async function resolvePublicTarget(url, { lookup = dnsLookup, signal }) {
  const hostname = url.hostname.replace(/^\[|\]$/g, '').replace(/\.$/, '');
  const family = isIP(hostname);
  const addresses = family ? [{ address: hostname, family }]
    : await withAbort(lookup(hostname, { all: true, verbatim: true }), signal);
  // Reject mixed public/private answers as well as entirely private results.
  if (signal.aborted || !addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new Error('Blocked address');
  }
  return addresses.find(address => address.family === 4) || addresses[0];
}

export function readHtmlPage(url, { target, signal, maxBytes }, request = url.protocol === 'https:' ? httpsRequest : httpRequest) {
  return new Promise((resolve, reject) => {
    const req = request(url, {
      signal,
      agent: false,
      family: target.family,
      autoSelectFamily: false,
      // Pin DNS to the vetted address; preserve the original Host and TLS hostname.
      lookup(_hostname, options, callback) {
        if (options.all) callback(null, [target]);
        else callback(null, target.address, target.family);
      },
      headers: {
        'User-Agent': 'PortfolioLinkPreview/1.0',
        Accept: 'text/html, application/xhtml+xml',
        'Accept-Encoding': 'identity',
      },
    }, response => {
      const fail = error => { response.destroy(); req.destroy(); reject(error); };
      response.on('error', reject);
      if (REDIRECT_CODES.has(response.statusCode)) {
        const location = response.headers.location;
        response.destroy();
        resolve({ location });
        return;
      }
      const mime = String(response.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      const encoding = response.headers['content-encoding'];
      if (response.statusCode !== 200 || !['text/html', 'application/xhtml+xml'].includes(mime)
        || (encoding && encoding !== 'identity') || Number(response.headers['content-length']) > maxBytes) {
        fail(new Error('Unsupported or oversized response'));
        return;
      }
      let size = 0;
      const chunks = [];
      response.on('data', chunk => {
        size += chunk.length;
        if (size > maxBytes) { fail(new Error('Response too large')); return; }
        chunks.push(chunk);
      });
      response.on('end', () => resolve({ html: Buffer.concat(chunks).toString('utf8') }));
      response.on('aborted', () => reject(new Error('Incomplete response')));
    });
    req.on('error', reject);
    req.end();
  });
}

const cleanText = (text, limit) => String(text || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit);

export function extractMetadata(html, pageUrl) {
  const document = parse(html);
  const head = document.childNodes.find(node => node.tagName === 'html')?.childNodes.find(node => node.tagName === 'head');
  const fields = Object.create(null);
  let title = '';
  for (const node of head?.childNodes || []) {
    if (node.tagName === 'title') title = node.childNodes.map(child => child.value || '').join('');
    if (node.tagName !== 'meta') continue;
    const attrs = Object.fromEntries(node.attrs.map(attr => [attr.name, attr.value]));
    const name = (attrs.property || attrs.name || '').toLowerCase();
    if (attrs.content && !fields[name]) fields[name] = attrs.content;
  }
  const metadata = {
    title: cleanText(fields['og:title'] || fields['twitter:title'] || title, 200),
    description: cleanText(fields['og:description'] || fields['twitter:description'] || fields.description, 300),
    image: null,
  };
  const image = fields['og:image:secure_url'] || fields['og:image'] || fields['twitter:image'];
  if (image) {
    try { metadata.image = parsePublicUrl(new URL(image, pageUrl).href).href; } catch { /* Omit unsafe images. */ }
  }
  return metadata.title ? metadata : null;
}

export function createLinkMetadataService({
  lookup = dnsLookup,
  requestPage = readHtmlPage,
  now = Date.now,
  timeoutMs = 4000,
  maxBytes = 512 * 1024,
  maxEntries = 256,
  maxConcurrent = 8,
  successTtl = 6 * 60 * 60 * 1000,
  failureTtl = 15 * 60 * 1000,
} = {}) {
  const cache = new Map();
  const pending = new Map();

  async function fetchMetadata(original) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error('Metadata timeout')), timeoutMs);
    const { signal } = controller;
    try {
      let url = original;
      for (let redirects = 0; redirects <= 3; redirects++) {
        const target = await resolvePublicTarget(url, { lookup, signal });
        const page = await withAbort(requestPage(url, { target, signal, maxBytes }), signal);
        if (page.location) {
          url = parsePublicUrl(new URL(page.location, url).href);
          continue;
        }
        if (typeof page.html !== 'string' || Buffer.byteLength(page.html) > maxBytes) return null;
        const metadata = extractMetadata(page.html, url);
        if (!metadata) return null;
        if (metadata.image) {
          try { await resolvePublicTarget(parsePublicUrl(metadata.image), { lookup, signal }); }
          catch { metadata.image = null; }
        }
        return { ...metadata, hostname: original.hostname, url: original.href };
      }
      return null;
    } catch { return null; }
    finally { clearTimeout(timer); }
  }

  return async function getLinkMetadata(value) {
    let url;
    try { url = parsePublicUrl(value); } catch { return null; }
    const key = url.href;
    const cached = cache.get(key);
    if (cached && cached.expires > now()) return cached.metadata;
    if (pending.has(key)) return pending.get(key);
    if (pending.size >= maxConcurrent) return null;
    const promise = fetchMetadata(url).then(metadata => {
      cache.delete(key);
      cache.set(key, { metadata, expires: now() + (metadata ? successTtl : failureTtl) });
      if (cache.size > maxEntries) cache.delete(cache.keys().next().value);
      return metadata;
    }).finally(() => pending.delete(key));
    pending.set(key, promise);
    return promise;
  };
}

export const getLinkMetadata = createLinkMetadataService();
