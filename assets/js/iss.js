
// Grab all the Elements needed
let latitudeText = document.querySelector('.latitude');
let longtitudeText = document.querySelector('.longitude');
let timeText = document.querySelector('.time');
let speedText = document.querySelector('.speed');
let altitudeText = document.querySelector('.altitude');
let visibilityText = document.querySelector('.visibility');

/* default latitude and longitude. Here lat and long is for "Nashville" */

let lat = 36.174465;
let long = -86.767960;
let zoomlevel = 8;

// set iss.png image as Marker


// drawing map interface on #map-div
// L.map creates a leaflet map (ElementId of map-div)
// setView will return the map object and we are storing it on map const

const map = L.map('map-div').setView([lat, long], zoomLevel)


// add map tiles from Mapbox's Static Tiles API

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicG1hbm5pODciLCJhIjoiY2t3MzJxcHoxMDJ0bTJwbzhsZDg4b3I2diJ9.vVP4cng80EJ46GqwzrEoVg'
}).addTo(map);

// adding the Marker to map

const marker = L.marker([lat, long], { icon: icon }).addTo(map);


// findISS() function definition

function findISS() {
    fetch("https://api.wheretheiss.at/v1/satellites/25544")
        .then(response => response.json())
        .then(data => {
            lat = data.latitude.toFixed(2);
            long = data.longitude.toFixed(2);
            // convert seconds to milliseconds, then to UTC format
            const timestamp = new Date(data.timestamp * 1000).toUTCString();
            const speed = data.velocity.toFixed(2);
            const altitude = data.altitude.toFixed(2);
            const visibility = data.visibility;

            // call updateISS() function to update things

            updateISS(lat, long, timestamp, speed, altitude, visibility);
        })
        .catch(e => console.log(e));
}


/* call findISS() initially to immediately set the ISS location */


