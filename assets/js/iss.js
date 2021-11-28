// grab all elements needed
let latitudeText = document.querySelector('.latitude');
let longitudeText = document.querySelector('.longitude');
let timeText = document.querySelector('.time');
let speedText = document.querySelector('.speed');
let altitudeText = document.querySelector('.altitude');
let visibilityText = document.querySelector('.visibility');

/* default latitude and longitude. Here lat and long is for "Nashville" */
let lat = 36.174465;
let long = -86.76796;
let zoomLevel = 10;

// set iss.png image as Marker
const icon = L.icon({
  iconUrl: 'assets/img/iss.png',
  iconSize: [90, 45],
  iconAnchor: [25, 94],
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
map.locate({setView: true, maxZoom: 16});


// listen for screen resize events
window.addEventListener('resize', function(event){
  // get the width of the screen after the resize event
  var width = document.documentElement.clientWidth;
  // tablets are between 768 and 922 pixels wide
  // phones are less than 768 pixels wide
  if (width < 768) {
      // set the zoom level to 10
      map.setZoom(10);
  }  else {
      // set the zoom level to 8
      map.setZoom(8);
  }
});

// adding the Marker to map
const marker = L.marker([lat, long], { icon: icon }).addTo(map);

// findISS() function definition
function findISS() {
  fetch('https://api.wheretheiss.at/v1/satellites/25544/')
    .then((response) => response.json())
    .then((data) => {
      lat = data.latitude.toFixed(2);
      long = data.longitude.toFixed(2);

      // convert seconds to milliseconds, then format Date
      const timestamp = new Date(data.timestamp * 1000).toUTCString();
      const speed = data.velocity.toFixed(2);
      const altitude = data.altitude.toFixed(2);
      const visibility = data.visibility;

      // call updateISS() function to update things
      updateISS(lat, long, timestamp, speed, altitude, visibility);
    })
    .catch((e) => console.error(e));
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
