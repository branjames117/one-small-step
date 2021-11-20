// Get search form element
const searchFormEl = document.getElementById('search-form');
searchFormEl.addEventListener('submit', function (e) {
  e.preventDefault();
  const queryStr = document.getElementById('query-input').value;
  getGallery(queryStr);
});

// Function to render to the DOM the results of an image query from the images.nasa.gov API

function getGallery(queryStr) {
  const url = 'https://images-api.nasa.gov/search?media_type=image&q=';

  // if query submitted, use it, else just look for black holes
  const query = queryStr || 'mexico';
  const params = { params: { q: query, media_type: 'image' } };

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

      // add search overview (query used + first image returned) for display in the recents section
      const recentSearchObj = {
        thumbnail: searchResults[0].thumbnail,
        largeImage: searchResults[0].largeImage,
        query,
      };

      // get copy of current localStorage object
      const localStorageObj = JSON.parse(localStorage.userInfo);

      let alreadyRecented = false;
      for (let i = 0; i < localStorageObj.recent.length; i++) {
        if (localStorageObj.recent[i].query == recentSearchObj.query) {
          alreadyRecented = true;
        }
      }

      // if recent search is not in there already
      if (!alreadyRecented) {
        // push latest search overview to array then save updated localStorage object
        localStorageObj.recent.push(recentSearchObj);
        // prevent array from exceeding 4 items
        if (localStorageObj.recent.length > 4) {
          localStorageObj.recent.shift();
        }
        localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
        // repopulate recent section
        populateRecents();
      }

      // TO DO - render the first 10 results at first, render the next 10 if user clicks "Load more..." or scrolls down, then the next 10, and so on... so that the browser isn't inundated with 100 image loads all at once (test this)

      // TO DO - add a click listener to the thumbnail image so that when the user clicks it the larger version of the image opens in a modal, complete with description, title, etc.
    })
    .catch((err) => console.error(err));
}

function populateRecents() {
  // get copy of current localStorage object
  const localStorageObj = JSON.parse(localStorage.userInfo);

  // go through array backwards and populate placeholder containers in index.html
  localStorageObj.recent
    .slice()
    .reverse()
    .forEach((search, idx) => {
      // title first
      document.querySelector(
        `#recent-search-container-${idx + 1} h3 a`
      ).textContent = '"' + search.query + '"';
      document
        .querySelector(`#recent-search-container-${idx + 1} h3 a`)
        .addEventListener('click', () => {
          getGallery(search.query);
        });
      document.querySelector(
        `#recent-search-container-${idx + 1} h3 a`
      ).style.cursor = 'pointer';

      // image
      document.querySelector(`#recent-search-container-${idx + 1} a img`).src =
        search.thumbnail;
      document.querySelector(`#recent-search-container-${idx + 1} a img`).alt =
        search.query;
      document.querySelector(
        `#recent-search-container-${idx + 1} a img`
      ).title = search.query;

      // link to hd image
      document.querySelector(`#recent-search-container-${idx + 1} > a`).href =
        search.largeImage;
    });
}

// on page load, populate recent section
populateRecents();
