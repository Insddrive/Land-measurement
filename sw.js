const CACHE_NAME = 'land-calc-v7'; // Version 7

const REQUIRED_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

const OPTIONAL_ASSETS = [
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // ਜ਼ਰੂਰੀ ਫਾਈਲਾਂ ਕੈਸ਼ ਕਰੋ
      await cache.addAll(REQUIRED_ASSETS);
      // ਆਪਸ਼ਨਲ ਫਾਈਲਾਂ (ਜੇ ਹੋਣ)
      try { await cache.addAll(OPTIONAL_ASSETS); } catch (e) {}
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Cache First Strategy (ਸਭ ਤੋਂ ਤੇਜ਼)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ਜੇ ਕੈਸ਼ ਵਿੱਚ ਹੈ, ਤਾਂ ਉੱਥੋਂ ਚਲਾਓ (ਕੋਈ ਇੰਤਜ਼ਾਰ ਨਹੀਂ)
      if (cachedResponse) {
        return cachedResponse;
      }
      // ਨਹੀਂ ਤਾਂ ਨੈੱਟਵਰਕ ਤੋਂ ਲਿਆਓ
      return fetch(event.request);
    })
  );
});
