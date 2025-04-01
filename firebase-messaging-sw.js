importScripts("https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSy...",
    authDomain: "notificacionespeniel.firebaseapp.com",
    projectId: "notificacionespeniel",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcd1234"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Mensaje recibido en segundo plano:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/assets/img/logo.png",
    });
});
