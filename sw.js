importScripts('./lessons.js');

const prefix = 'nederlands-met-reza-';
const cacheName = prefix + 'v1';
const shell = [
  './', './index.html', './style.css', './app.js', './lessons.js', './app.webmanifest',
  './assets/tulip.svg', './assets/canal.svg', './assets/cafe-reference.png',
  './assets/icon-192.png', './assets/icon-512.png',
  './assets/noto-arabic-Regular.woff', './assets/noto-arabic-Bold.woff',
];

const audio = lessons.flatMap((lesson, day) => lesson.questions.flatMap((_, question) =>
  ['q', 'a'].map((kind) => './assets/audio/' + (day + 1) + '-' + (question + 1) + '-' + kind + '.mp3')
));

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll([...shell, ...audio])));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith(prefix) && key !== cacheName)
    .map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  if (request.headers.has('range')) {
    event.respondWith((async () => {
      const cached = await (await caches.open(cacheName)).match(request.url);
      if (!cached) return fetch(request);
      const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.get('range'));
      if (!range) return fetch(request);
      const blob = await cached.blob();
      const start = Number(range[1]);
      const end = range[2] ? Math.min(Number(range[2]), blob.size - 1) : blob.size - 1;
      if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + blob.size } });
      return new Response(blob.slice(start, end + 1, blob.type), {
        status: 206,
        headers: {
          'Accept-Ranges': 'bytes',
          'Content-Type': blob.type,
          'Content-Length': String(end - start + 1),
          'Content-Range': 'bytes ' + start + '-' + end + '/' + blob.size,
        },
      });
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      if (request.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});
