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

const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Notificación en segundo plano:", payload);

  // Evitar que se muestre automáticamente si el payload tiene "notification"
  if (payload.notification) {
    return;
  }

  // Mostrar notificación manualmente si es un mensaje de datos
  const { title, body } = payload.data;

  self.registration.showNotification(title, {
    body,
    icon: "/assets/icons/icon.png"
  });
});
