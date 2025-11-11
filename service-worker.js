const CACHE_NAME = "giulietta-finance-app-v1";
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/js/index.js',
    '/stle.css'
];

// Install event - cache everything
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});