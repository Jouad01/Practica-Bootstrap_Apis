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
    const wishlist = document.getElementById("wishlist");
    wishlist.innerHTML = "";

    request.result.forEach((movie) => {
      const item = document.createElement("li");
      item.className =
        "list-group-item d-flex justify-content-between align-items-center";

      const titleSpan = document.createElement("span");
      titleSpan.textContent = movie.title;

      const radioAlta = document.createElement("input");
      radioAlta.type = "radio";
      radioAlta.name = "priority-" + movie.id;
      radioAlta.value = "Alta";
      radioAlta.checked = movie.priority === "Alta";
      const labelAlta = document.createElement("label");
      labelAlta.textContent = "Ver Ahora";

      const radioBaja = document.createElement("input");
      radioBaja.type = "radio";
      radioBaja.name = "priority-" + movie.id;
      radioBaja.value = "Baja";
      radioBaja.checked =
        movie.priority === "Baja" || movie.priority === undefined; // Por defecto a Baja si no está definido
      const labelBaja = document.createElement("label");
      labelBaja.textContent = "Ver Más Tarde";

      radioAlta.onchange = () => updateMoviePriority(movie.id, "Alta");
      radioBaja.onchange = () => updateMoviePriority(movie.id, "Baja");

      item.appendChild(titleSpan);
      item.appendChild(radioAlta);
      item.appendChild(labelAlta);
      item.appendChild(radioBaja);
      item.appendChild(labelBaja);
      wishlist.appendChild(item);
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
