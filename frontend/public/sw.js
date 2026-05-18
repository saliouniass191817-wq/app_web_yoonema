self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('yoonema-v1').then((cache) => cache.addAll(['/offline.html']))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Yoonema', {
      body: data.body || 'Nouvelle notification',
      icon: data.icon || '/favicon.ico',
    })
  );
});
