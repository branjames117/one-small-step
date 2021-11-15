// Function to render to the DOM the results of an image query from the images.nasa.gov API

(function () {
  const url = 'https://images-api.nasa.gov/search?media_type=image&q=';
  const demoQuery = 'black hole';
  const params = { params: { q: demoQuery, media_type: 'image' } };

  axios
    .get(url, params)
    .then((res) => {
      // data object contains an object called collection, which contains a property called items, which is an array of 100 items. Each of these items points to a manifest, which must be called in a separate API request, using its nasa_id (as accessed below). The manifest is a JSON file with references to each version of the image.
      console.log(
        'first item in obj returned from gallery based on query: ',
        res.data.collection.items[0].data[0]
      );
      const NASA_ID = res.data.collection.items[0].data[0].nasa_id;
      openImage(NASA_ID);
    })
    .catch((err) => console.log(err));

  function openImage(NASA_ID) {
    const url = 'https://images-api.nasa.gov/asset/';
    axios.get(url + NASA_ID).then((res) => {
      console.log('obj returned by /asset/NASA_ID: ', res);
    });
  }
})();
