const CACHE_NAME = 'virol-v6';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/script.js',
  './manifest.json',
  './virol_logo.png',
  './img/victor.jpg.png'
];

// Instalar y almacenar en caché recursos estáticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia Network-First para evitar archivos obsoletos
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 1. Ignorar llamadas a la API (dejar que vayan directo a la red)
  if (url.pathname.includes('/api/')) {
    return;
  }

  // 2. Para archivos estáticos, intentar red primero, si falla usar caché
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Si la respuesta es válida, actualizamos la caché
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si no hay red, servimos desde la caché
        return caches.match(e.request);
      })
  );
});

