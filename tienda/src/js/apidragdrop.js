export function allowDrop(ev) {
  ev.preventDefault();
}

export function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

export let currentTrailerUrl = "";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".trailer-button").forEach((button) => {
    button.addEventListener("click", function () {
      currentTrailerUrl = this.getAttribute("data-trailer-url");
    });
  });
});

export function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));

  const miModal = document.getElementById("miModal");
  if (miModal) {
    miModal.classList.remove("show");
    miModal.style.display = "none";
    miModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }

  document.body.style.overflow = "auto";

  if (currentTrailerUrl) {
    const trailerWindow = window.open(currentTrailerUrl, "_blank");

    window.focus();

    currentTrailerUrl = "";

    resetDragAndDrop();
  }
}

export function resetDragAndDrop() {
  var dragItem = document.getElementById("drag4");
  var originalContainer = document.getElementById("images");
  if (dragItem && originalContainer) {
    originalContainer.appendChild(dragItem);
  }
}
