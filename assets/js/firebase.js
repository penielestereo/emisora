import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging.js";

// 🔥 Configuración de Firebase (Reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",
  authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
  projectId: "notificacionespeniel-29ab3",
  storageBucket: "notificacionespeniel-29ab3.appspot.com", // 🔹 Corregido
  messagingSenderId: "145535352146",
  appId: "1:145535352146:web:5d08044df2a0c2e1594e8b",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ Registrar el Service Worker antes de obtener el token
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Service Worker registrado correctamente:", registration);
      obtenerTokenFCM(registration);
    })
    .catch((error) => {
      console.error("❌ Error registrando Service Worker:", error);
    });
}

// 🚀 Función para solicitar permiso y obtener el token
const obtenerTokenFCM = async (registration) => {
  try {
    const permiso = await Notification.requestPermission();
    if (permiso !== "granted") {
      console.warn("⚠️ Permiso de notificación denegado.");
      return;
    }

    console.log("✅ Permiso de notificación concedido");

    // Obtener el token FCM
    const token = await getToken(messaging, {
      vapidKey: "BAQpDysKX6ZAbzK3R2eh-JNX8DGnUm40RC-4XizxG6G3uHwX702GYNlTDfxmDaozmLaxWqXE7CtrIF4tw9RPYms",
      serviceWorkerRegistration: registration, // 🔹 Asignamos el SW
    });

    if (token) {
      console.log("📌 Token FCM obtenido:", token);
      suscribirATema(token);
    } else {
      console.warn("⚠️ No se pudo obtener un token de notificación.");
    }
  } catch (error) {
    console.error("❌ Error obteniendo el token:", error);
  }
};

// 🔹 Suscribir automáticamente al usuario al tema "global"
const suscribirATema = async (token) => {
  try {
    const respuesta = await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/global`, {
      method: "POST",
      headers: {
        "Authorization": "key=TU_SERVER_KEY",
        "Content-Type": "application/json",
      },
    });

    if (respuesta.ok) {
      console.log("✅ Suscrito automáticamente al tema 'global'");
    } else {
      console.warn("⚠️ No se pudo suscribir al tema.");
    }
  } catch (error) {
    console.error("❌ Error al suscribir al tema:", error);
  }
};

// 📩 Manejar notificaciones en primer plano
onMessage(messaging, (payload) => {
  console.log("📬 Mensaje recibido en primer plano:", payload);
  const { title, body } = payload.notification;

  new Notification(title, {
    body,
    icon: "/assets/icons/icon.png",
  });
});
