<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function () {
  const openModalButtons = document.querySelectorAll('.openModalButton');
  const puzzleModal = document.getElementById('puzzleModal');
  const puzzlePiece = document.getElementById('puzzle-piece');
  const dropZone = document.getElementById('drop-zone');
  const closeModalButton = document.getElementById('closeModalButton');

  let isDragging = false;
  let offsetX, offsetY;
  let currentTrailerUrl = '';

  openModalButtons.forEach(function(openModalButton) {
    openModalButton.addEventListener('click', function () {
      puzzleModal.style.display = 'block';
      puzzlePiece.style.display = 'block'; /* Muestra el cuadrado azul */
      dropZone.style.display = 'block'; /* pra mostrar el hueco */
      isDragging = false;
      puzzlePiece.style.left = '20%';
      dropZone.style.right = '35%';
      currentTrailerUrl = openModalButton.getAttribute('data-trailer-url');
    });
  });
  

  puzzlePiece.addEventListener('mousedown', function (event) {
    isDragging = true;
    offsetX = event.clientX - puzzlePiece.getBoundingClientRect().left;
    offsetY = event.clientY - puzzlePiece.getBoundingClientRect().top;

    document.addEventListener('mousemove', onMouseMove);

    function onMouseMove(event) {
      if (isDragging) {
        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;

        puzzlePiece.style.left = x + 'px';
        puzzlePiece.style.top = y + 'px';
      }
    }

    document.addEventListener('mouseup', function onMouseUp() {
      if (isDragging) {
        document.removeEventListener('mousemove', onMouseMove);

        const puzzleRect = puzzlePiece.getBoundingClientRect();
        const dropZoneRect = dropZone.getBoundingClientRect();

        if (
          puzzleRect.left > dropZoneRect.left &&
          puzzleRect.right < dropZoneRect.right &&
          puzzleRect.top > dropZoneRect.top &&
          puzzleRect.bottom < dropZoneRect.bottom
        ) {
          window.open(currentTrailerUrl, '_blank');
          // Cierra el modal  cuando se completa el reto
          puzzleModal.style.display = 'none';
        }

        isDragging = false;
      }

      document.removeEventListener('mouseup', onMouseUp);
    });
  });

  closeModalButton.addEventListener('click', function () {
    puzzleModal.style.display = 'none';
  });
});
=======
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

