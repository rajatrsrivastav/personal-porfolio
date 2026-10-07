import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';
import { createLinkMetadataService, extractMetadata, isPublicAddress, parsePublicUrl, readHtmlPage, resolvePublicTarget } from '../lib/link-metadata.js';

const publicLookup = async () => [{ address: '93.184.215.14', family: 4 }];
const html = '<html><head><title>Fallback</title><meta property="og:title" content="OpenKruise &amp; Rollouts"><meta property="og:description" content="Progressive delivery for Kubernetes."><meta property="og:image" content="/cover.png"></head></html>';
const makeService = options => createLinkMetadataService({ lookup: publicLookup, requestPage: async () => ({ html }), ...options });

test('blocks private, loopback, link-local, reserved and IPv6 transition ranges', () => {
  assert.equal(isPublicAddress('168.63.129.16'), false);
  for (const ip of ['0.0.0.0', '10.0.0.1', '127.0.0.1', '169.254.169.254', '172.16.0.1', '192.168.1.1', '100.100.100.200', '192.0.0.1', '192.0.2.1', '198.18.0.1', '198.51.100.1', '203.0.113.1', '224.0.0.1', '255.255.255.255', '::', '::1', 'fc00::1', 'fe80::1', 'ff02::1', '2001:db8::1', '2002:7f00:1::', '2001::1', '64:ff9b::7f00:1', '::ffff:127.0.0.1', 'not-an-ip']) {
    assert.equal(isPublicAddress(ip), false, ip);
  }
  for (const ip of ['8.8.8.8', '93.184.215.14', '2606:4700:4700::1111', '2001:4860:4860::8888']) {
    assert.equal(isPublicAddress(ip), true, ip);
  }
});

test('URL normalization rejects credentials, odd ports, internal names and obfuscated IPs', () => {
  for (const url of ['file:///etc/passwd', 'ftp://example.com', 'https://user:pass@example.com', 'http://example.com:8080', 'http://localhost.', 'http://a.local', 'http://service.internal', 'http://a.svc.cluster.local', 'http://intranet', 'http://127.1', 'http://2130706433', 'http://0x7f000001', 'http://[::1]', 'http://[::ffff:127.0.0.1]', `https://example.com/${'a'.repeat(2048)}`]) {
    assert.throws(() => parsePublicUrl(url), undefined, url);
  }
  assert.equal(parsePublicUrl('https://example.com/path#section').href, 'https://example.com/path');
});

test('mixed DNS answers are blocked before any HTTP request', async () => {
  let requests = 0;
  const service = makeService({
    lookup: async () => [{ address: '93.184.215.14', family: 4 }, { address: '10.0.0.1', family: 4 }],
    requestPage: async () => { requests++; return { html }; },
  });
  assert.equal(await service('https://example.com/'), null);
  assert.equal(requests, 0);
});

test('DNS aliases resolving to internal targets are blocked', async () => {
  for (const address of ['127.0.0.1', '169.254.169.254', '::ffff:127.0.0.1', 'fe80::1']) {
    const service = makeService({ lookup: async () => [{ address, family: address.includes(':') ? 6 : 4 }] });
    assert.equal(await service('https://looks-public.example/'), null);
  }
});

test('every redirect is validated and private redirects are never requested', async () => {
  const requested = [];
  const service = makeService({ requestPage: async url => {
    requested.push(url.href);
    return { location: 'http://169.254.169.254/latest/meta-data/' };
  } });
  assert.equal(await service('https://example.com/'), null);
  assert.deepEqual(requested, ['https://example.com/']);
  const dnsRedirect = makeService({
    lookup: async hostname => [{ address: hostname === 'evil.example' ? '127.0.0.1' : '93.184.215.14', family: 4 }],
    requestPage: async () => ({ location: 'https://evil.example/' }),
  });
  assert.equal(await dnsRedirect('https://example.com/'), null);
});

test('public relative redirects resolve metadata and image URLs against the final page', async () => {
  const service = makeService({ requestPage: async url => url.pathname === '/' ? { location: '/docs/' } : { html } });
  const result = await service('https://example.com/');
  assert.equal(result.title, 'OpenKruise & Rollouts');
  assert.equal(result.image, 'https://example.com/cover.png');
  assert.equal(result.hostname, 'example.com');
  assert.equal(result.url, 'https://example.com/');
});

test('redirect loops stop after a bounded number of requests', async () => {
  let requests = 0;
  const service = makeService({ requestPage: async () => { requests++; return { location: '/again' }; } });
  assert.equal(await service('https://example.com/'), null);
  assert.equal(requests, 4);
});

test('cache deduplicates in-flight requests and expires positive and negative results', async () => {
  let requests = 0;
  let time = 0;
  const service = makeService({ now: () => time, successTtl: 100, failureTtl: 20, requestPage: async url => {
    requests++;
    return { html: url.pathname === '/missing' ? '<html></html>' : html };
  } });
  const [first, second] = await Promise.all([service('https://example.com/'), service('https://example.com/#section')]);
  assert.deepEqual(first, second);
  assert.equal(requests, 1);
  await service('https://example.com/');
  assert.equal(requests, 1);
  time = 101;
  await service('https://example.com/');
  assert.equal(requests, 2);
  await service('https://example.com/missing');
  await service('https://example.com/missing');
  assert.equal(requests, 3);
  time = 122;
  await service('https://example.com/missing');
  assert.equal(requests, 4);
});

test('cache is bounded and evicts older entries', async () => {
  let requests = 0;
  const service = makeService({ maxEntries: 2, requestPage: async () => { requests++; return { html }; } });
  for (const path of ['/a', '/b', '/c', '/a']) await service(`https://example.com${path}`);
  assert.equal(requests, 4);
});

test('overall timeout covers stalled DNS and HTTP; concurrency is bounded', async () => {
  const never = () => new Promise(() => {});
  const dnsService = makeService({ lookup: never, timeoutMs: 30 });
  const requestService = makeService({ requestPage: never, timeoutMs: 30, maxConcurrent: 1 });
  const pending = requestService('https://example.com/');
  assert.equal(await requestService('https://other.example/'), null);
  assert.equal(await dnsService('https://example.com/'), null);
  assert.equal(await pending, null);
});

test('metadata extraction decodes entities, prefers OG and limits text lengths', () => {
  const result = extractMetadata(html, 'https://example.com/');
  assert.equal(result.title, 'OpenKruise & Rollouts');
  assert.equal(result.description, 'Progressive delivery for Kubernetes.');
  assert.equal(extractMetadata('<title>Plain &amp; useful</title><meta name="description" content="Normal description">', 'https://example.com/').title, 'Plain & useful');
  const large = extractMetadata(`<meta property="og:title" content="${'a'.repeat(500)}"><meta property="og:description" content="${'b'.repeat(1000)}">`, 'https://example.com/');
  assert.equal(large.title.length, 200);
  assert.equal(large.description.length, 300);
  assert.equal(extractMetadata('<html><body>No title</body></html>', 'https://example.com/'), null);
});

test('unsafe and privately resolved OG images are omitted while keeping the card', async () => {
  for (const image of ['http://127.0.0.1/x', 'http://[::1]/x', 'data:image/svg+xml,evil', 'javascript:alert(1)', 'https://private.example/image.png']) {
    const service = makeService({
      lookup: async hostname => [{ address: hostname === 'private.example' ? '10.0.0.1' : '93.184.215.14', family: 4 }],
      requestPage: async () => ({ html: `<title>Safe title</title><meta property="og:image" content="${image}">` }),
    });
    const result = await service('https://example.com/');
    assert.equal(result.title, 'Safe title');
    assert.equal(result.image, null, image);
  }
});

function mockTransport({ statusCode = 200, headers = { 'content-type': 'text/html' }, chunks = [Buffer.from(html)] } = {}) {
  let options;
  const request = (_url, config, onResponse) => {
    options = config;
    const req = new EventEmitter();
    req.destroy = () => {};
    req.end = () => queueMicrotask(() => {
      const response = Readable.from(chunks);
      response.statusCode = statusCode;
      response.headers = headers;
      onResponse(response);
    });
    return req;
  };
  return { request, options: () => options };
}

const requestOptions = { target: { address: '93.184.215.14', family: 4 }, signal: new AbortController().signal, maxBytes: 512 * 1024 };

test('transport pins the vetted address without a second DNS lookup or shared agent', async () => {
  const transport = mockTransport();
  const result = await readHtmlPage(new URL('https://example.com/'), requestOptions, transport.request);
  assert.equal(result.html, html);
  const options = transport.options();
  assert.equal(options.agent, false);
  assert.equal(options.autoSelectFamily, false);
  options.lookup('example.com', {}, (error, address, family) => {
    assert.equal(error, null);
    assert.equal(address, '93.184.215.14');
    assert.equal(family, 4);
  });
  options.lookup('example.com', { all: true }, (error, addresses) => {
    assert.equal(error, null);
    assert.deepEqual(addresses, [requestOptions.target]);
  });
});

test('transport rejects non-HTML, compressed, oversized and unsuccessful responses', async () => {
  for (const response of [
    { headers: { 'content-type': 'application/json' } },
    { headers: { 'content-type': 'text/html', 'content-encoding': 'gzip' } },
    { headers: { 'content-type': 'text/html', 'content-length': '9999999' } },
    { statusCode: 404 },
    { chunks: [Buffer.alloc(4), Buffer.alloc(8)] },
  ]) {
    const transport = mockTransport(response);
    await assert.rejects(readHtmlPage(new URL('https://example.com/'), { ...requestOptions, maxBytes: 8 }, transport.request));
  }
});

test('transport returns redirects without consuming the response body', async () => {
  const transport = mockTransport({ statusCode: 302, headers: { location: '/next' }, chunks: [Buffer.alloc(9999)] });
  assert.deepEqual(await readHtmlPage(new URL('https://example.com/'), requestOptions, transport.request), { location: '/next' });
});

test('direct public IPs are accepted without DNS while oversized HTML falls back', async () => {
  const target = await resolvePublicTarget(new URL('https://8.8.8.8/'), { lookup: () => { throw new Error('Should not resolve'); }, signal: new AbortController().signal });
  assert.equal(target.address, '8.8.8.8');
  const service = makeService({ maxBytes: 10 });
  assert.equal(await service('https://example.com/'), null);
});
