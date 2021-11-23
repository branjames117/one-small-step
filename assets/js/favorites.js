// function to handle adding favorite to localstorage
function toggleFavorite(e) {
  // get data for image off of button element
  const imageObj = e.target.imageObj;
  console.log(imageObj);
  console.log('clicked');

  // toggle star icon (empty for not favorited, solid for favorited)
  e.target.textContent = e.target.textContent == '★' ? '☆' : '★';

  // get copy of current localStorage object
  const localStorageObj = grabLocalStorage();

  // if favorites arr is empty, add imageObj to it
  if (localStorageObj.favorites.length === 0) {
    localStorageObj.favorites.push(imageObj);
    localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
    return;
  }

  // if obj already exists in Favorites array, flag it for removal
  let exists = false;
  localStorageObj.favorites.forEach((favorite) => {
    if (favorite.title == imageObj.title) {
      exists = true;
    }
  });

  // remove flagged obj from array then update localstorage
  if (exists) {
    const newFavoritesArr = localStorageObj.favorites.filter(
      (obj) => obj.title !== imageObj.title
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

// Populate favorites section with favorited images

function populateFavorites() {
  const localStorageObj = grabLocalStorage();
  console.log(localStorageObj.favorites);

  localStorageObj.favorites
    .slice()
    .reverse()
    .forEach((favorite, idx) => {
      // title first
      document.querySelector(
        `#favorite-container-${idx + 1} h3 a`
      ).textContent = favorite.title;
      document.querySelector(`#favorite-container-${idx + 1} h3 a`).href =
        favorite.hdUrl;
      document.querySelector(
        `#favorite-container-${idx + 1} h3 a`
      ).style.cursor = 'pointer';

      // remove from favorites button
      document.querySelector(
        `#favorite-container-${idx + 1} h3 button`
      ).imageObj = {
        title: favorite.title,
        thumbnail: favorite.thumbnail,
        hdUrl: favorite.hdUrl,
      };

      document
        .querySelector(`#favorite-container-${idx + 1} h3 button`)
        .addEventListener('click', toggleFavorite);

      // image
      document.querySelector(`#favorite-container-${idx + 1} a img`).src =
        favorite.thumbnail;
      document.querySelector(`#favorite-container-${idx + 1} a img`).alt =
        favorite.title;
      document.querySelector(`#favorite-container-${idx + 1} a img`).title =
        favorite.title;

      // link to hd image
      document.querySelector(`#favorite-container-${idx + 1} > a`).href =
        favorite.hdUrl;
    });
}

// Initial call
populateFavorites();
