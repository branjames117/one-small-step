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
      renderSection('gallery-results-section');

      // attempt to render results only if results are returned
      if (res.data.collection.items.length > 0) {
        // API call returns an array of 100 items
        // convert their array into an array of objects with only the data we want to populate our gallery with
        res.data.collection.items.forEach((item) => {
          const image = {
            description: item.data[0].description,
            keywords: item.data[0].keywords,
            title: item.data[0].title,
            nasa_id: item.data[0].nasa_id,
            thumbnail: item.links[0].href,
            manifest: item.href,
          };
          searchResults.push(image);
        });

        // add search overview (query used + first image returned) for display in the recents section
        const recentSearchObj = {
          thumbnail: searchResults[0].thumbnail,
          manifest: searchResults[0].manifest,
          description: searchResults[0].description,
          title: searchResults[0].title,
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
              if (favorite.nasa_id === image.nasa_id) {
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
              nasa_id: image.nasa_id,
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
                getImageFromManifest(image);
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
              image.keywords.slice(0, 3).forEach((keyword) => {
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

  // clear current recents section
  clearSection('#recents-container');

  const recentsContainer = document.querySelector('#recents-container');

  // go through array backwards and build containers in the recent searches section
  localStorageObj.recent
    .slice()
    .reverse()
    .forEach((search, idx) => {
      const recentContainer = document.createElement('div');
      recentContainer.classList = 'grid gap-y-4 inline-block rounded-lg p-2';

      // search query element
      const h3El = document.createElement('h3');
      const aEl = document.createElement('a');
      aEl.textContent = '"' + search.query + '"';
      aEl.style.cursor = 'pointer';
      aEl.addEventListener('click', () => {
        getGallery(search.query);
      });
      h3El.append(aEl);

      // image element
      const imgAEl = document.createElement('a');
      imgAEl.classList = 'grid justify-items-center';
      imgAEl.style.cursor = 'pointer';
      imgAEl.addEventListener('click', () => {
        getImageFromManifest(search);
      });
      const imgEl = document.createElement('img');
      imgEl.classList = 'rounded-lg';
      imgEl.alt = search.description;
      imgEl.title = search.description;
      imgEl.setAttribute('height', '60%');
      imgEl.setAttribute('width', '60%');
      imgEl.src = search.thumbnail;

      imgAEl.append(imgEl);

      // put it all together
      recentContainer.append(h3El, imgAEl);

      // append to recents container
      recentsContainer.append(recentContainer);
    });
}

// add click listener to toggle display recent searches section
document
  .querySelector('#view-recent-searches-toggle')
  .addEventListener('click', () => {
    const recentSearchEl = document.querySelector('aside');
    const recentSearchButtonEl = document.querySelector(
      '#view-recent-searches-toggle'
    );
    recentSearchButtonEl.textContent =
      recentSearchButtonEl.textContent === 'View Recent Searches'
        ? 'Close Recent Searches'
        : 'View Recent Searches';
    recentSearchEl.classList.toggle('hidden');
  });

// on page load, populate recent section
populateRecents();
