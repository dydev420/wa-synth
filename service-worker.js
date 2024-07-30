const staticCacheName = 'site-static-v0.2.1-pwa';
const dynamicCacheName = 'site-dynamic-v0.2.1-pwa';
const assets = [
  '/',
  '/index.html',
  '/assets/app.js',
  '/assets/app.css',
  '/manifest.json',
  '/synth.svg',
  '/synth-square-icons/manifest-icon-192.maskable.png',
  '/synth-square-icons/manifest-icon-512.maskable.png',
];

// install event
self.addEventListener('install', (evt) => {
  console.log('SW:: install event');
  evt.waitUntil(
    caches.open(staticCacheName)
      .then((cache) => {
        cache.addAll(assets);
      })
  )
});

// activate event
self.addEventListener('activate', (evt) => {
  console.log('SW:: activate event');
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', (evt) => {
  // Request Intercept
  evt.respondWith(
    caches.match(evt.request)
      .then((cacheRes) => {
        return cacheRes || fetch(evt.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((cache) => {
             cache.put(evt.request.url, fetchRes.clone());
             return fetchRes;
          })
        });
      })
  );
});