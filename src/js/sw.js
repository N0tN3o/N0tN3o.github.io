// Service Worker for Portfolio PWA - Enhanced Caching
const CACHE_NAME = 'portfolio-v1.2';
const STATIC_CACHE = 'static-v1.2';
const DYNAMIC_CACHE = 'dynamic-v1.2';

// Static assets to cache immediately
const staticAssets = [
  '/',
  '/index2.html',
  '/src/css/styles-base.css',
  '/src/css/styles-desktop.css',
  '/src/css/styles-mobile.css',
  '/src/js/script.js',
  '/manifest.webmanifest',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
];

// Cache limits
const CACHE_SIZE_LIMIT = 50;

// Utility function to limit cache size
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(staticAssets);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Cache First with Network Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Handle static assets
  if (staticAssets.includes(new URL(request.url).pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((response) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }
  
  // Handle other requests with Network First strategy
  event.respondWith(
    fetch(request).then((response) => {
      return caches.open(DYNAMIC_CACHE).then((cache) => {
        // Cache successful responses
        if (response.status === 200) {
          cache.put(request, response.clone());
          limitCacheSize(DYNAMIC_CACHE, CACHE_SIZE_LIMIT);
        }
        return response;
      });
    }).catch(() => {
      // Fallback to cache if network fails
      return caches.match(request).then((cachedResponse) => {
        return cachedResponse || new Response('Offline - Content not available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// Handle background sync and push notifications (future enhancements)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
});

self.addEventListener('push', (event) => {
  console.log('Push message received:', event);
});