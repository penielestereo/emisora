import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-performance.js";
import { getInAppMessaging, onMessageReceived, triggerEvent } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-in-app-messaging.js";

// 🔥 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",
  authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
  projectId: "notificacionespeniel-29ab3",
  storageBucket: "notificacionespeniel-29ab3.appspot.com",
  messagingSenderId: "145535352146",
  appId: "1:145535352146:web:5d08044df2a0c2e1594e8b",
  measurementId: "G-VQ81GWZY1R" // ✅ Asegurar que Google Analytics funcione
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);
const performance = getPerformance(app);
const inAppMessaging = getInAppMessaging(app);

// ✅ Registrar el Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Service Worker registrado correctamente:", registration);
    })
    .catch((error) => {
      console.error("❌ Error registrando el Service Worker:", error);
    });
}

// 🚀 Solicitar permiso y obtener Token para Cloud Messaging
const obtenerTokenFCM = async () => {
  try {
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      console.log("✅ Permiso concedido para notificaciones");
      const token = await getToken(messaging, {
        vapidKey: "BAQpDysKX6ZAbzK3R2eh-JNX8DGnUm40RC-4XizxG6G3uHwX702GYNlTDfxmDaozmLaxWqXE7CtrIF4tw9RPYms"
      });
      if (token) {
        console.log("📌 Token obtenido:", token);
        await enviarTokenAlBackend(token);
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
    const response = await fetch('https://167.86.114.193:3000/suscribir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    if (response.ok) {
      console.log("✅ Token enviado al backend correctamente.");
    } else {
      console.warn("⚠️ Error al enviar el token al backend.");
    }
  } catch (error) {
    console.error("❌ Error en la solicitud al servidor:", error);
  }
};

// 📌 Llamar a la función para obtener el Token de Cloud Messaging
obtenerTokenFCM();

// 📩 Manejar notificaciones en primer plano
onMessage(messaging, (payload) => {
  console.log("📬 Mensaje recibido en primer plano:", payload);
  const { title, body } = payload.notification;
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/assets/icons/icon.png" });
  } else {
    console.warn("⚠️ Notificación recibida, pero los permisos están bloqueados.");
  }
  logEvent(analytics, "notification_received", { title, body }); // 📊 Registrar evento en Google Analytics
});

// 🚀 **Configurar In-App Messaging**
inAppMessaging.isAutomaticDataCollectionEnabled = true;

// 🔥 Escuchar los mensajes dentro de la aplicación
onMessageReceived(inAppMessaging, (message) => {
  console.log("📩 In-App Message recibido:", message);
  logEvent(analytics, "in_app_message_received", { message }); // 📊 Registrar evento en Google Analytics
});

// 🚀 Activar un evento manual para mostrar un mensaje dentro de la app
const mostrarMensajeInApp = () => {
  triggerEvent(inAppMessaging, "mensaje_interactivo");
  logEvent(analytics, "in_app_message_triggered"); // 📊 Registrar evento en Google Analytics
};

// **Exportar Firebase y servicios**
export { app, messaging, inAppMessaging, mostrarMensajeInApp };
