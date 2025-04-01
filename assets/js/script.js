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
      menuIcon.src = "assets/img/menu.png"; // Cambiar a ícono de menú
    } else {
      menuOptions.classList.add("open");
      menuIcon.src = "assets/img/close.png"; // Cambiar a ícono de cerrar
    }
  });

  // Eventos de instalación de la PWA
  let deferredPrompt;

  // Detecta cuando el navegador ofrece la opción de instalación
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir la instalación automática
    e.preventDefault();
    deferredPrompt = e;

    // Mostrar el botón de instalación
    const installButton = document.getElementById('installButton');
    if (installButton) {
      installButton.style.display = 'block'; // Mostrar el botón de instalación
    }

    // Manejador del clic en el botón de instalación
    installButton.addEventListener('click', () => {
      // Mostrar la opción de instalación
      deferredPrompt.prompt();

      // Espera la respuesta del usuario
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó la instalación');
        } else {
          console.log('El usuario rechazó la instalación');
        }
        deferredPrompt = null;
        installButton.style.display = 'none'; // Ocultar el botón después de la acción
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

  // Importa los módulos necesarios de Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js";

  // Inicializa la app de Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  // Inicializa el servicio de mensajería de Firebase
  const messaging = getMessaging(app);

  // Solicitar permiso para notificaciones
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Permiso para notificaciones concedido");

      // Obtén el token FCM
      getToken(messaging, { vapidKey: "TU_VAPID_KEY" }).then((currentToken) => {
        if (currentToken) {
          console.log("Token FCM:", currentToken);
          // Aquí puedes enviar el token a tu servidor para guardarlo y usarlo para enviar notificaciones
        } else {
          console.log("No se pudo obtener el token FCM");
        }
      }).catch((err) => {
        console.log("Error al obtener el token FCM:", err);
      });
    } else {
      console.log("Permiso para notificaciones no concedido");
    }
  }).catch(err => {
    console.log("Error al solicitar permiso para notificaciones", err);
  });

  // Escuchar mensajes cuando la app está en primer plano
  onMessage(messaging, (payload) => {
    console.log("Mensaje recibido en primer plano:", payload);
    // Aquí puedes manejar la notificación cuando la aplicación esté abierta
  });
});

