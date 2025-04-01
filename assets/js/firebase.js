import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",
  authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
  projectId: "notificacionespeniel-29ab3",
  storageBucket: "notificacionespeniel-29ab3.firebasestorage.app",
  messagingSenderId: "145535352146",
  appId: "1:145535352146:web:5d08044df2a0c2e1594e8b"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Función para solicitar permisos y obtener el token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { vapidKey: "BAQpDysKX6ZAbzK3R2eh-JNX8DGnUm40RC-4XizxG6G3uHwX702GYNlTDfxmDaozmLaxWqXE7CtrIF4tw9RPYms" });
      console.log("Token de notificación:", currentToken);
    } else {
      console.log("Permiso de notificaciones denegado.");
    }
  } catch (err) {
    console.log("Error obteniendo el token:", err);
  }
};

// Escuchar mensajes en tiempo real
onMessage(messaging, (payload) => {
  console.log("Mensaje recibido:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/assets/icons/icon.png"
  });
});
