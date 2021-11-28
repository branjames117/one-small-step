// grab all elements needed
let latitudeText = document.querySelector('#latitude');
let longitudeText = document.querySelector('#longitude');
let timeText = document.querySelector('#time');
let speedText = document.querySelector('#speed');
let altitudeText = document.querySelector('#altitude');
let visibilityText = document.querySelector('#visibility');

/* default latitude and longitude. Here lat and long is for "Nashville" */
let lat = 36.174465;
let long = -86.76796;
let zoomLevel = 4;

// set iss.png image as Marker
const icon = L.icon({
  iconUrl: 'assets/img/crosshair.png',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [20, -86],
});

// drawing map interface on #map-div
const map = L.map('map-div').setView([lat, long], zoomLevel);

// add map tiles from Mapbox's Static Tiles API
L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      'pk.eyJ1IjoicG1hbm5pODciLCJhIjoiY2t3MzJ2ZmJpN25hNDJubnVweHJmaDhoNyJ9.o-l9gH4kqCdVq6hyzwT7ow',
  }
).addTo(map);

// adding the Marker to map
const marker = L.marker([lat, long], { icon: icon }).addTo(map);

// findISS() function definition
function findISS() {
  axios
    .get('https://api.wheretheiss.at/v1/satellites/25544/')
    .then((res) => {
      // Hide API error element on successful request
      document.querySelector('#iss-error').classList.add('hidden');
      lat = res.data.latitude.toFixed(2);
      long = res.data.longitude.toFixed(2);

      // convert seconds to milliseconds, then format Date
      const timestamp = new Date(res.data.timestamp * 1000).toUTCString();
      const speed = res.data.velocity.toFixed(2);
      const altitude = res.data.altitude.toFixed(2);
      const visibility = res.data.visibility;

      // call updateISS() function to update things
      updateISS(lat, long, timestamp, speed, altitude, visibility);
    })
    .catch((e) =>
      // Reveal API error element on failed request
      document.querySelector('#iss-error').classList.remove('hidden')
    );
}

// updateISS() function definition
function updateISS(lat, long, timestamp, speed, altitude, visibility) {
  marker.setLatLng([lat, long]);
  map.setView([lat, long]);
  // updates other element's value
  latitudeText.innerText = lat;
  longitudeText.innerText = long;
  timeText.innerText = timestamp;
  speedText.innerText = `${speed} km/h`;
  altitudeText.innerText = `${altitude} km`;
  visibilityText.innerText = visibility;
}

/* call findISS() initially to immediately set the ISS location */
findISS();

// call findISS() for every 2 seconds
setInterval(findISS, 2000);
