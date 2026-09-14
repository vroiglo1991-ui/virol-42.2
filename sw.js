const CACHE_NAME = 'virol-42k-v35';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/constants.js',
  './js/state.js',
  './js/sync.js',
  './js/alarms.js',
  './js/cards.js',
  './js/running.js',
  './js/strava.js',
  './js/ui.js',
  './js/ai-nutrition.js',
  './js/chat.js',
  './js/app.js',
  './manifest.json',
  './img/victor.png',
  './img/virol_logo.png',
  './img/valence_fit.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Do not intercept or cache /api/ endpoints, cloud sync, or external APIs
  if (event.request.url.includes('/api/') || event.request.url.includes('strava.com') || event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // Network first with cache update, fallback to cache for offline support
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// PUSH NOTIFICATIONS EVENT LISTENER (iOS 16.4+ standalone PWA, Android & Desktop)
self.addEventListener('push', event => {
  const handlePush = async () => {
    let alertData = {
      title: 'VIROL // VALENCIA 42K PRO',
      body: '¡Recordatorio de entrenamiento!',
      icon: './img/virol_logo.png',
      badge: './img/virol_logo.png',
      tag: 'virol-alert',
      url: './index.html'
    };

    if (event.data) {
      try {
        const parsed = event.data.json();
        alertData = Object.assign(alertData, parsed);
      } catch (e) {
        alertData.body = event.data.text() || alertData.body;
      }
    } else {
      // Si el push llega sin payload, consultar última alerta pendiente al Worker
      try {
        const res = await fetch('./api/push/pending', { cache: 'no-store' });
        if (res.ok) {
          const pending = await res.json();
          if (pending && pending.title) {
            alertData.title = pending.title;
            alertData.body = pending.body || alertData.body;
            if (pending.tag) alertData.tag = pending.tag;
            if (pending.url) alertData.url = pending.url;
          }
        }
      } catch (_) {}
    }

    const options = {
      body: alertData.body,
      icon: alertData.icon || './img/virol_logo.png',
      badge: alertData.badge || './img/virol_logo.png',
      vibrate: [250, 100, 250],
      tag: alertData.tag || 'virol-alert',
      renotify: true,
      data: {
        url: alertData.url || './index.html'
      }
    };

    return self.registration.showNotification(alertData.title, options);
  };

  event.waitUntil(handlePush());
});

// FOCUS OR OPEN APP ON NOTIFICATION CLICK
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
