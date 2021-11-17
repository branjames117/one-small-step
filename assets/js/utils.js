// function to clear a specified section of the DOM (delete all child elements to make way for a rerender) - must accept a CSS ID selector as argument, like '#news-section'

function clearSection(section) {
  // validate that argument is formatted like an ID selector
  if (section[0] == '#') {
    // grab the element to be cleared
    const parentEl = document.getElementById(section);
    // if element is successfully located...
    if (parentEl) {
      // ... start removing the last child until there are no more children
      while (parentEl.lastChild) {
        parentEl.removeChild(parentEl.lastChild);
      }
    }
  }
}

function updateLocalStorage(updateObj) {}

function initializeLocalStorage() {
  const localStorageObj = {
    preferences: {
      apodMinimized: false,
      recentsMinimized: false,
      newsfeedMinimized: false,
      darkMode: false,
    },
    favorites: [],
    recent: [],
  };
  localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
}

initializeLocalStorage();
