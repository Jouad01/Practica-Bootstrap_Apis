let db;

document.addEventListener("DOMContentLoaded", function () {
  initDb();
});

export function initDb() {
  const request = window.indexedDB.open("MoviesDB", 1);

  request.onerror = function (event) {
    console.error("Error al abrir la base de datos:", event.target.errorCode);
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("wishlist")) {
      const objectStore = db.createObjectStore("wishlist", { keyPath: "id" });
      objectStore.createIndex("priority", "priority", { unique: false }); // Cambio aquí
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    loadWishlist();
  };
}

export function addToWishlist(movie) {
  const transaction = db.transaction(["wishlist"], "readwrite");
  const store = transaction.objectStore("wishlist");

  store.add(movie).onsuccess = function () {
    // Selecciona o crea el contenedor de la alerta
    let alertContainer = document.getElementById("alert-container");
    if (!alertContainer) {
      alertContainer = document.createElement("div");
      alertContainer.id = "alert-container";
      alertContainer.style.position = "fixed";
      alertContainer.style.top = "20px"; // Cambia 'bottom' por 'top' para moverlo hacia la parte superior de la pantalla
      alertContainer.style.left = "50%";
      alertContainer.style.transform = "translateX(-50%)";
      alertContainer.style.zIndex = "9999";
      document.body.appendChild(alertContainer);
    }

    const alertHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        Película añadida a la lista de deseos
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    alertContainer.innerHTML = alertHTML;

    // Opcional: elimina la alerta después de 5 segundos
    setTimeout(() => {
      alertContainer.removeChild(alertContainer.firstChild);
    }, 2000);

    loadWishlist();
  };
}

export function removeFromWishlist(id) {
  const transaction = db.transaction(["wishlist"], "readwrite");
  const store = transaction.objectStore("wishlist");
  store.delete(id).onsuccess = function () {
    loadWishlist();
  };
}

export function updateMoviePriority(id, priority) {
  const transaction = db.transaction(["wishlist"], "readwrite");
  const store = transaction.objectStore("wishlist");
  const request = store.get(id);

  request.onsuccess = function () {
    const movie = request.result;
    movie.priority = priority;
    store.put(movie).onsuccess = function () {
      console.log("Prioridad de visualización actualizada");
      loadWishlist();
    };
  };
}

export function loadWishlist() {
  const transaction = db.transaction(["wishlist"], "readonly");
  const store = transaction.objectStore("wishlist");
  const request = store.getAll();

  request.onsuccess = function () {
    const wishlistTable = document.getElementById("wishlist");
    wishlistTable.innerHTML = "";

    request.result.forEach((movie) => {
      const row = wishlistTable.insertRow();

      // Celda para el título
      const titleCell = row.insertCell(0);
      titleCell.textContent = movie.title;

      // Celda para el nivel de prioridad
      const priorityCell = row.insertCell(1);
      const prioritySelect = document.createElement("select");
      prioritySelect.innerHTML = `
        <option value="Alta" ${
          movie.priority === "Alta" ? "selected" : ""
        }>Alta</option>
        <option value="Baja" ${
          movie.priority === "Baja" ? "selected" : ""
        }>Baja</option>
      `;
      prioritySelect.onchange = () =>
        updateMoviePriority(movie.id, prioritySelect.value);
      priorityCell.appendChild(prioritySelect);

      // Celda para las acciones
      const actionsCell = row.insertCell(2);
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.className = "btn btn-danger";
      deleteButton.onclick = () => removeFromWishlist(movie.id);
      actionsCell.appendChild(deleteButton);
    });
  };
}

const URL_PATH = "https://api.themoviedb.org";
const API_KEY = "a8cf93c6f0b9e3d858ab64d82c2a51ab";

export const searchMovies = async () => {
  const textSearch = document.getElementById("search-movie").value;

  if (textSearch.length < 3) {
    document.getElementsByClassName("list-cards-search")[0].innerHTML = "";
    return;
  }

  const movies = await getMovies(textSearch);

  let html = "";
  movies.forEach((movie) => {
    const { id, title, overview, poster_path } = movie;
    const urlImage = `https://image.tmdb.org/t/p/w500${poster_path}`;

    html += `
      <div class="col-md-4 d-flex align-items-stretch">
        <div class="card mb-4 shadow-sm flex-fill">
          <div class="row no-gutters h-100">
            <div class="col-md-4 d-flex align-items-center justify-content-center overflow-hidden">
              <img src="${urlImage}" class="img-fluid" alt="${title}" style="max-height: 200px;">
            </div>
            <div class="col-md-8">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${overview.substr(0, 100)}...</p>
                <button data-id="${id}" data-title="${title}" class="btn btn-primary mt-auto add-to-wishlist">Añadir a lista de deseos</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  const container = document.getElementsByClassName("list-cards-search")[0];
  container.innerHTML = html;

  addEventListenersToButtons();
};

export function addEventListenersToButtons() {
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const title = this.getAttribute("data-title");
      addToWishlist({ id, title, watchNow: false })
        .then(() => {
          console.log("Película añadida a la lista de deseos");
        })
        .catch((error) => {
          console.error("Error añadiendo película a la lista de deseos", error);
        });
    });
  });
}

export const getMovies = (textSerach) => {
  const url = `${URL_PATH}/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${textSerach}&page=1&include_adult=true`;

  return fetch(url)
    .then((response) => response.json())
    .then((result) => result.results)
    .catch((error) => console.log(error));
};
document.addEventListener("DOMContentLoaded", function () {
  initDb();
});
