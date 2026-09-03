$(document).ready(function() {

	var n = new Date;
	$(".wrapper-copyright-section").find("span").html(n.getFullYear());

});

document.addEventListener("DOMContentLoaded", function () {
  var botones = document.querySelectorAll(".btn-copiar-correo");
  if (!botones.length) return;

  function respaldo(texto) {
    var ta = document.createElement("textarea");
    ta.value = texto;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  Array.prototype.forEach.call(botones, function (btn) {
    var aviso = btn.parentElement ? btn.parentElement.querySelector(".aviso-copiado") : null;
    var icono = btn.querySelector("i");
    var temporizador;

    function avisar(ok, texto) {
      clearTimeout(temporizador);
      if (aviso) {
        aviso.textContent = ok ? "\u00a1Copiado!" : texto;
        aviso.classList.add("visible");
      }
      if (ok) {
        btn.classList.add("copiado");
        if (icono) icono.className = "fa fa-check";
      }
      temporizador = setTimeout(function () {
        if (aviso) { aviso.classList.remove("visible"); aviso.textContent = ""; }
        btn.classList.remove("copiado");
        if (icono) icono.className = "fa fa-files-o";
      }, 2500);
    }

    btn.addEventListener("click", function () {
      var correo = btn.getAttribute("data-correo") || "";
      if (!correo) return;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(correo).then(
          function () { avisar(true); },
          function () { avisar(respaldo(correo), correo); }
        );
      } else {
        avisar(respaldo(correo), correo);
      }
    });
  });
});
