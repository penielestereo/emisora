document.addEventListener("DOMContentLoaded", () => {
  const audio = new Audio("https://penielestereo.top:8000/radio.mp3");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playPauseIcon = document.getElementById("playPauseIcon");
  const artistaCancion = document.getElementById("artistaCancion");
  const animacionContainer = document.getElementById("animacion");
  
  // Inicializar animación con Lottie
  const animacion = lottie.loadAnimation({
    container: animacionContainer,
    renderer: "svg",
    loop: true,
    autoplay: false,
    path: "assets/lottie/animacion.json",
  });

  let isPlaying = false;

  // Play/Pause Audio
  playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      playPauseIcon.src = "assets/img/play.png";
      animacion.stop();
    } else {
      audio.play();
      playPauseIcon.src = "assets/img/pause.png";
      animacion.play();
    }
    isPlaying = !isPlaying;
  });

  // Obtener metadatos de la canción
  const fetchMetadata = async () => {
    try {
      const response = await fetch("https://penielestereo.top/api/nowplaying/penielestereo");
      const data = await response.json();
      updateSongInfo(data);
    } catch (error) {
      console.error("Error al obtener los metadatos:", error);
      artistaCancion.textContent = "Error al cargar los datos.";
    }
  };

  const updateSongInfo = (data) => {
    if (data?.now_playing?.song) {
      const { artist, title } = data.now_playing.song;
      artistaCancion.textContent = `${artist} - ${title}`;
    } else {
      artistaCancion.textContent = "Sin información disponible.";
    }
  };

  // Actualizar los metadatos cada 5 segundos
  fetchMetadata();
  setInterval(fetchMetadata, 5000);

  // Controlar el menú desplegable
  const menuBtn = document.getElementById("menuBtn");
  const menuOptions = document.getElementById("menuOptions");
  const menuIcon = document.getElementById("menuIcon");

  menuBtn.addEventListener("click", () => {
    menuOptions.classList.toggle("open");
    menuIcon.src = menuOptions.classList.contains("open") ? "assets/img/close.png" : "assets/img/menu.png";
  });

  // Eventos de instalación de la PWA
  let deferredPrompt;
  const installButton = document.getElementById('installButton');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
  });

  installButton?.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      installButton.style.display = 'none';
    });
  });

  // Integración con Firebase Cloud Messaging (FCM)
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDRjNrqGk5jec_TrjpiI_nY0H_hW70ODRI",
    authDomain: "notificacionespeniel-29ab3.firebaseapp.com",
    projectId: "notificacionespeniel-29ab3",
    storageBucket: "notificacionespeniel-29ab3.firebasestorage.app",
    messagingSenderId: "145535352146",
    appId: "1:145535352146:web:5d08044df2a0c2e1594e8b"
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      getToken(messaging, { vapidKey: "BAQpDysKX6ZAbzK3R2eh-JNX8DGnUm40RC-4XizxG6G3uHwX702GYNlTDfxmDaozmLaxWqXE7CtrIF4tw9RPYms" })
        .then((currentToken) => console.log("Token de notificación:", currentToken))
        .catch((err) => console.log("Error obteniendo el token:", err));
    }
  });

  onMessage(messaging, (payload) => {
    console.log("Mensaje recibido:", payload);
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/assets/icons/icon.png"
    });
  });

  // Registrar Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
      .then((registration) => console.log("Service Worker registrado con éxito:", registration))
      .catch((error) => console.error("Error al registrar el Service Worker:", error));
  }
});
