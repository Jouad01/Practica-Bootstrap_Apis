function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

let currentTrailerUrl = "";

document.querySelectorAll(".trailer-button").forEach((button) => {
  button.addEventListener("click", function () {
    currentTrailerUrl = this.getAttribute("data-trailer-url");
  });
});

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));

  $("#miModal").modal("hide");

  $("#miModal").on("hidden.bs.modal", function (e) {
    if (currentTrailerUrl) {
      window.open(currentTrailerUrl, "_blank");
      currentTrailerUrl = "";
    }
    resetDragAndDrop();
  });
}

function resetDragAndDrop() {
  var dragItem = document.getElementById("drag4");
  var originalContainer = document.getElementById("images");
  if (dragItem && originalContainer) {
    originalContainer.appendChild(dragItem);
  }
}
