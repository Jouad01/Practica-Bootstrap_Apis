let map, infoWindow;
let lastLocation = null; // Variable para almacenar la ultima ubicación

// FUNCION PARA MOSTRAR EL SPINNER Y ABRIR EL MODAL
window.showSpinnerAndOpenModal = function () {
  const btnOpenModal = document.getElementById("btnOpenModal");
  const spinnerIcon = document.getElementById("spinnerIcon");
  spinnerIcon.classList.remove("d-none");
  btnOpenModal.disabled = true;
  setTimeout(() => {
    spinnerIcon.classList.add("d-none");
    btnOpenModal.disabled = false;
    $("#locationModal").modal("show");
    initMap();
  }, 500);
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6,
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");
  locationButton.innerHTML = `Obtener ubicación <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>`;
  locationButton.classList.add("btn", "btn-primary", "btn-sm", "mt-3", "ms-5");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

  const spinnerIcon = locationButton.querySelector("span.spinner-border");

  locationButton.addEventListener("click", () => {
    spinnerIcon.classList.remove("d-none");
    locationButton.disabled = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK" && results[0]) {
              infoWindow.setPosition(pos);
              infoWindow.setContent(results[0].formatted_address);
              infoWindow.open(map);
            } else {
              infoWindow.setPosition(pos);
              infoWindow.setContent(
                "No se pudo obtener la dirección de esta ubicación."
              );
              infoWindow.open(map);
            }
            map.setCenter(pos);

            new google.maps.Circle({
              strokeColor: "#FFFF00",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FFFF00",
              fillOpacity: 0.35,
              map,
              center: pos,
              radius: position.coords.accuracy,
            });

            // Ocultar el spinner y habilitar después de obtener la ubicación y la dirección
            spinnerIcon.classList.add("d-none");
            locationButton.disabled = false;
          });

          saveLocation(pos); 
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
          spinnerIcon.classList.add("d-none");
          locationButton.disabled = false;
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
      spinnerIcon.classList.add("d-none");
      locationButton.disabled = false;
    }
  });
}

function openModal() {
  const modal = document.getElementById("locationModal");
  modal.style.display = "block"; // muestra el modal
  initMap(); 
}

function closeModal() {
  const modal = document.getElementById("locationModal");
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", (event) => {
  const modalElement = document.getElementById("locationModal");
  modalElement.addEventListener("shown.bs.modal", function (event) {
    initMap(); 
  });
});

function saveLocation(pos) {
  lastLocation = pos;  
  // Guarda en localStorage
  localStorage.setItem("lastLocation", JSON.stringify(lastLocation)); 
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function geocodeLatLng(geocoder, map, infowindow, latlng) {
  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map);
      } else {
        window.alert("No se encontraron resultados");
      }
    } else {
      window.alert("Falló la geocodificación debido a: " + status);
    }
  });
}

window.initMap = initMap;

export {
  initMap,
  saveLocation,
  handleLocationError,
  geocodeLatLng,
  openModal,
  closeModal,
};
