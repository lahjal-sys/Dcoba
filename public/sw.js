const CACHE_NAME = 'genzee-v1';
const urlsToCache = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Cache-first untuk assets, network-first untuk API
  if (event.request.url.includes('pollinations.ai')) {
    event.respondWith(fetch(event.request));
  } else {
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
  }
});
