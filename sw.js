// ==============================================
// Service Worker - Caching & Offline Fallback
// Network-first strategy
// ==============================================

const CACHE_VERSION = '2.2';
const CACHE_NAME = `site-v${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './src/css/styles-base.css',
    './src/css/styles-desktop.css',
    './src/css/styles-mobile.css',
    './src/js/script.js',
    './images/icons.svg',
    './offline.html'
];

self.addEventListener('install', (event) => {
    console.log('[SW] Installing v' + CACHE_VERSION);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return Promise.allSettled(
                    PRECACHE_ASSETS.map(asset =>
                        cache.add(asset).catch(err =>
                            console.warn(`[SW] Failed to pre-cache: ${asset}`, err)
                        )
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating v' + CACHE_VERSION);
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] Removing old cache:', key);
                        return caches.delete(key);
                    })
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;
    if (!request.url.startsWith('http')) return;

    event.respondWith(
        fetch(request)
            .then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => {
                return caches.match(request).then(cached => {
                    if (cached) return cached;
                    const accept = request.headers.get('Accept') || '';
                    if (accept.includes('text/html')) {
                        return caches.match('./offline.html');
                    }
                });
            })
    );
});