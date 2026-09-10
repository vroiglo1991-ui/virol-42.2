const CACHE_NAME = 'virol-42k-v28';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/constants.js',
  './js/state.js',
  './js/sync.js',
  './js/alarms.js',
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
  // Do not intercept or cache /api/ endpoints, cloud sync, or external services
  if (event.request.url.includes('/api/') || event.request.url.includes('extendsclass.com') || event.request.url.includes('strava.com')) {
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

// PUSH NOTIFICATIONS EVENT LISTENER (iOS 16.4+ standalone PWA & Android)
self.addEventListener('push', event => {
  let data = {
    title: 'VIROL 42K PRO',
    body: '¡Notificación de entrenamiento!',
    icon: './img/virol_logo.png',
    badge: './img/virol_logo.png',
    tag: 'virol-alert',
    url: './index.html'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = Object.assign(data, parsed);
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || './img/virol_logo.png',
    badge: data.badge || './img/virol_logo.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'virol-alert',
    renotify: true,
    data: {
      url: data.url || './index.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
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
