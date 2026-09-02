const CACHE_NAME = 'saill-v1-cache';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css'
];

// Install event - cache core static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SAILL SW] Pre-caching offline essentials');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SAILL SW] Pre-cache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SAILL SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Stale-While-Revalidate with network fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests or external APIs
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Exclude chrome-extension or dynamic API paths if any
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Return cached or offline fallback if available
          return cachedResponse || caches.match('/index.html');
        });

      return cachedResponse || fetchPromise;
    })
  );
});
