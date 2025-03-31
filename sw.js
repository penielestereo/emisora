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

  // Hacer que el nuevo SW se active de inmediato
  self.skipWaiting();

  // Esperar a que se cacheen los archivos necesarios
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

  // Tomar el control inmediato de la página
  self.clients.claim();

  // Eliminar cachés antiguas si el nombre del caché ha cambiado
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

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request)) // Si la red falla, usa la caché
  );
});

// Agregar Firebase Messaging para manejar las notificaciones push

// Importa Firebase y los módulos necesarios para manejar las notificaciones
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js');

// Configura Firebase con tus credenciales
firebase.initializeApp({
  apiKey: "AIzaSyC2KTmkA-1znWUJxAociE0SygIsI-ZeeXg",
  authDomain: "notificacionespeniel.firebaseapp.com",
  projectId: "notificacionespeniel",
  storageBucket: "notificacionespeniel.firebasestorage.app",
  messagingSenderId: "634476182377",
  appId: "1:634476182377:web:ef93780f0cfbf866451bf8",
  measurementId: "G-L8Q4FJNGM7"
});

// Inicializa Firebase Messaging
const messaging = firebase.messaging();

// Maneja las notificaciones cuando la aplicación está en segundo plano
messaging.onBackgroundMessage(function(payload) {
  console.log('Mensaje recibido en segundo plano', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || 'assets/img/logo.png', // Puedes cambiar el icono si lo deseas
  };

  // Muestra la notificación
  self.registration.showNotification(notificationTitle, notificationOptions);
});

