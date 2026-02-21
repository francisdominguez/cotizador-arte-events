const CACHE_NAME = 'arte-events-cache-v1';
const urlsToCache = [
  '/cotizador-arte-events/',
  '/cotizador-arte-events/index.html',
  '/cotizador-arte-events/styles.css',
  '/cotizador-arte-events/script.js',
  '/cotizador-arte-events/manifest.json',
  '/cotizador-arte-events/icon-192.png',
  '/cotizador-arte-events/icon-512.png',
  '/cotizador-arte-events/logo%20arte%20y%20eventos.png'
];

// Instalación: guarda todos los archivos en caché
self.addEventListener('install', event => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos guardados en caché:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: limpia cachés antiguas
self.addEventListener('activate', event => {
  console.log('Service Worker activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta peticiones: sirve desde caché si existe
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Devuelve desde caché
        }
        
        // Si no está en caché, busca en internet
        return fetch(event.request)
          .then(response => {
            // No guardamos en caché respuestas que no son válidas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Opcional: guardar nuevas peticiones en caché
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Fallback opcional para cuando no hay internet
            console.log('Error de conexión para:', event.request.url);
          });
      })
  );
});
