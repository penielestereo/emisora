// Nombre del caché
const CACHE_NAME = "peniel-cache-v4"; // Cambia la versión si actualizas archivos

// Archivos a cachear (sin archivos externos ni favicon.ico)
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("Intentando cachear archivos...");
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
          console.log(`✅ Cacheado correctamente: ${url}`);
        } catch (error) {
          console.warn(`⚠️ No se pudo cachear: ${url}`, error);
        }
      }
    })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activado");
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Eliminando caché antigua:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Intercepción de solicitudes de red
self.addEventListener("fetch", (event) => {
  const requestUrl = event.request.url;

  // Evitar errores con extensiones de Chrome
  if (requestUrl.startsWith("chrome-extension://")) {
    return;
  }

  console.log("Service Worker: Fetch", requestUrl);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => caches.match("/")) // Si la red falla, usa la página de inicio
      );
    })
  );
});

// Integración de Firebase Cloud Messaging
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js");

firebase.initializeApp({
   apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",  
  authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
  projectId: "notificacionespeniel-29ab3",
  storageBucket: "notificacionespeniel-29ab3.firebasestorage.app",
  messagingSenderId: "145535352146", 
  appId: "1:145535352146:web:5d08044df2a0c2e1594e8b",
});

const messaging = firebase.messaging();

// Manejo de notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("Mensaje en segundo plano:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/assets/icons/icon.png",
  });
});
