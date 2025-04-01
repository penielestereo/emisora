importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js');

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  // Personaliza la notificación aquí
  const notificationTitle = 'Notificación de Peniel Estéreo';
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
