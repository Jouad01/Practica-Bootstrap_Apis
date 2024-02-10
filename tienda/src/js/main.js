import * as bootstrap from "../bootstrap-5.3.2/js/index.umd";

import "../bootstrap-5.3.2/scss/bootstrap.scss";

import { getPopularMovies, renderPopularMovies } from "./apimovie";

import {
  initDb,
  addToWishlist,
  removeFromWishlist,
  updateMoviePriority,
  loadWishlist,
  searchMovies,
  getMovies,
  addEventListenersToButtons,
} from "./apicrud";
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-movie");
  if (searchInput) {
    searchInput.addEventListener("keyup", searchMovies);
  }
});

import {
  allowDrop,
  drag,
  drop,
  resetDragAndDrop,
  currentTrailerUrl,
} from "./apidragdrop";

document.addEventListener("DOMContentLoaded", () => {
  const dragItem = document.getElementById("drag4");
  const dropZone = document.getElementById("div1");

  if (dragItem) {
    dragItem.addEventListener("dragstart", drag);
  }

  if (dropZone) {
    dropZone.addEventListener("dragover", allowDrop);
    dropZone.addEventListener("drop", drop);
  }
});

// document.addEventListener("DOMContentLoaded", () => {
//   initializeDragDrop();
// });

import { initializeNavBar } from "./navbar";

document.addEventListener("DOMContentLoaded", function () {
  initializeNavBar();
  // initializeTrailerButtons();
});

import {
  initMap,
  saveLocation,
  loadLastLocations,
  showLastLocations,
  handleLocationError,
  geocodeLatLng,
  openModal,
  closeModal,
  showSpinnerAndOpenModal,
} from "./apigeolocation";
