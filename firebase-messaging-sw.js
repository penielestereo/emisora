importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js");

// 🔥 Configuración de Firebase (Debe coincidir con firebase.js)
firebase.initializeApp({
  apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",  // 
  authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
  projectId: "notificacionespeniel-29ab3",
  storageBucket: "notificacionespeniel-29ab3.firebasestorage.app",
  messagingSenderId: "145535352146", 
  appId: "1:145535352146:web:5d08044df2a0c2e1594e8b",});

// Inicializar Firebase Messaging
const messaging = firebase.messaging();

// 📩 Escuchar notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Notificación recibida en segundo plano:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/assets/icons/icon.png",
  });
});
