function adjustNavLinkStyles(navLinks) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.classList.replace("text-white", "text-dark");
  });
}

export function initializeNavBar() {
  var navLinks = document.querySelectorAll(".navbar-nav .nav-item .nav-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      adjustNavLinkStyles(navLinks);

      this.classList.add("active");
      this.classList.replace("text-dark", "text-white");

      location.href = this.href;
    });
  });
}
