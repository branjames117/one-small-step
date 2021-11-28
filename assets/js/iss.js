// grab all elements needed
let latitudeText = document.querySelector('#latitude');
let longitudeText = document.querySelector('#longitude');
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
      const speed = res.data.velocity.toFixed(2);
      const altitude = res.data.altitude.toFixed(2);
      const visibility = res.data.visibility;

      // call updateISS() function to update things
      updateISS(lat, long, speed, altitude, visibility);
    })
    .catch((e) =>
      // Reveal API error element on failed request
      document.querySelector('#iss-error').classList.remove('hidden')
    );
}

// updateISS() function definition
function updateISS(lat, long, speed, altitude, visibility) {
  marker.setLatLng([lat, long]);
  map.setView([lat, long]);
  // updates other element's value
  latitudeText.innerText = lat;
  longitudeText.innerText = long;
  speedText.innerText = speed;
  altitudeText.innerText = altitude;
  visibilityText.innerText = visibility;
}

function findAstronauts() {
  // grab the list of people currently in space from open-notify API
  axios.get('https://api.open-notify.org/astros.json').then((res) => {
    const peopleInSpace = res.data.people;
    // filter for astronauts on board the ISS
    const peopleOnISS = peopleInSpace.filter(
      (person) => person.craft === 'ISS'
    );

    // grab the container
    const astronautsListEl = document.querySelector('#astronauts-list');

    // create a list item and append to DOM for each astronaut
    peopleOnISS.forEach((astronaut) => {
      const itemEl = document.createElement('li');
      itemEl.textContent = astronaut.name;
      itemEl.style.cursor = 'pointer';
      itemEl.classList = 'hover:bg-gray-800';
      // add event listener to each to do a search request
      itemEl.addEventListener('click', () => {
        getGallery(astronaut.name);
      });
      astronautsListEl.append(itemEl);
    });
  });
}

// Call findISS() initially to immediately set the ISS location
findISS();

// Find astronauts
findAstronauts();

// Call findISS() for every 2 seconds
setInterval(findISS, 2000);
