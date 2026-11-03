const CACHE = 'ivt-toolkit-v2026.11.3.1';
const PRECACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './icon-maskable-512.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll(PRECACHE);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.filter(function(key) {
                return key !== CACHE;
            }).map(function(key) {
                return caches.delete(key);
            }));
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request).then(function(response) {
            if (response && (response.ok || response.type === 'opaque')) {
                const copy = response.clone();
                caches.open(CACHE).then(function(cache) {
                    cache.put(event.request, copy);
                }).catch(function() {});
            }
            return response;
        }).catch(function() {
            return caches.match(event.request);
        })
    );
});
