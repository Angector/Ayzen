const CACHE_VERSION = 'v1';
const CACHE_STATIC  = `pcc-static-${CACHE_VERSION}`;
const CACHE_RUNTIME = `pcc-runtime-${CACHE_VERSION}`;
const CACHE_CDN     = `pcc-cdn-${CACHE_VERSION}`;

const APP_SHELL = [
  '/Ayzen/',
  '/Ayzen/index.html',
  '/Ayzen/offline.html',
  '/Ayzen/manifest.webmanifest',
  '/Ayzen/icons/icon-192.png',
  '/Ayzen/icons/icon-512.png',
  '/Ayzen/icons/icon-maskable-512.png',
  '/Ayzen/src/shared/tokens/primitives.css',
  '/Ayzen/src/shared/tokens/aliases.css',
  '/Ayzen/src/shared/tokens/semantic.css',
  '/Ayzen/src/shared/tokens/themes.css',
  '/Ayzen/src/shared/tokens/typography.css',
  '/Ayzen/src/shared/tokens/motion.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => !k.endsWith(CACHE_VERSION))
          .map((k) => caches.delete(k)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  if (url.origin === self.location.origin && isStaticAsset(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_RUNTIME));
    return;
  }

  if (isPinnedCdn(url)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_CDN));
    return;
  }
});

function isStaticAsset(pathname) {
  return /\.(js|mjs|css|woff2?|ttf|svg|png|jpe?g|webp|avif|json)$/i.test(pathname);
}

function isPinnedCdn(url) {
  return (
    (url.hostname === 'cdn.jsdelivr.net' && /@\d+\.\d+/.test(url.pathname)) ||
    (url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/Ayzen/npm/idb@'))
  );
}

async function networkFirstWithFallback(request) {
  const cache = await caches.open(CACHE_RUNTIME);
  try {
    const response = await withTimeout(fetch(request), 3500);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return caches.match('/Ayzen/offline.html');
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response && (response.status === 200 || response.status === 0)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || (await network) || new Response('', { status: 504 });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}
