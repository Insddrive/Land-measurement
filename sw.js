const CACHE_NAME = 'land-calc-v1';
const ASSETS_TO_CACHE = [
 './',
 './index.html',
 './manifest.json',
 './icon-192.png',
 './icon-512.png'
];

// Install Event - Cache Files
self.addEventListener('install', (event) => {
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
});

// Fetch Event - Serve from Cache (Offline Support)
self.addEventListener('fetch', (event) => {
 event.respondWith(
   caches.match(event.request).then((cachedResponse) => {
     return cachedResponse || fetch(event.request);
   })
 );
});