// Nombre del caché
const CACHE_NAME = "peniel-cache-v1";

// Archivos a cachear
const urlsToCache = [
  "/",
  "assets/css/style.css",
  "assets/js/script.js",
  "assets/img/logo.png",
  "assets/img/central.png",
  "assets/img/play.png",
  "assets/img/pause.png",
  "assets/img/menu.png",
  "assets/img/close.png",
  "assets/img/facebook.png",
  "assets/img/instagram.png",
  "assets/img/youtube.png",
  "assets/img/whatsapp.png",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando...");

  // Esperar a que se cacheen los archivos necesarios
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Archivos cacheados correctamente");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activado");

  // Eliminar cachés antiguas si el nombre del caché ha cambiado
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Eliminando caché antigua");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepción de solicitudes de red
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetch", event.request.url);

  // Responder desde el caché si es posible, o realizar la solicitud en red
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            // Cachear las nuevas solicitudes dinámicas (opcional)
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
