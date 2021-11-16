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

      console.log(res.data);

      // API call returns an array of 100 items
      // convert their array into an array of objects with only the data we want to populate our gallery with
      res.data.collection.items.forEach((item) => {
        const image = {
          description: item.data[0].description,
          keywords: item.data[0].keywords,
          nasa_id: item.data[0].nasa_id,
          title: item.data[0].title,
          thumbnail: item.links[0].href,
        };
        searchResults.push(image);
      });

      // check that we got the data we want
      console.log(searchResults[0]);

      // TO DO - when a successful search is performed, store the query terms and data about the first image thumbnail returned in localStorage for retrieval in the "Recent Searches" section

      // TO DO - render the first 10 results at first, render the next 10 if user clicks "Load more...", then the next 10, and so on... so that the browser isn't inundated with 100 image loads all at once (test this).

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
        // link to medium-sized image to be displayed in our large modal after thumbnail is clicked
        const mediumURL = res.data.collection.items[2].href;

        // TO DO - render the larger, closable modal with the image and info displayed
      })
      .catch((err) => console.error(err));
  }
})();
