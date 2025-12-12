// Version change is important here (v1 -> v2)
const CACHE_NAME = 'land-calc-v2'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Event - Cache Files
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // Take control of all clients immediately
});

// Fetch Event - Serve from Cache (Offline Support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If online, update the cache with the fresh version
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If offline, return cached version
        return caches.match(event.request);
      })
  );
});


