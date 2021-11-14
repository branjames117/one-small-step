// Function to render to the DOM the results of an image query from the images.nasa.gov API

(function () {
  const API_URL = 'https://images-api.nasa.gov/search?media_type=image&q=';
  const demoQuery = 'black hole';

  function openImage(NASA_ID) {
    fetch('https://images-api.nasa.gov/asset/' + NASA_ID).then((res) => {
      res.json().then((data) => {
        console.log(data);
      });
    });
  }

  fetch(API_URL + demoQuery).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        // data object contains an object called collection, which contains a property called items, which is an array of 100 items. Each of these items points to a manifest, which must be called in a separate API request, using its nasa_id (as accessed below). The manifest is a JSON file with references to each version of the image.
        console.log(data.collection.items[0].data[0]);
        const NASA_ID = data.collection.items[0].data[0].nasa_id;
        openImage(NASA_ID);
      });
    } else {
      console.log('Error receiving data from API.');
    }
  });
})();
