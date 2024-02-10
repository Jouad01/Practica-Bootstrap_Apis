// estilos navegación
function adjustNavLinkStyles(navLinks) {
  // Itera sobre cada enlace de navegacion, elimina clase active y reemplaza clase
  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.classList.replace("text-white", "text-dark");
  });
}

// para inicializar la barra de navegación
export function initializeNavBar() {
  // Selecciona todos los enlaces con los elementos
  var navLinks = document.querySelectorAll(".navbar-nav .nav-item .nav-link");

  // Asigna un evento de clic 
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      // evitar recargar la página y ajusta estilos
      e.preventDefault();
      adjustNavLinkStyles(navLinks);

      // Añade la clase "active" al enlace clicado para resaltar el enlace bueno
      this.classList.add("active");
      this.classList.replace("text-dark", "text-white");

      // cambia la página a la URL del enlace clicado
      location.href = this.href;
    });
  });
}
