importScripts("https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",  // 🔹 Reemplaza con tu API Key
  authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
  projectId: "notificacionespeniel-29ab3",
  storageBucket: "notificacionespeniel-29ab3.firebasestorage.app",
  messagingSenderId: "145535352146", // 🔹 Tu Sender ID
  appId: "1:145535352146:web:5d08044df2a0c2e1594e8b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Mensaje recibido en segundo plano:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/assets/img/logo.png",
    });
});
