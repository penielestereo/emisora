import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging.js";

// 🔥 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",
  authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
  projectId: "notificacionespeniel-29ab3",
  storageBucket: "notificacionespeniel-29ab3.appspot.com",
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
        // Enviar el token al servidor para suscripción
        enviarTokenAlBackend(token);
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

// 📩 Enviar el token al servidor
const enviarTokenAlBackend = async (token) => {
  try {
    const response = await fetch('http://localhost:3000/suscribir', {  // Asegúrate de que esta URL sea la correcta para tu servidor
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token })
    });

    if (response.ok) {
      console.log("✅ Token enviado al backend.");
    } else {
      console.warn("⚠️ Error al enviar el token al backend.");
    }
  } catch (error) {
    console.error("❌ Error en la solicitud al servidor:", error);
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
