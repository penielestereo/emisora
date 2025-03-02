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

  // Actualizar los metadatos cada 5 segundos
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

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.getElementById("installButton");

    if (installButton) {
      installButton.style.display = "block";
    }

    installButton.addEventListener("click", () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("El usuario aceptó la instalación");
        } else {
          console.log("El usuario rechazó la instalación");
        }
        deferredPrompt = null;
        installButton.style.display = "none";
      });
    });
  });

  // Función para solicitar canción a AzuraCast
  const requestSong = async () => {
    try {
      const response = await fetch("https://penielestereo.top/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song: "Canción solicitada" }) // Puedes cambiar esta lógica
      });

      if (response.ok) {
        successMessage.style.display = "block"; // Mostrar mensaje de éxito
        setTimeout(() => {
          successMessage.style.display = "none"; // Ocultar solo el mensaje después de 3 segundos
        }, 3000);
      } else {
        alert("Error al solicitar la canción.");
      }
    } catch (error) {
      console.error("Error al solicitar la canción:", error);
    }
  };

  // Manejador del botón de solicitud de canción
  const requestSongBtn = document.getElementById("requestSongBtn");
  const successMessage = document.getElementById("successMessage");

  requestSongBtn.addEventListener("click", requestSong);
});

