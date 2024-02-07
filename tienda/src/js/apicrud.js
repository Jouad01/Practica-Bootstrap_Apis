let db;
const request = indexedDB.open("MyDatabase", 3);

request.onerror = function (event) {
    console.log("Error al abrir la base de datos", event);
};

request.onsuccess = function (event) {
    db = event.target.result;
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("wishlist")) {
        db.createObjectStore("wishlist", { keyPath: "id" });
    }
};



function addMovieToWishlist(movie) {
    const transaction = db.transaction(["wishlist"], "readwrite");
    const objectStore = transaction.objectStore("wishlist");
    objectStore.add(movie);
}

function updatePriorityInWishlist(id, nuevaPrioridad) {
    const transaction = db.transaction(["wishlist"], "readwrite");
    const objectStore = transaction.objectStore("wishlist");

    const getRequest = objectStore.get(id);

    getRequest.onsuccess = function (event) {
        const movie = event.target.result;

        if (movie) {
            movie.prioridad = nuevaPrioridad;
            objectStore.put(movie);
        }
    };
}


function getWishlistMovies(callback) {
    const transaction = db.transaction(["wishlist"], "readonly");
    const objectStore = transaction.objectStore("wishlist");
    const request = objectStore.getAll();
    request.onsuccess = function (event) {
        callback(event.target.result);
    };
}

function deleteMovieFromWishlist(id) {
    const transaction = db.transaction(["wishlist"], "readwrite");
    const objectStore = transaction.objectStore("wishlist");
    objectStore.delete(id);
}

const URL_PATH = "https://api.themoviedb.org";
const API_KEY = "a8cf93c6f0b9e3d858ab64d82c2a51ab";


document.addEventListener("DOMContentLoaded", () => {
    renderPopularMovies(1);
    document.getElementById("searchInput").addEventListener("keyup", function () {
        var searchValue = this.value.toLowerCase();
        var tableRows = document.querySelectorAll("#moviesTable tbody tr");

        // Desplazamiento automático hacia la tabla de películas
        if (searchValue.length > 0) {
            document.getElementById("moviesTable").scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }

        // Filtrado de las filas de la tabla según la búsqueda
        tableRows.forEach(function (row) {
            var titleText = row.cells[0].textContent.toLowerCase();
            if (titleText.indexOf(searchValue) > -1) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});
const getPopularMovies = async (page) => {
    const moviesUrl = `${URL_PATH}/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;
    return fetch(moviesUrl)
        .then((response) => response.json())
        .then((data) => {
            return { movies: data.results, totalPages: data.total_pages };
        });
};

function renderPagination(currentPage, totalPages) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Limpiar paginación existentes

    // las páginas que se mostrarán
    let startPage = 1;
    let endPage = Math.min(startPage + 3, totalPages); //  solo 3 páginas a partir de la página actual

    for (let i = startPage; i <= endPage; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.classList.add('btn', 'btn-primary');
        button.disabled = i === currentPage;
        button.onclick = function () {
            renderPopularMovies(i);
        };

        paginationDiv.appendChild(button);
    }
}


const renderPopularMovies = async (page) => {
    const { movies: apiMovies, totalPages } = await getPopularMovies(page);
    const moviesTableBody = document.querySelector("#moviesTable tbody");

    // Limpiar las celdas 
    const rows = moviesTableBody.getElementsByTagName("tr");
    while (rows.length > 0) {
        rows[0].parentNode.removeChild(rows[0]);
    }

    apiMovies.forEach((movie) => {
        let row = moviesTableBody.insertRow();

        // Celdas para detalles de la película
        row.insertCell().textContent = movie.title;
        row.insertCell().textContent = movie.release_date;
        row.insertCell().textContent = movie.vote_average.toFixed(1);

        // agregar a la lista de deseos
        let actionsCell = row.insertCell();
        let wishlistButton = document.createElement("button");
        wishlistButton.textContent = "Agregar a lista de deseos";
        // estilos de Bootstrap al botón
        wishlistButton.classList.add("btn", "btn-primary");
        wishlistButton.onclick = function () {
            addMovieToWishlist(movie);
        };
        actionsCell.appendChild(wishlistButton);
    });

    renderPagination(page, totalPages);
};



function loadAndRenderWishlist() {
    const wishlistTableBody = document
        .getElementById("wishlistTable")
        .getElementsByTagName("tbody")[0];
    wishlistTableBody.innerHTML = "";

    getWishlistMovies((movies) => {
        movies.forEach((movie) => {
            let row = wishlistTableBody.insertRow();

            // Título
            row.insertCell().textContent = movie.title;

            // Prioridad (Nueva columna)
            let prioridadCell = row.insertCell();
            prioridadCell.textContent = movie.prioridad;

            // Acciones
            let actionsCell = row.insertCell();
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("btn", "btn-danger");
            deleteButton.onclick = function () {
                deleteMovieFromWishlist(movie.id);
                row.remove();
            };
            actionsCell.appendChild(deleteButton);

            // Botones de radio para actualizar prioridad
            let radioCell = row.insertCell();
            let radioAlta = document.createElement("input");
            radioAlta.type = "radio";
            radioAlta.name = "prioridadRadio_" + movie.id;
            radioAlta.value = "Alta";
            radioAlta.checked = movie.prioridad === "Alta";
            radioAlta.onchange = function () {
                updatePriorityInWishlist(movie.id, "Alta");
            };
            radioCell.appendChild(radioAlta);
            radioCell.appendChild(document.createTextNode(" Alta "));

            let radioBaja = document.createElement("input");
            radioBaja.type = "radio";
            radioBaja.name = "prioridadRadio_" + movie.id;
            radioBaja.value = "Baja";
            radioBaja.checked = movie.prioridad === "Baja";
            radioBaja.onchange = function () {
                updatePriorityInWishlist(movie.id, "Baja");
            };
            radioCell.appendChild(radioBaja);
            radioCell.appendChild(document.createTextNode(" Baja"));
        });
    });
}


document.getElementById("showWishlist").addEventListener("click", () => {
    const wishlistModal = document.getElementById("wishlistModal");
    wishlistModal.style.display = "block";
    loadAndRenderWishlist();
});

// CODIGO PARA EL SPINNER

document.getElementById("showWishlist").addEventListener("click", function () {
    var spinner = this.querySelector('.spinner-border');
    spinner.classList.remove('d-none');

    setTimeout(function () {
        spinner.classList.add('d-none');
        $('#wishlistModal').modal('show');
    }, 2000);
});

// Ocultar el spinner cuando el modal se cierra
$('#wishlistModal').on('hidden.bs.modal', function () {
    var spinner = document.querySelector('#showWishlist .spinner-border');
    spinner.classList.add('d-none');
});

// Después de cargar y renderizar la lista de deseos
document.getElementById("updateAllPrioritiesBtn").addEventListener("click", function () {
    if (nuevaPrioridad) {
        getWishlistMovies((movies) => {
            movies.forEach((movie) => {
                updatePriorityInWishlist(movie.id, nuevaPrioridad);
            });

            // Vuelve a cargar y renderizar la lista de deseos
            loadAndRenderWishlist();
        });
    }
});

document.getElementById("updatePriorityBtn").addEventListener("click", function () {
    updatePrioritiesInWishlist();
});

// FUNCION PARA NIVEL PRIORIDAD
function updatePrioritiesInWishlist() {
    const rows = document.querySelectorAll("#wishlistTable tbody tr");

    rows.forEach((row) => {
        const movieId = row.dataset.movieId;
        const radioAlta = row.querySelector("input[type='radio'][value='Alta']");
        const radioBaja = row.querySelector("input[type='radio'][value='Baja']");

        if (radioAlta && radioBaja) {
            const newPriority = radioAlta.checked ? "Alta" : "Baja";
            updatePriorityInWishlist(movieId, newPriority);
        }
    });

    // Vuelve a cargar y renderizar la lista de deseos
    loadAndRenderWishlist();
}
