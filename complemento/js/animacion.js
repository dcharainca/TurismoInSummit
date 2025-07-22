const modal = document.getElementById("popupModalCertificaciones");
const contenidosImagenes = document.getElementsByClassName("image-grid");
const miniPopup = document.getElementById("miniPopup");
var dataJson;

(function () {
  const carousels = [
    {
      selector: "#ponentesPanelistas .ponentes-carousel-track",
      cardSelector: ".ponente-card-wrapper",
      gap: 15,
    },
    {
      selector: "#directorioExpositores .carousel-track",
      cardSelector: ".card-wrapper",
      gap: 20,
    },
  ];

  carousels.forEach(({ selector, cardSelector, gap }) => {
    const track = document.querySelector(selector);
    const cards = document.querySelectorAll(`${selector} ${cardSelector}`);
    if (!track || cards.length === 0) return;

    let currentTranslate = 0;
    let cardWidth = 0;
    let maxTranslate = 0;
    let isCarouselActive = false;

    function setLimits() {
      cardWidth = cards[0].offsetWidth + gap;
      const totalWidth = cardWidth * cards.length;
      const visibleWidth = track.parentElement.offsetWidth;
      maxTranslate = -(totalWidth - visibleWidth);

      isCarouselActive = totalWidth > visibleWidth;

      if (!isCarouselActive) {
        currentTranslate = 0;
        track.style.transform = "translateX(0)";
        track.style.cursor = "default";
      } else {
        track.style.cursor = "default";
      }
    }

    const btnPrev = document
      .querySelector(`${selector}`)
      .parentElement.querySelector(".left");
    const btnNext = document
      .querySelector(`${selector}`)
      .parentElement.querySelector(".right");

    function updateButtonsVisibility() {
      if (isCarouselActive) {
        btnPrev.style.display = "block";
        btnNext.style.display = "block";
      } else {
        btnPrev.style.display = "none";
        btnNext.style.display = "none";
      }
    }

    btnPrev.addEventListener("click", () => {
      if (!isCarouselActive) return;
      currentTranslate += cardWidth;
      applyBounds();
      setTrackPosition();
    });

    btnNext.addEventListener("click", () => {
      if (!isCarouselActive) return;
      currentTranslate -= cardWidth;
      applyBounds();
      setTrackPosition();
    });

    function setTrackPosition() {
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function applyBounds() {
      if (currentTranslate > 0) currentTranslate = 0;
      if (currentTranslate < maxTranslate) currentTranslate = maxTranslate;
    }

    function setLimitsWithButtons() {
      setLimits();
      updateButtonsVisibility();
    }

    window.addEventListener("resize", setLimitsWithButtons);
    setLimitsWithButtons();
  });
})();

async function cargarSolucionesTecnologicas() {
  try {
    const response = await fetch("complemento/json/dataExpositores.json");
    if (!response.ok) {
      throw new Error(`Error al cargar el JSON: ${response.statusText}`);
    }

    const data = await response.json();
    dataJson = data;
    const contenedorSolTech = document.getElementById(
      "divSolucionesTecnologicas"
    );
    const contenedorCertifi = document.getElementById(
      "divImagenCertificaciones"
    );
    const contenedorSerGube = document.getElementById(
      "divServiciosGubernamentales"
    );
    contenedorSolTech.innerHTML = "";
    contenedorCertifi.innerHTML = "";
    contenedorSerGube.innerHTML = "";

    function crearElemento(item) {
      const img = document.createElement("img");
      img.src = `complemento/img/Empresas/${item.RUC}.png`;
      img.alt = item.NombreComercial || "Empresa";
      img.addEventListener("click", () => detalleEmpresa(item.RUC));
      img.onerror = function () {
        const fallbackDiv = document.createElement("div");
        fallbackDiv.className = "fallback-logo";
        fallbackDiv.textContent = item.NombreComercial || "Empresa";
        fallbackDiv.addEventListener("click", () => detalleEmpresa(item.RUC));
        img.replaceWith(fallbackDiv);
      };

      if (item.RUC == "Ytuqueplanes") {
        img.style.backgroundColor = "#33aba0";
      }

      if (
        item.RUC == "Coexpositores" ||
        item.RUC == "TurismoReuniones" ||
        item.RUC == "20131372001_1" ||
        item.RUC == "20131372001" ||
        item.RUC == "20168999926"
      ) {
        const tempDiv = document.createElement("div");
        const tempSpan = document.createElement("span");
        tempDiv.classList.add("text-center");
        tempSpan.classList.add("sEmpPromperu");
        tempSpan.innerText = item.NombreComercial;
        tempDiv.append(img);
        tempDiv.append(tempSpan);
        return tempDiv;
      }

      return img;
    }

    data
      .filter((item) => item.Categoria === "Soluciones tecnológicas")
      .forEach((item) => {
        contenedorSolTech.appendChild(crearElemento(item));
      });

    data
      .filter((item) => item.Categoria === "Certificadoras")
      .forEach((item) => {
        contenedorCertifi.appendChild(crearElemento(item));
      });

    data
      .filter((item) => item.Categoria === "Servicios gubernamentales")
      .sort((a, b) => a.Orden - b.Orden)
      .forEach((item) => {
        contenedorSerGube.appendChild(crearElemento(item));
      });
  } catch (error) {
    console.error("Error al generar las imágenes:", error);
  }
}

function abrirPopup(categoria, tipoContenido) {
  ocultarContenidoPopup();
  document.getElementById(tipoContenido).style.display = "grid";
  modal.style.display = "flex";
  document.getElementById("TituloPopup").innerText = categoria;
}

function closeModal() {
  ocultarContenidoPopup();
  document.getElementById("TituloPopup").innerText = "";
  modal.style.display = "none";
}

function ocultarContenidoPopup() {
  for (let i = 0; i < contenidosImagenes.length; i++) {
    contenidosImagenes[i].style.display = "none";
  }
}

function abrirMiniPopup() {
  miniPopup.style.display = "flex";
}

function closeMiniPopup() {
  miniPopup.style.display = "none";
}
function detalleEmpresa(ruc) {
  document.querySelector(".dContacto").style.display = "block";
  document.querySelector(".dCargo").style.display = "block";
  document.querySelector(".pContacto").style.display = "block";
  document.querySelector(".pCargo").style.display = "block";

  const empresa = dataJson.find((item) => item.RUC == ruc);
  if (!empresa) {
    console.error("No se encontró la empresa con RUC:", ruc);
    return;
  }
  document.querySelector(".pExpositor").textContent =
    empresa.NombreComercial || "";

  const paginaWeb = document.querySelector(".aPaginaWeb");
  paginaWeb.href = empresa.PaginaWeb || "#";
  paginaWeb.textContent = empresa.PaginaWeb ? "Página web" : "Sin página";

  if (empresa.Categoria == "Servicios gubernamentales") {
    document.querySelector(".dContacto").style.display = "none";
    document.querySelector(".dCargo").style.display = "none";
    document.querySelector(".pContacto").style.display = "none";
    document.querySelector(".pCargo").style.display = "none";
  }

  document.querySelector(".pContacto").textContent = empresa.Contacto || "";
  document.querySelector(".pCargo").textContent = empresa.Cargo || "";

  const correoEl = document.querySelector(".pCorreo");
  correoEl.textContent = empresa.Correo || "Sin correo";
  correoEl.style.cursor = empresa.Correo ? "pointer" : "default";
  correoEl.onclick = empresa.Correo
    ? () => (window.location.href = `mailto:${empresa.Correo}`)
    : null;
  document.querySelector(".aDescripcion").textContent =
    empresa.Descripcion || "";

  abrirMiniPopup();
}

document.addEventListener("DOMContentLoaded", cargarSolucionesTecnologicas);

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(
    "#ponentesPanelistas .ponente-card-wrapper"
  );
  const track = document.querySelector(
    "#ponentesPanelistas .ponentes-carousel-track"
  );

  function toggleCard(card) {
    if (track.classList.contains("dragging")) return;

    cards.forEach((c) => {
      if (c !== card) c.classList.remove("show-desc");
    });

    card.classList.toggle("show-desc");
  }

  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if ("ontouchstart" in window) return;
      toggleCard(card);
      e.stopPropagation();
    });

    card.addEventListener("touchend", function (e) {
      if (track.classList.contains("dragging")) return;
      toggleCard(card);
      e.stopPropagation();
    });
  });

  function cerrarTodas(e) {
    if (!e.target.closest("#ponentesPanelistas .ponente-card-wrapper")) {
      cards.forEach((c) => c.classList.remove("show-desc"));
    }
  }
  document.addEventListener("click", cerrarTodas);
  document.addEventListener("touchend", cerrarTodas);
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (miniPopup.style.display === "flex") {
      closeMiniPopup();
      return;
    }
    closeModal();
  }
});

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", function (event) {
    if (event.target !== overlay) return;
    if (miniPopup.style.display === "flex") {
      closeMiniPopup();
      return;
    }
    closeModal();
  });
});

(function () {
  const parallaxSections = document.querySelectorAll(".wrapper-parallax-bg");

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY;
      const speed = 0.4;
      const yPos = (scrollY - offsetTop) * speed;
      section.style.backgroundPosition = `center ${yPos}px`;
    });
  }

  window.addEventListener("scroll", updateParallax);
  window.addEventListener("resize", updateParallax);
  updateParallax();
})();
