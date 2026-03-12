const CACHE = "t7-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap",
  "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // Per le API esterne (meteo, nominatim) vai sempre in rete
  if (e.request.url.includes("open-meteo.com") ||
      e.request.url.includes("nominatim") ||
      e.request.url.includes("emailjs") ||
      e.request.url.includes("firebasejs")) {
    return; // fetch normale
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
