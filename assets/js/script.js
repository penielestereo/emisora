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
      isPlaying = false;
    } else {
      audio.play();
      playPauseIcon.src = "assets/img/pause.png";
      animacion.play();
      isPlaying = true;
    }
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
    if (data && data.now_playing && data.now_playing.song) {
      const { artist, title } = data.now_playing.song;
      artistaCancion.textContent = `${artist} - ${title}`;
    } else {
      artistaCancion.textContent = "Sin información disponible.";
    }
  };

  // Actualizar los metadatos cada 15 segundos
  fetchMetadata();
  setInterval(fetchMetadata, 5000);

  // Controlar el menú desplegable
  const menuBtn = document.getElementById("menuBtn");
  const menuOptions = document.getElementById("menuOptions");
  const menuIcon = document.getElementById("menuIcon");

  menuBtn.addEventListener("click", () => {
    if (menuOptions.classList.contains("open")) {
      menuOptions.classList.remove("open");
      menuIcon.src = "assets/img/menu.png";
    } else {
      menuOptions.classList.add("open");
      menuIcon.src = "assets/img/close.png";
    }
  });

  // Eventos de instalación de la PWA
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.getElementById('installButton');
    if (installButton) {
      installButton.style.display = 'block';
    }

    installButton.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó la instalación');
        } else {
          console.log('El usuario rechazó la instalación');
        }
        deferredPrompt = null;
        installButton.style.display = 'none';
      });
    });
  });

  // Firebase: Inicializar la configuración
  const firebaseConfig = {
    apiKey: "AIzaSyC2KTmkA-1znWUJxAociE0SygIsI-ZeeXg",
    authDomain: "notificacionespeniel.firebaseapp.com",
    projectId: "notificacionespeniel",
    storageBucket: "notificacionespeniel.firebasestorage.app",
    messagingSenderId: "634476182377",
    appId: "1:634476182377:web:ef93780f0cfbf866451bf8",
    measurementId: "G-L8Q4FJNGM7"
  };

  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js";

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const messaging = getMessaging(app);

  document.getElementById("activarNotificaciones").addEventListener("click", () => {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Permiso concedido");
        getToken(messaging, { vapidKey: "TU_VAPID_KEY" })
          .then((currentToken) => {
            if (currentToken) {
              console.log("Token FCM:", currentToken);
              fetch('https://tu-servidor.com/api/registrar-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: currentToken })
              });
            } else {
              console.log("No se pudo obtener el token FCM");
            }
          })
          .catch((err) => {
            console.log("Error al obtener el token FCM:", err);
          });
      } else {
        console.log("Permiso para notificaciones no concedido");
      }
    }).catch(err => {
      console.log("Error al solicitar permiso para notificaciones", err);
    });
  });

  onMessage(messaging, (payload) => {
    console.log("Mensaje recibido en primer plano:", payload);
  });
});
