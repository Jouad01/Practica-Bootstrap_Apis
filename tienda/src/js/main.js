import * as bootstrap from "../bootstrap-5.3.2/js/index.umd";

import "../bootstrap-5.3.2/scss/bootstrap.scss";

import { getPopularMovies, renderPopularMovies } from "./apimovie";

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

