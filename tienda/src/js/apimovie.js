const URL_PATH = "https://api.themoviedb.org";
const API_KEY = "a8cf93c6f0b9e3d858ab64d82c2a51ab";

document.addEventListener("DOMContentLoaded", () => {
  renderPopularMovies(1);
});

export const getPopularMovies = (page) => {
  const url = `${URL_PATH}/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;

  return fetch(url)
    .then((response) => response.json())
    .then((result) => result.results)
    .catch((error) => console.log(error));
};

export const renderPopularMovies = async (page) => {
  const movies = await getPopularMovies(page);

  let html = "";
  movies.slice(0, 8).forEach((movie) => {
    // Solo toma los primeros 8 elementos
    const { id, title, poster_path } = movie;
    const urlImage = `https://image.tmdb.org/t/p/w500${poster_path}`;
    const urlMoreInfo = `../pelis.html?id=${id}`;

    html += `
        <div class="col-md-3 col-sm-6 col-12 mb-4">
          <a href="${urlMoreInfo}" class="card h-100">
            <div class="image-container" style="height: 25rem; overflow: hidden;">
              <img src="${urlImage}" class="card-img-top img-fluid" style="object-fit: cover;" alt="${title}">
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-center m-0">${title}</h5>
            </div>
          </a>
        </div>
      `;
  });
  document.getElementsByClassName("list-cards")[0].innerHTML = html;
};
