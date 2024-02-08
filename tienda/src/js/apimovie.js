const URL_PATH = "https://api.themoviedb.org";
const API_KEY = "a8cf93c6f0b9e3d858ab64d82c2a51ab";

document.addEventListener("DOMContentLoaded", () => {
  renderPopularMovies(1);
});

export const getPopularMovies = async (page) => {
  const moviesUrl = `${URL_PATH}/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;

  const [moviesResponse] = await Promise.all([
    fetch(moviesUrl).then((response) => response.json()),
  ]);

  // Combine movie data with genres
  const moviesWithGenres = moviesResponse.results.map(async (movie) => {
    const genresUrl = `${URL_PATH}/3/movie/${movie.id}?api_key=${API_KEY}&language=es-ES`;
    const videosUrl = `${URL_PATH}/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`;

    const [genresResponse, videosResponse] = await Promise.all([
      fetch(genresUrl).then((response) => response.json()),
      fetch(videosUrl).then((response) => response.json()),
    ]);

    const genresMap = {};
    genresResponse.genres.forEach((genre) => {
      genresMap[genre.id] = genre.name;
    });

    return {
      ...movie,
      genres: movie.genre_ids.map(
        (genreId) => genresMap[genreId] || "NOT FOUND"
      ),
      videos: videosResponse.results,
    };
  });

  return Promise.all(moviesWithGenres);
};

export const renderPopularMovies = async (page) => {
  const movies = await getPopularMovies(page);

  let html = "";
  for (let index = 0; index < 8; index++) {
    const movie = movies[index];
    const {
      id,
      title,
      poster_path,
      overview,
      release_date,
      genres,
      vote_average,
      videos,
    } = movie;
    const urlImage = `https://image.tmdb.org/t/p/w500${poster_path}`;
    const urlMoreInfo = `../pelis.html?id=${id}`;
    const trailerLink =
      videos.length > 0
        ? `https://www.youtube.com/watch?v=${videos[0].key}`
        : "#";

    html += `
      <div class="col-md-3 col-sm-6 col-12 mb-4">
        <div class="card h-100">
          <img src="${urlImage}" class="card-img-top img-fluid" style="object-fit: cover;" alt="${title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-center m-0">${title}</h5>
            <button type="button" class="btn btn-secondary mt-auto" data-bs-toggle="modal" data-bs-target="#movieModal${index}">
              Ver detalles
            </button>
          </div>
        </div>
        <!-- Modal con los detalles de la película -->
        <div class="modal fade" id="movieModal${index}" tabindex="-1" aria-labelledby="movieModalLabel${index}" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="movieModalLabel${index}">${title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>${overview}</p>
                <p>Fecha de lanzamiento: ${release_date}</p>
                <p>Géneros: ${genres.join(", ")}</p>
                <p>Nota: ${vote_average.toFixed(1)}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <a href="${trailerLink}" target="_blank" class="btn btn-primary">Ver más</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementsByClassName("list-cards")[0].innerHTML = html;
};
// para paginacion
window.renderPopularMovies = renderPopularMovies;
