// function to clear a specified section of the DOM (delete all child elements to make way for a rerender) - must accept a CSS ID selector as argument, like '#news-section'

function clearSectionById(sectionId) {
  // validate that argument is formatted like an ID selector
  if (sectionId[0] == '#') {
    // grab the element to be cleared
    const parentEl = document.getElementById(sectionId);
    // if element is successfully located...
    if (parentEl) {
      // ... start removing the last child until there are no more children
      while (parentEl.lastChild) {
        parentEl.removeChild(parentEl.lastChild);
      }
    }
  }
}

// function to handle adding favorite to localstorage
function handleAddFavorite(e) {
  const imageObj = e.target.imageObj;

  // get copy of current localStorage object
  const localStorageObj = JSON.parse(localStorage.userInfo);

  // if favorites arr is empty, add imageObj to it
  if (localStorageObj.favorites.length === 0) {
    localStorageObj.favorites.push(imageObj);
    localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
    return;
  }

  // if obj already exists in array, don't add it again
  for (let i = 0; i < localStorageObj.favorites.length; i++) {
    if (localStorageObj.favorites[i].title == imageObj.title) {
      return;
    }
  }

  // if obj does not exist in array, push it to array
  localStorageObj.favorites.push(imageObj);
  localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
  return;
}

// function to handle removing favorite from localstorage
function handleRemoveFavorite(e) {
  const deleteByTitle = e.target.imageObj.title;

  // get copy of current localStorage object
  const localStorageObj = JSON.parse(localStorage.userInfo);

  // use filter to create a version of array without obj to be deleted
  const newFavoritesArr = localStorageObj.favorites.filter(
    (obj) => obj.title !== deleteByTitle
  );

  // update localstorage with new arr
  localStorageObj.favorites = newFavoritesArr;
  localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
}

// function to initialize localStorage object to default values if user has not visited page yet
// is an IIFE so that it executes immediately on page load

(function initializeLocalStorage() {
  // if user has already visited this website, do not reinitialize the localStorage object
  if (!localStorage.userInfo) {
    const localStorageObj = {
      preferences: {
        apodMinimized: false,
        recentsMinimized: false,
        newsfeedMinimized: false,
        darkMode: false,
        mostRecentSubreddit: 'astronomy',
      },
      favorites: [],
      recent: [],
    };
    localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
  }
})();
