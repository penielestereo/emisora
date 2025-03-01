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

  // Actualizar los metadatos cada 9 segundos
  fetchMetadata();
  setInterval(fetchMetadata, 9000);

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

  // Botón de "Pedir Canción"
  const btnPedirCancion = document.createElement("button");
  btnPedirCancion.id = "btnPedirCancion";
  btnPedirCancion.textContent = "Pedir Canción";
  btnPedirCancion.style.position = "fixed";
  btnPedirCancion.style.bottom = "20px";
  btnPedirCancion.style.left = "50%";
  btnPedirCancion.style.transform = "translateX(-50%)";
  btnPedirCancion.style.backgroundColor = "#ff5722";
  btnPedirCancion.style.color = "white";
  btnPedirCancion.style.border = "none";
  btnPedirCancion.style.padding = "12px";
  btnPedirCancion.style.borderRadius = "8px";
  btnPedirCancion.style.zIndex = "1000";
  document.body.appendChild(btnPedirCancion);

  // Modal de búsqueda de canciones
  const modal = document.createElement("div");
  modal.id = "modalPedirCancion";
  modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.7)";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "2000";
  modal.innerHTML = `
    <div style="background: white; padding: 20px; width: 80%; max-width: 400px; border-radius: 8px; text-align: center;">
      <h3>Buscar Canción</h3>
      <input type="text" id="buscadorCancion" placeholder="Escribe una canción..." style="width: 100%; padding: 8px; margin-bottom: 10px;">
      <ul id="listaCanciones" style="max-height: 200px; overflow-y: auto; list-style: none; padding: 0;"></ul>
      <button onclick="cerrarModal()" style="margin-top: 10px; padding: 8px; background: red; color: white; border: none; border-radius: 5px;">Cerrar</button>
    </div>
  `;
  document.body.appendChild(modal);

  btnPedirCancion.addEventListener("click", () => {
    modal.style.display = "flex";
    obtenerListaCanciones();
  });

  function cerrarModal() {
    modal.style.display = "none";
  }
  window.cerrarModal = cerrarModal;

  // Obtener lista de canciones disponibles
  async function obtenerListaCanciones() {
    try {
      const response = await fetch("https://penielestereo.top/api/requests"); // Ajusta la URL según tu API de AzuraCast
      const data = await response.json();
      const listaCanciones = document.getElementById("listaCanciones");
      listaCanciones.innerHTML = "";

      data.forEach((cancion) => {
        const li = document.createElement("li");
        li.textContent = `${cancion.artist} - ${cancion.title}`;
        li.style.cursor = "pointer";
        li.style.padding = "5px";
        li.style.borderBottom = "1px solid #ddd";
        li.addEventListener("click", () => solicitarCancion(cancion.request_id));
        listaCanciones.appendChild(li);
      });
    } catch (error) {
      console.error("Error obteniendo canciones:", error);
    }
  }

  // Realizar solicitud de canción
  async function solicitarCancion(requestId) {
    try {
      const response = await fetch(`https://penielestereo.top/api/requests/${requestId}`, {
        method: "POST",
      });

      if (response.ok) {
        alert("¡Tu canción ha sido solicitada con éxito!");
        cerrarModal();
      } else {
        alert("Error al solicitar la canción. Inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al solicitar canción:", error);
      alert("Hubo un problema con la solicitud.");
    }
  }

  // Añadir funcionalidad de instalación para PWA en Android
  let deferredPrompt;
  const installButton = document.createElement("button");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    installButton.textContent = "Instalar Peniel Estéreo";
    installButton.style.position = "fixed";
    installButton.style.bottom = "20px";
    installButton.style.right = "20px";
    installButton.style.backgroundColor = "#2196f2";
    installButton.style.color = "white";
    installButton.style.border = "none";
    installButton.style.padding = "10px";
    installButton.style.borderRadius = "5px";
    installButton.style.zIndex = "1000";
    document.body.appendChild(installButton);

    installButton.addEventListener("click", () => {
      installButton.style.display = "none";
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA instalada");
        }
      });
    });
  });
});
