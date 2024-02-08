let map, infoWindow;
let lastLocation = null; // Variable para almacenar la última ubicación

// FUNCION PARA MOSTRAR EL SPINNER Y ABRIR EL MODAL
window.showSpinnerAndOpenModal = function () {
  const btnOpenModal = document.getElementById("btnOpenModal");
  const spinnerIcon = document.getElementById("spinnerIcon");
  spinnerIcon.classList.remove("d-none");
  btnOpenModal.disabled = true;
  setTimeout(() => {
    spinnerIcon.classList.add("d-none");
    btnOpenModal.disabled = false;
    $('#locationModal').modal('show');
    initMap();
  }, 2000);
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6,
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");
  locationButton.textContent = "Obtener ubicación";
  locationButton.classList.add("btn", "btn-primary", "btn-sm", "mt-3", "ms-5");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);

          // Dibuja un círculo alrededor de la ubicación actual
          const circle = new google.maps.Circle({
            strokeColor: "#FFFF00",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FFFF00",
            fillOpacity: 0.35,
            map,
            center: pos,
            radius: position.coords.accuracy,
          });

          const geocoder = new google.maps.Geocoder();
          geocodeLatLng(geocoder, map, infoWindow, pos);

          saveLocation(pos); // Guarda la última ubicación
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function openModal() {
  const modal = document.getElementById("locationModal");
  modal.style.display = "block"; // Muestra el modal
  initMap(); // Inicializa o actualiza el mapa
}

function closeModal() {
  const modal = document.getElementById("locationModal");
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", (event) => {
  const modalElement = document.getElementById("locationModal");
  modalElement.addEventListener("shown.bs.modal", function (event) {
    initMap(); // Inicializa o actualiza el mapa cuando el modal se muestra
  });
});

function saveLocation(pos) {
  lastLocation = pos; // Guarda la última ubicación
  localStorage.setItem("lastLocation", JSON.stringify(lastLocation)); // Guarda en localStorage
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

