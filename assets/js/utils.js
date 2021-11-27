// Function to clear child elements from a specified-by-ID parent element
function clearSection(section) {
  // Validate that argument is formatted like an ID selector...
  if (section[0] == '#') {
    // ... then try to grab the element...
    const parentEl = document.querySelector(section);
    // ... and if element exists...
    if (parentEl) {
      // ... start removing the last child until there are no more children
      while (parentEl.lastChild) {
        parentEl.removeChild(parentEl.lastChild);
      }
    }
  }
}

// Function to scroll to position, scrolls to top if no coordinates provided
function scrollToPos(x = 0, y = 0) {
  window.scrollTo(x, y);
}

// Function to render specific section
function renderSection(sectionId, scrollYPos) {
  // Grab all sections and convert from nodelist to array
  const sections = Array.from(document.querySelectorAll('section'));

  // This fixes a bug - if rendering the APoD Section, check if APoD image's favorite status has changed since initial section reveal
  if (sectionId === 'apod-section') {
    // get localstorage object so we can check if image is already in favorites
    const localStorageObj = grabLocalStorage();
    let favorited = false;
    localStorageObj.favorites.forEach((favorite) => {
      if (
        favorite.nasa_id ===
        document.querySelector('#apod-section > h3 > span').textContent
      ) {
        favorited = true;
      }
    });

    document.querySelector('#apod-section > h3 > button').textContent =
      favorited ? '★' : '☆';
  }

  // Go through each section on the page...
  sections.forEach((section) => {
    // ... and if the section matches, remove 'hidden' class. Else, add it.
    if (section.id === sectionId) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
  // Scroll to top
  scrollToPos(0, scrollYPos);
}

// Immediately render APOD section on page load, and remove invisible class from ISS tracker (only way found to work around bug with Leaflet.js not liking to be hidden.)
window.onload = () => {
  renderSection('apod-section');
  document.querySelector('#iss-tracker-section').classList.remove('invisible');
};

// Add event listeners to nav bar links
const navbarLinks = Array.from(document.querySelectorAll('#navbar-links li'));
document
  .querySelector('header > h1')
  .addEventListener('click', () => renderSection('apod-section'));
navbarLinks.forEach((link) => {
  link.addEventListener('click', (e) =>
    renderSection(e.target.id.replace('link', 'section'))
  );
});

// Function to grab the first item from the collection.json manifest and open HD section
async function getImageFromManifest(imageObj, origin) {
  const title = imageObj.title;
  const description = imageObj.description;
  const scrollYPos = window.scrollY;

  // Axios trick to store the data returned from the get request in url variable
  const promise = axios.get(imageObj.manifest);
  const url = await promise.then((res) => {
    // most browsers don't support rendering TIFF files so if the first item in the manifest happens to be one, skip to the next
    if (res.data[0].includes('.tif')) {
      return res.data[1];
    } else {
      return res.data[0];
    }
  });
  document.querySelector('#hd-title span').textContent = title;
  document.querySelector('#hd-desc').textContent = description;
  document.querySelector('#hd-img').src = url;

  // get localstorage object so we can check if image is already in favorites
  const localStorageObj = grabLocalStorage();
  let favorited = false;
  localStorageObj.favorites.forEach((favorite) => {
    if (favorite.nasa_id === imageObj.nasa_id) {
      favorited = true;
    }
  });

  document.querySelector('#hd-title > button').textContent = favorited
    ? '★'
    : '☆';

  // add event listener to Favorite button
  document.querySelector('#hd-title > button').imageObj = {
    title: imageObj.title,
    thumbnail: imageObj.thumbnail,
    url: imageObj.url,
    description: imageObj.description,
    nasa_id: imageObj.nasa_id,
    manifest: imageObj.manifest,
  };
  document
    .querySelector('#hd-title > button')
    .addEventListener('click', toggleFavorite);
  createEscapeButton(origin, scrollYPos);
  renderSection('hd-section');
}

// Function to grab the url from the Astronomy Picture of the Day and open HD section
function getImageFromURL(imageObj, origin) {
  const title = imageObj.title;
  const description = imageObj.description || imageObj.explanation;
  const url = imageObj.hdurl || imageObj.url;
  const scrollYPos = window.scrollY;

  document.querySelector('#hd-title span').textContent = title;
  document.querySelector('#hd-desc').textContent = description;
  document.querySelector('#hd-img').src = url;

  // get localstorage object so we can check if image is already in favorites
  const localStorageObj = grabLocalStorage();
  let favorited = false;
  localStorageObj.favorites.forEach((favorite) => {
    if (favorite.nasa_id === imageObj.title) {
      favorited = true;
    }
  });

  document.querySelector('#hd-title > button').textContent = favorited
    ? '★'
    : '☆';

  // add event listener to Favorite button
  document.querySelector('#hd-title > button').imageObj = {
    title: imageObj.title,
    nasa_id: imageObj.title,
    thumbnail: imageObj.url,
    url: imageObj.hdurl,
    description: imageObj.explanation,
  };
  document
    .querySelector('#hd-title > button')
    .addEventListener('click', toggleFavorite);
  createEscapeButton(origin, scrollYPos);
  renderSection('hd-section');
}

// Function to create dynamic Escape button to HD image section
function createEscapeButton(origin, scrollYPos) {
  // Delete previous button
  clearSection('#close-hd');

  // Create a new button with the appropriate event listener
  const divEl = document.querySelector('#close-hd');
  const buttonEl = document.createElement('button');
  buttonEl.classList = 'bg-white text-black rounded-lg p-2 hover:bg-gray-400';
  buttonEl.textContent = '(Escape)';
  // If user clicks button, go back to origin section
  buttonEl.addEventListener('click', () => {
    renderSection(origin);
  });
  // Listen for "Escape" key to be pressed but only if HD section is loaded
  let onHDSection = true;
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && onHDSection) {
      onHDSection = false;
      renderSection(origin, scrollYPos);
    }
  });
  // Add new button to page
  divEl.append(buttonEl);
}

// Variables and functions related to the modal
const overlay = document.querySelector('#modal-overlay');
overlay.addEventListener('click', toggleModal);

var closeModal = document.querySelector('#modal-close');
closeModal.addEventListener('click', toggleModal);

document.onkeydown = function (event) {
  event = event || window.event;
  var isEscape = false;
  if ('key' in event) {
    isEscape = event.key === 'Escape' || event.key === 'Esc';
  } else {
    isEscape = event.keyCode === 27;
  }
  if (isEscape && document.body.classList.contains('modal-active')) {
    toggleModal();
  }
};

function toggleModal() {
  const body = document.querySelector('body');
  const modal = document.querySelector('#modal');
  modal.classList.toggle('opacity-0');
  modal.classList.toggle('pointer-events-none');
  body.classList.toggle('modal-active');
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
        mostRecentSubreddit: 'astronomy',
      },
      favorites: [],
      recent: [],
    };
    localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
  }
})();
