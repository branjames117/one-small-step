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

  // trim extra spaces from query
  const query = queryStr.trim();
  const params = { params: { q: query, media_type: 'image' } };

  // if query is blank, empty the search bar and abort search
  if (query.length === 0) {
    document.getElementById('query-input').value = '';
    return;
  }

  // clear out search input field
  document.getElementById('query-input').value = '';

  axios
    .get(url, params)
    .then((res) => {
      // empty array where search results will be stored
      const searchResults = [];

      // make visible the results section
      document
        .querySelector('#gallery-results-section')
        .classList.remove('hidden');

      // attempt to render results only if results are returned
      if (res.data.collection.items.length > 0) {
        // API call returns an array of 100 items
        // convert their array into an array of objects with only the data we want to populate our gallery with
        res.data.collection.items.forEach((item) => {
          const image = {
            description: item.data[0].description,
            keywords: item.data[0].keywords,
            title: item.data[0].title,
            thumbnail: item.links[0].href,
            manifest: item.href,
          };
          searchResults.push(image);
        });

        // add search overview (query used + first image returned) for display in the recents section
        const recentSearchObj = {
          thumbnail: searchResults[0].thumbnail,
          query,
        };

        // get copy of current localStorage object
        const localStorageObj = grabLocalStorage();

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

        // change the h2 to include search term
        document.querySelector(
          '#gallery-results-section > h2'
        ).textContent = `Search Results for: "${queryStr}"`;

        // render only the first 8 results to the temporary holding containers
        searchResults.forEach((image, idx) => {
          if (idx < 8) {
            // check if image exists in favorites
            let favorited = false;
            localStorageObj.favorites.forEach((favorite) => {
              if (favorite.title === image.title) {
                favorited = true;
              }
            });

            // if image is in favorites, fill out the star, otherwise, make it hollow
            document.querySelector(
              `#search-result-${idx + 1} > h3 > button`
            ).textContent = favorited ? '★' : '☆';

            // add event listener to Favorite button
            document.querySelector(
              `#search-result-${idx + 1} > h3 > button`
            ).imageObj = {
              title: image.title,
              description: image.description,
              thumbnail: image.thumbnail,
              manifest: image.manifest,
            };
            document
              .querySelector(`#search-result-${idx + 1} > h3 > button`)
              .addEventListener('click', toggleFavorite);

            // set the title of each grid item, cutting it off if title extends beyond 75 chars
            document.querySelector(
              `#search-result-${idx + 1} > h3 > span`
            ).textContent =
              image.title.length > 75
                ? image.title.substr(0, 75) + '...'
                : image.title;
            // set the URL link
            document
              .querySelector(`#search-result-${idx + 1} > a`)
              .addEventListener('click', () => {
                console.log('clicked');
              });
            // set the image as thumbnail
            document.querySelector(`#search-result-${idx + 1} > a > img`).src =
              image.thumbnail;
            // if keywords list is only one item as some results return, break it apart
            if (image.keywords && image.keywords.length === 1) {
              image.keywords = image.keywords[0].split('; ');
            }
            // clear out old keywords from container
            document.querySelector(`#search-result-${idx + 1} > ul`).innerHTML =
              '';
            // populate keywords list if keywords exist
            if (image.keywords) {
              image.keywords.forEach((keyword) => {
                const keywordEl = document.createElement('li');
                keywordEl.textContent = keyword;
                keywordEl.style.cursor = 'pointer';
                keywordEl.addEventListener('click', (e) => {
                  getGallery(e.target.textContent);
                });
                document
                  .querySelector(`#search-result-${idx + 1} > ul`)
                  .append(keywordEl);
              });
            }
          }
        });

        // TO DO - add a click listener to the thumbnail image so that when the user clicks it the larger version of the image opens in a modal, complete with description, title, etc.
      } else {
        // change the h2 to report no results
        document.querySelector(
          '#gallery-results-section > h2'
        ).textContent = `Search Results for: "${queryStr}." NO IMAGES FOUND.`;
      }

      // add event listener to close search results button
      document
        .querySelector('#gallery-results-section > h3')
        .addEventListener('click', () => {
          document
            .querySelector('#gallery-results-section')
            .classList.add('hidden');
        });
    })
    .catch((err) => {
      document.querySelector(
        '#gallery-results-section > h2'
      ).textContent = `Search Results for: "${queryStr}." ERROR: ${err}.`;
      console.error(err);
    });
}

function populateRecents() {
  // get copy of current localStorage object
  const localStorageObj = grabLocalStorage();

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

      // link to trigger search again
      document
        .querySelector(`#recent-search-container-${idx + 1} > a`)
        .addEventListener('click', () => {
          getGallery(search.query);
        });
    });
}

// on page load, populate recent section
populateRecents();
