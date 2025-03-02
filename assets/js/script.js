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

  // Mostrar formulario de solicitud de canción
  const btnPedirCancion = document.getElementById("btnPedirCancion");
  const solicitudCancion = document.getElementById("solicitudCancion");
  
  btnPedirCancion.addEventListener("click", () => {
    solicitudCancion.style.display = solicitudCancion.style.display === "none" ? "block" : "none";
  });

  // Función para buscar canciones
  document.getElementById("btnBuscar").addEventListener("click", async () => {
    const query = document.getElementById("buscarCancion").value.trim();
    const listaResultados = document.getElementById("listaResultados");

    if (query === "") {
      alert("Por favor, escribe el nombre de una canción.");
      return;
    }

    try {
      const response = await fetch(`https://penielestereo.top/api/nowplaying/penielestereo`);
      const data = await response.json();

      // Filtrar canciones según el nombre
      const resultados = data.station.requests.filter((song) =>
        song.text.toLowerCase().includes(query.toLowerCase())
      );

      listaResultados.innerHTML = "";
      if (resultados.length === 0) {
        listaResultados.innerHTML = "<li>No se encontraron canciones</li>";
        return;
      }

      resultados.forEach((song) => {
        const li = document.createElement("li");
        li.textContent = song.text;
        li.dataset.songId = song.request_id;
        li.addEventListener("click", solicitarCancion);
        listaResultados.appendChild(li);
      });

    } catch (error) {
      console.error("Error al buscar canciones:", error);
    }
  });

  // Función para solicitar una canción
  async function solicitarCancion(event) {
    const songId = event.target.dataset.songId;

    try {
      const response = await fetch("https://penielestereo.top/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: songId }),
      });

      if (response.ok) {
        alert("✅ Canción solicitada con éxito.");
      } else {
        alert("❌ No se pudo solicitar la canción.");
      }
    } catch (error) {
      console.error("Error al solicitar la canción:", error);
    }
  }
});

