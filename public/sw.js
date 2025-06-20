const CACHE_NAME = 'solutions-avalance-resources-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/theme-styles.css',
  '/assets/css/custom-styles.css',
  '/assets/css/loading-spinner.css',
  '/assets/css/header-nav.css',
  '/assets/css/about-section.css',
  '/assets/css/clients.css',
  '/assets/css/modal-styles.css',
  '/assets/js/contact.js',
  '/assets/images/favicon.ico',
  '/site.webmanifest',
  '/assets/images/pwa-icon-192.png',
  '/assets/images/pwa-icon-512.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);

  // Handle font requests
  if (request.headers.get('accept')?.includes('font')) {
      event.respondWith(
          fetch(request).catch(() => {
              // Fallback to cached font if available
              return caches.match(request);
          })
      );
      return;
  }

  // Only cache requests from our origin
  if (url.origin === self.location.origin) {
      event.respondWith(
          caches.match(request).then(function(response) {
              if (response) {
                  return response;
              }
              
              return fetch(request).then(function(response) {
                  if (!response || response.status !== 200) {
                      return response;
                  }

                  // Clone the response to store in cache
                  const responseToCache = response.clone();
                  caches.open(CACHE_NAME).then(function(cache) {
                      cache.put(request, responseToCache);
                  });
                  return response;
              });
          })
      );
  } else {
      // For external requests, just fetch them
      event.respondWith(fetch(request));
  }
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('avalance-tech-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
