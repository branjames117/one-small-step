// Function to render to the DOM the results of an image query from the images.nasa.gov API

function getGallery(query) {
  console.log(query);
  const url = 'https://images-api.nasa.gov/search?media_type=image&q=';

  // if query submitted, use it, else just look for black holes
  const demoQuery = query || 'black hole';
  const params = { params: { q: demoQuery, media_type: 'image' } };

  axios
    .get(url, params)
    .then((res) => {
      // empty array where search results will be stored
      const searchResults = [];

      // API call returns an array of 100 items
      // convert their array into an array of objects with only the data we want to populate our gallery with
      res.data.collection.items.forEach((item) => {
        const image = {
          description: item.data[0].description,
          keywords: item.data[0].keywords,
          nasa_id: item.data[0].nasa_id,
          title: item.data[0].title,
          thumbnail: item.links[0].href,
          mediumImage: item.links[0].href.replace('thumb', 'medium'),
          largeImage: item.links[0].href.replace('thumb', 'large'),
        };
        searchResults.push(image);
      });

      // check that we got the data we want
      console.log(
        'example obj stored in searchResults arr from gallery API: ',
        searchResults[0]
      );

      // TO DO - when a successful search is performed, store the query terms and data about the first image thumbnail returned in localStorage for retrieval in the "Recent Searches" section

      // TO DO - render the first 10 results at first, render the next 10 if user clicks "Load more..." or scrolls down, then the next 10, and so on... so that the browser isn't inundated with 100 image loads all at once (test this)

      // TO DO - add a click listener to the thumbnail image so that when the user clicks it the larger version of the image opens in a modal, complete with description, title, etc.
    })
    .catch((err) => console.error(err));
}

getGallery();
