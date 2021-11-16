// Function to render to the DOM the results of an image query from the images.nasa.gov API

(function () {
  const url = 'https://images-api.nasa.gov/search?media_type=image&q=';
  const demoQuery = 'black hole';
  const params = { params: { q: demoQuery, media_type: 'image' } };

  axios
    .get(url, params)
    .then((res) => {
      // empty array where search results will be stored
      const searchResults = [];

      // API call returns an array of 100 items
      // convert their array into an array of objects with only the data we want
      res.data.collection.items.forEach((item) => {
        const image = {
          description: item.data[0].description,
          keywords: item.data[0].keywords,
          nasa_id: item.data[0].nasa_id,
          title: item.data[0].title,
        };
        searchResults.push(image);
      });

      // TO DO - when a successful search is performed, store the query terms and data about the first image returned in localStorage for retrieval in the "Recent Searches" section

      // TO DO - render the first 10 results at first, render the next 10 if user clicks "Load more...", then the next 10, and so on... Each "render" requires a separate API request per result since the URL to the image must first be pulled from the JSON manifest provided in the initial search

      // TO DO - add event listener to each image which sends the nasa_id of it to the openImage() function below, to then render the HD version of the image to our page (in a large closable modal)

      const NASA_ID = res.data.collection.items[0].data[0].nasa_id;
      openImage(NASA_ID);
    })
    .catch((err) => console.error(err));

  function openImage(NASA_ID) {
    const url = 'https://images-api.nasa.gov/asset/';

    axios
      .get(url + NASA_ID)
      .then((res) => {
        // link to thumbnail-sized image to be displayed in the gallery
        const thumbnailURL = res.data.collection.items[4].href;

        // link to medium-sized image to be displayed in our large modal after thumbnail is clicked
        const mediumURL = res.data.collection.items[2].href;
      })
      .catch((err) => console.error(err));
  }
})();
