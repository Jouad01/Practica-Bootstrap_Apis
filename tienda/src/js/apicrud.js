let db;

document.addEventListener("DOMContentLoaded", function () {
  initDb();
});

function initDb() {
  const request = window.indexedDB.open("MoviesDB", 1);

  request.onerror = function (event) {
    console.error("Error al abrir la base de datos:", event.target.errorCode);
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("wishlist")) {
      const objectStore = db.createObjectStore("wishlist", {
        keyPath: "id",
      });
      objectStore.createIndex("watchNow", "watchNow", { unique: false });
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    loadWishlist();
  };
}

function addToWishlist(movie) {
  const transaction = db.transaction(["wishlist"], "readwrite");
  const store = transaction.objectStore("wishlist");
  store.add(movie).onsuccess = function () {
    console.log("Película añadida a la lista de deseos");
    loadWishlist();
  };
}

function removeFromWishlist(id) {
  const transaction = db.transaction(["wishlist"], "readwrite");
  const store = transaction.objectStore("wishlist");
  store.delete(id).onsuccess = function () {
    loadWishlist();
  };
}

function updateMoviePriority(id, watchNow) {
  const transaction = db.transaction(["wishlist"], "readwrite");
  const store = transaction.objectStore("wishlist");
  const request = store.get(id);

  request.onsuccess = function () {
    const movie = request.result;
    movie.watchNow = watchNow;
    store.put(movie).onsuccess = function () {
      console.log("Prioridad de visualización actualizada");
      loadWishlist(); // Recargar la lista para reflejar el cambio
    };
  };
}

function loadWishlist() {
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
        <option value="Alta" ${movie.priority === "Alta" ? "selected" : ""}>Alta</option>
        <option value="Baja" ${movie.priority === "Baja" ? "selected" : ""}>Baja</option>
      `;
      prioritySelect.onchange = () => updateMoviePriority(movie.id, prioritySelect.value);
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




function updateMoviePriority(id, priority) {
  const transaction = db.transaction(["wishlist"], "readwrite");
  const store = transaction.objectStore("wishlist");
  const request = store.get(id);

  request.onsuccess = function () {
    const movie = request.result;
    movie.priority = priority;
    store.put(movie).onsuccess = function () {
      console.log("Prioridad actualizada con éxito");
      loadWishlist();
    };
  };
}

const URL_PATH = "https://api.themoviedb.org";
const API_KEY = "a8cf93c6f0b9e3d858ab64d82c2a51ab";

const searchMovies = async () => {
  const textSearch = document.getElementById("search-movie").value;

  // Limpia las tarjetas existentes si el texto de búsqueda es menos de 3 caracteres
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
            <button onclick='addToWishlist({id: "${id}", title: "${title.replace(
      /'/g,
      "\\'"
    )}", watchNow: false})'
                    class="btn btn-primary mt-auto">Añadir a lista de deseos</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
  });
  document.getElementsByClassName("list-cards-search")[0].innerHTML = html;
};

const getMovies = (textSerach) => {
  const url = `${URL_PATH}/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${textSerach}&page=1&include_adult=true`;

  return fetch(url)
    .then((response) => response.json())
    .then((result) => result.results)
    .catch((error) => console.log(error));
};
document.addEventListener("DOMContentLoaded", function () {
  initDb();
});
