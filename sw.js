const CACHE_NAME = "zeedpay-shell-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./auth.html",
  "./admin.html",
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

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = event.notification.data?.url || new URL("./index.html#notifications", self.location.origin).href;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(openClients => {
        const existing = openClients.find(client => client.url.startsWith(self.location.origin));
        if (existing) {
          return existing.navigate(target).then(client => client?.focus());
        }
        return clients.openWindow(target);
      })
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then(response => response || (new URL(request.url).pathname.startsWith("/pool/") ? caches.match("./pool.html") : new URL(request.url).pathname.startsWith("/pay/") ? caches.match("./pay.html") : caches.match("./index.html"))))
  );
});