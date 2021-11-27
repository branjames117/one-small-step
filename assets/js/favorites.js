// function to handle adding favorite to localstorage
function toggleFavorite(e) {
  // get data for image off of button element
  const imageObj = e.target.imageObj;

  // toggle star icon (empty for not favorited, solid for favorited)
  e.target.textContent = e.target.textContent == '★' ? '☆' : '★';

  // get copy of current localStorage object
  const localStorageObj = grabLocalStorage();

  // if favorites arr is empty, add imageObj to it
  if (localStorageObj.favorites.length === 0) {
    localStorageObj.favorites.push(imageObj);
    localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
    populateFavorites();
    return;
  }

  // if obj already exists in Favorites array, flag it for removal
  let exists = false;
  localStorageObj.favorites.forEach((favorite) => {
    if (favorite.nasa_id == imageObj.nasa_id) {
      exists = true;
    }
  });

  // remove flagged obj from array then update localstorage
  if (exists) {
    const newFavoritesArr = localStorageObj.favorites.filter(
      (obj) => obj.nasa_id !== imageObj.nasa_id
    );
    localStorageObj.favorites = newFavoritesArr;
    localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
    // or add obj to array and update local storage
  } else {
    // if obj does not exist in array, add it
    localStorageObj.favorites.push(imageObj);
    localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
  }

  // update favorites section
  populateFavorites();
}

// Add functionality to the "Clear Favorites" button
document
  .querySelector('#clear-favorites-button')
  .addEventListener('click', toggleModal);
// Add functionality to the "Confirm Delete" button
document.querySelector('#confirm-delete').addEventListener('click', () => {
  const localStorageObj = grabLocalStorage();
  localStorageObj.favorites = [];
  localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
  populateFavorites();
});

// Populate favorites section with favorited images

function populateFavorites() {
  const localStorageObj = grabLocalStorage();

  // clear out previous favorites
  clearSection('#favorites-container');

  const favoritesContainer = document.querySelector('#favorites-container');

  // if there are no favorites, reveal the H3 element advising user to add some and hide the "Clear Favorites" button...
  const noFavoritesEl = document.querySelector('#no-favorites');
  const clearFavoritesButtonEl = document.querySelector(
    '#clear-favorites-button'
  );
  if (localStorageObj.favorites.length === 0) {
    noFavoritesEl.classList.remove('hidden');
    clearFavoritesButtonEl.classList.add('hidden');
  } else {
    noFavoritesEl.classList.add('hidden');
    clearFavoritesButtonEl.classList.remove('hidden');
  }

  // add star functionality to the star in the above H3 element for fun...
  const noFavoritesStarEl = document.querySelector('#fun-star');
  noFavoritesStarEl.style.cursor = 'pointer';
  noFavoritesStarEl.addEventListener('click', () => {
    noFavoritesStarEl.textContent =
      noFavoritesStarEl.textContent === '☆' ? '★' : '☆';
  });

  // create the elements to display the favorites
  localStorageObj.favorites
    .slice()
    .reverse()
    .forEach((favorite) => {
      const divEl = document.createElement('div');
      divEl.classList = 'grid gap-y-4 inline-block rounded-lg p-2';

      const h3El = document.createElement('h3');
      const buttonEl = document.createElement('button');
      buttonEl.imageObj = {
        title: favorite.title,
        thumbnail: favorite.thumbnail,
        url: favorite.url,
        nasa_id: favorite.nasa_id,
        description: favorite.description,
      };
      buttonEl.addEventListener('click', toggleFavorite);
      buttonEl.textContent = '★';
      buttonEl.classList = 'pr-2';
      const spanEl = document.createElement('span');
      spanEl.textContent = favorite.title;
      h3El.append(buttonEl, spanEl);

      const aEl = document.createElement('a');
      aEl.classList = 'grid justify-items-center';
      aEl.addEventListener('click', () => {
        if (favorite.url) {
          getImageFromURL(favorite, 'favorites-section');
        } else if (favorite.manifest) {
          getImageFromManifest(favorite, 'favorites-section');
        }
      });
      const imgEl = document.createElement('img');
      imgEl.setAttribute('height', '100%');
      imgEl.setAttribute('width', '100%');
      imgEl.alt = favorite.title;
      imgEl.title = favorite.title;
      imgEl.src = favorite.thumbnail;
      imgEl.style.cursor = 'pointer';

      // put it all together
      aEl.append(imgEl);
      divEl.append(h3El, aEl);
      favoritesContainer.append(divEl);
    });
}

// Initial call
populateFavorites();
