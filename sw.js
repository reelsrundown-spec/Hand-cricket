const CACHE_NAME = 'hand-cricket-pro-v1';
const assets = [
  './',
  './index.html',
  './home.html',
  './toss.html',
  './game.html',
  './style.css',
  './script.js',
  './assets/1.png',
  './assets/2.png',
  './assets/3.png',
  './assets/4.png',
  './assets/5.png',
  './assets/6.png',
  './music/sounds/handcricket.mp3'
];

// ഫയലുകൾ ഇൻസ്റ്റാൾ ചെയ്യുമ്പോൾ ക്യാഷ് (Cache) ചെയ്യുന്നു
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

// നെറ്റ് ഇല്ലാത്തപ്പോൾ ഫോണിലെ ഫയലുകൾ ഉപയോഗിക്കുന്നു
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
