const CACHE_NAME = "zeedpay-shell-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./pool.html",
  "./pay.html",
  "./manifest.json",
  "./flavocon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then(response => response || (new URL(request.url).pathname.startsWith("/pool/") ? caches.match("./pool.html") : new URL(request.url).pathname.startsWith("/pay/") ? caches.match("./pay.html") : caches.match("./index.html"))))
  );
});