// Nombre del caché
const CACHE_NAME = "peniel-cache-v3"; // Asegúrate de cambiar la versión si actualizas archivos

// Archivos a cachear
const urlsToCache = [
  "/emisora/",
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Archivos cacheados correctamente");
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Error cacheando archivos:", error);
      });
    })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activado");
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Eliminando caché antigua:", cache);
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

  // Ignorar peticiones de extensiones de Chrome
  if (event.request.url.startsWith("chrome-extension://")) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(event.request)
        .then((response) => {
          // Solo cacheamos peticiones GET exitosas (status 200)
          if (response && response.status === 200 && event.request.method === "GET") {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => caches.match(event.request)); // Usa la caché si falla la red
    })
  );
});
