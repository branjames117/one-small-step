// function to clear a specified section of the DOM (delete all child elements to make way for a rerender) - must accept a CSS ID selector as argument, like '#news-section'

function clearSectionById(sectionId) {
  // validate that argument is formatted like an ID selector
  if (sectionId[0] == '#') {
    // grab the element to be cleared
    const parentEl = document.getElementById(sectionId.replace('#', ''));
    // if element is successfully located...
    if (parentEl) {
      // ... start removing the last child until there are no more children
      while (parentEl.lastChild) {
        parentEl.removeChild(parentEl.lastChild);
      }
    }
  }
}

// Function to grab the first item (usually the original, highest-def image) from the collection.json manifest that each image in the NASA gallery has, to display a full-screen version of the image when the user clicks the thumbnail

async function getImageFromManifest(imageObj) {
  // To do: open the URL from res.data[0] in the modal
  const title = imageObj.title;
  const description = imageObj.description;

  // Axios trick to store the data returned from the get request in url variable
  const promise = axios.get(imageObj.manifest);
  const url = await promise.then((res) => res.data[0]);
  console.log(title);
  console.log(description);
  console.log(url);
}

// Function to grab the url from the Astronomy Picture of the Day
function getImageFromURL(imageObj) {
  // To do: open the URL in the modal
  const title = imageObj.title;
  const description = imageObj.description || imageObj.explanation;
  const url = imageObj.url;

  console.log(title);
  console.log(description);
  console.log(url);
}

// function to grab the local storage object
function grabLocalStorage() {
  return JSON.parse(localStorage.userInfo);
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
