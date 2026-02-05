// ==============================================
// Service Worker for Portfolio PWA
// Version 2.0 - Improved Caching & Error Handling
// ==============================================

const CACHE_VERSION = '2.0';
const STATIC_CACHE = `static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${CACHE_VERSION}`;

// Static assets to cache immediately
// Using relative paths that match actual requests
const STATIC_ASSETS = [
    './',
    './index.html',
    './src/css/styles-base.css',
    './src/css/styles-desktop.css',
    './src/css/styles-mobile.css',
    './src/js/script.js',
    './offline.html'
];

// Cache configuration
const CACHE_CONFIG = {
    maxDynamicCacheSize: 50,
    maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
};

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

/**
 * Limits cache size by removing oldest entries
 * @param {string} cacheName - Name of the cache to limit
 * @param {number} maxSize - Maximum number of entries
 */
async function limitCacheSize(cacheName, maxSize) {
    try {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        if (keys.length > maxSize) {
            // Delete oldest entry and recurse
            await cache.delete(keys[0]);
            await limitCacheSize(cacheName, maxSize);
        }
    } catch (error) {
        console.error('Error limiting cache size:', error);
    }
}

/**
 * Checks if a request is for a static asset
 * @param {Request} request - The fetch request
 * @returns {boolean}
 */
function isStaticAsset(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Check if it's one of our static assets
    return STATIC_ASSETS.some(asset => {
        // Handle both relative and absolute paths
        const assetPath = asset.replace('./', '/').replace(/\/$/, '') || '/';
        return pathname === assetPath || pathname.endsWith(asset.replace('./', '/'));
    });
}

/**
 * Checks if request is for an HTML page
 * @param {Request} request - The fetch request
 * @returns {boolean}
 */
function isHtmlRequest(request) {
    const acceptHeader = request.headers.get('Accept') || '';
    return acceptHeader.includes('text/html');
}

// ==============================================
// INSTALL EVENT
// ==============================================

self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker v' + CACHE_VERSION);
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                // Use addAll but handle failures gracefully
                return Promise.allSettled(
                    STATIC_ASSETS.map(asset => 
                        cache.add(asset).catch(err => {
                            console.warn(`[SW] Failed to cache: ${asset}`, err);
                        })
                    )
                );
            })
            .then(() => {
                console.log('[SW] Static assets cached');
            })
    );
    
    // Activate immediately without waiting for old SW to finish
    self.skipWaiting();
});

// ==============================================
// ACTIVATE EVENT
// ==============================================

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker v' + CACHE_VERSION);
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old versioned caches
                            return cacheName !== STATIC_CACHE && 
                                   cacheName !== DYNAMIC_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Old caches cleared');
            })
    );
    
    // Take control of all pages immediately
    self.clients.claim();
});

// ==============================================
// FETCH EVENT
// ==============================================

self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Strategy: Static assets use Cache First
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Strategy: HTML pages use Network First with offline fallback
    if (isHtmlRequest(request)) {
        event.respondWith(networkFirstWithOfflineFallback(request));
        return;
    }
    
    // Strategy: Everything else uses Network First
    event.respondWith(networkFirst(request));
});

// ==============================================
// FETCH STRATEGIES
// ==============================================

/**
 * Cache First Strategy
 * Try cache, fallback to network, update cache
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache first failed:', error);
        return new Response('Resource unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Network First Strategy
 * Try network, fallback to cache
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            
            // Limit dynamic cache size (fire and forget)
            limitCacheSize(DYNAMIC_CACHE, CACHE_CONFIG.maxDynamicCacheSize);
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Nothing in cache either
        return new Response('Content not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Network First with Offline HTML Fallback
 * For HTML pages - shows offline page if both network and cache fail
 */
async function networkFirstWithOfflineFallback(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful HTML responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        const offlinePage = await caches.match('./offline.html');
        
        if (offlinePage) {
            return offlinePage;
        }
        
        // Last resort - plain text response
        return new Response(
            '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your connection and try again.</p></body></html>',
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/html' }
            }
        );
    }
}

// ==============================================
// BACKGROUND SYNC (Future Enhancement)
// ==============================================

self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    // Handle different sync tags
    if (event.tag === 'sync-data') {
        // Implement sync logic here
    }
});

// ==============================================
// PUSH NOTIFICATIONS
// Removed - Not implemented for this portfolio.
// To add push notifications in the future, you would need:
// 1. A server to send push messages
// 2. Request permission via user gesture (button click)
// 3. Subscribe to push service and send subscription to server
// ==============================================

// ==============================================
// MESSAGE HANDLING
// ==============================================

self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(names => 
                Promise.all(names.map(name => caches.delete(name)))
            )
        );
    }
});