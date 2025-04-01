// Importar e inicializar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js";

// 🔥 Configuración de Firebase (Reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",  // 🔹 Reemplaza con tu API Key
  authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
  projectId: "notificacionespeniel-29ab3",
  storageBucket: "notificacionespeniel-29ab3.firebasestorage.app",
  messagingSenderId: "145535352146", // 🔹 Tu Sender ID
  appId: "1:145535352146:web:5d08044df2a0c2e1594e8b",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 🚀 Registrar el Service Worker de Firebase Messaging
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Firebase Messaging Service Worker registrado:", registration);
    })
    .catch((error) => {
      console.error("❌ Error registrando Firebase Messaging SW:", error);
    });
}

// 🚀 Solicitar permiso para recibir notificaciones
const solicitarPermiso = async () => {
  try {
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      console.log("✅ Permiso de notificación concedido");

      // Obtener el token FCM
      const token = await getToken(messaging, {
        vapidKey: "TU_CLAVE_VAPID", // 🔹 Reemplaza con tu VAPID Key
      });

      if (token) {
        console.log("📌 Token FCM obtenido:", token);
        // Enviar el token al servidor si es necesario
      } else {
        console.warn("⚠️ No se pudo obtener un token de notificación.");
      }
    } else {
      console.warn("⚠️ Permiso de notificación denegado.");
    }
  } catch (error) {
    console.error("❌ Error obteniendo el token:", error);
  }
};

// 📩 Manejar notificaciones en primer plano
onMessage(messaging, (payload) => {
  console.log("📬 Mensaje recibido en primer plano:", payload);
  const { title, body } = payload.notification;

  // Mostrar notificación nativa
  new Notification(title, {
    body,
    icon: "/assets/icons/icon.png",
  });
});

// 📌 Llamar a la función al cargar
solicitarPermiso();
