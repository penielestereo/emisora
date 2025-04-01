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

// ✅ Registrar el Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Service Worker registrado:", registration);
    })
    .catch((error) => {
      console.error("❌ Error registrando el Service Worker:", error);
    });
}

// 🚀 Solicitar permiso y obtener Token
const obtenerTokenFCM = async () => {
  try {
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      console.log("✅ Permiso concedido");

      const token = await getToken(messaging, {
        vapidKey: "BAQpDysKX6ZAbzK3R2eh-JNX8DGnUm40RC-4XizxG6G3uHwX702GYNlTDfxmDaozmLaxWqXE7CtrIF4tw9RPYms"
      });

      if (token) {
        console.log("📌 Token obtenido:", token);
        suscribirATema(token, "global");
      } else {
        console.warn("⚠️ No se obtuvo token.");
      }
    } else {
      console.warn("⚠️ Permiso de notificación denegado.");
    }
  } catch (error) {
    console.error("❌ Error obteniendo el token:", error);
  }
};

// 📩 Suscribirse a un tema en Firebase
const suscribirATema = async (token, tema) => {
  try {
    const response = await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${tema}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer TU_ACCESS_TOKEN`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      console.log(`✅ Suscrito al tema: ${tema}`);
    } else {
      console.warn("⚠️ No se pudo suscribir al tema.");
    }
  } catch (error) {
    console.error("❌ Error en la suscripción:", error);
  }
};

// 📌 Llamar a la función
obtenerTokenFCM();

// 📩 Manejar notificaciones en primer plano
onMessage(messaging, (payload) => {
  console.log("📬 Mensaje recibido en primer plano:", payload);
  const { title, body } = payload.notification;

  new Notification(title, {
    body,
    icon: "/assets/icons/icon.png"
  });
});
