// Offline cache for Portugal 2026
var C = 'pt26-v1';
var FILES = ['./', 'index.html',
  'img/hero.jpg', 'img/day1.jpg', 'img/day2.jpg', 'img/day3.jpg', 'img/day4.jpg', 'img/day5.jpg', 'img/day6.jpg',
  'img/day7.jpg', 'img/day8.jpg', 'img/day9.jpg', 'img/day10.jpg', 'img/day11.jpg', 'img/day12.jpg'];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(FILES); }));
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var isPage = req.mode === 'navigate' || /index\.html$|\/$/.test(new URL(req.url).pathname);
  if (isPage) {
    // network first so updates show; fallback to cache when offline
    e.respondWith(fetch(req).then(function (r) {
      var cp = r.clone(); caches.open(C).then(function (c) { c.put('index.html', cp); }); return r;
    }).catch(function () { return caches.match('index.html'); }));
  } else {
    e.respondWith(caches.match(req).then(function (r) { return r || fetch(req); }));
  }
});
