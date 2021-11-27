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

  // grab the gallery container
  const galleryContainer = document.querySelector('#gallery-container');

  axios
    .get(url, params)
    .then((res) => {
      // scroll to top
      scrollToPos();

      // empty array where search results will be stored
      const searchResults = [];

      // clear out previous results
      clearSection('#gallery-container');

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
          nasa_id: searchResults[0].nasa_id,
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
        searchResults.forEach((image) => {
          // check if image exists in favorites
          let favorited = false;
          localStorageObj.favorites.forEach((favorite) => {
            if (favorite.nasa_id === image.nasa_id) {
              favorited = true;
            }
          });

          // create the elements
          const divEl = document.createElement('div');
          divEl.classList = 'grid gap-y-4 inline-block rounded-lg p-2';

          const h3El = document.createElement('h3');
          const buttonEl = document.createElement('button');
          // if image is in favorites, fill out the star, otherwise, make it hollow
          buttonEl.textContent = favorited ? '★' : '☆';
          buttonEl.classList = 'pr-2';

          // add event listener to Favorite button
          buttonEl.imageObj = {
            title: image.title,
            description: image.description,
            thumbnail: image.thumbnail,
            manifest: image.manifest,
            nasa_id: image.nasa_id,
          };
          buttonEl.addEventListener('click', toggleFavorite);

          // set the title of each grid item, cutting it off if title extends beyond 75 chars
          const spanEl = document.createElement('span');
          spanEl.textContent =
            image.title.length > 75
              ? image.title.substr(0, 75) + '...'
              : image.title;
          spanEl.textContent.replace('_', ' ');

          h3El.append(buttonEl, spanEl);

          const aEl = document.createElement('a');
          aEl.classList = 'grid justify-items-center align-top';
          // set the URL link
          aEl.addEventListener('click', () => {
            getImageFromManifest(image, 'gallery-results-section');
          });
          // set the image as thumbnail
          const imgEl = document.createElement('img');
          imgEl.src = image.thumbnail;
          imgEl.title = image.description;
          imgEl.alt = image.description;
          imgEl.style.cursor = 'pointer';
          imgEl.setAttribute('width', '95%');

          aEl.append(imgEl);

          // if keywords list is only one item as some results return, break it apart
          if (image.keywords && image.keywords.length === 1) {
            image.keywords = image.keywords[0].split('; ');
          }

          // populate keywords list if keywords exist
          const ulEl = document.createElement('ul');
          if (image.keywords && image.keywords.length === 1) {
            image.keywords = image.keywords[0].split(', ');
          }
          if (image.keywords) {
            image.keywords.slice(0, 5).forEach((keyword) => {
              const keywordEl = document.createElement('li');
              keywordEl.textContent = keyword;
              keywordEl.style.cursor = 'pointer';
              keywordEl.classList = 'hover:bg-gray-800 bg-opacity-50';
              keywordEl.addEventListener('click', (e) => {
                getGallery(e.target.textContent);
              });
              ulEl.append(keywordEl);
            });
          }

          // put it all together
          divEl.append(h3El, aEl, ulEl);
          galleryContainer.append(divEl);
        });
      } else {
        document.querySelector(
          '#gallery-results-section > h2'
        ).textContent = `No results for: "${queryStr}"`;
      }
    })
    .catch((err) => {
      document.querySelector(
        '#gallery-results-section > h2'
      ).textContent = `No results for: "${queryStr}"`;
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
        getImageFromManifest(search, 'gallery-results-section');
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
