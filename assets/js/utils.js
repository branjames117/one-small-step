// Function to clear child elements from a specified-by-ID parent element
function clearSection(section) {
  // validate that argument is formatted like an ID selector
  if (section[0] == '#') {
    // grab the element to be cleared
    const parentEl = document.querySelector(section);
    // if element is successfully located...
    if (parentEl) {
      // ... start removing the last child until there are no more children
      while (parentEl.lastChild) {
        parentEl.removeChild(parentEl.lastChild);
      }
    }
  }
}

// Scroll to top on page load
document.addEventListener('DOMContentLoaded', () => {
  scrollToTop();
});

// function to render specific section based on which nav bar link is clicked

function renderSection(sectionId) {
  // grab all sections and convert nodelist to array
  const sections = Array.from(document.querySelectorAll('section'));
  sections.forEach((section) => {
    if (section.id === sectionId) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
  scrollToTop();
}

// Immediately render ISS tracker section on page load
renderSection('iss-tracker-section');

// Add event listeners to nav bar links

const navbarLinks = Array.from(document.querySelectorAll('#navbar-links li'));
navbarLinks.forEach((link) => {
  link.addEventListener('click', (e) =>
    renderSection(e.target.id.replace('link', 'section'))
  );
});

// Function to scroll to top of app
function scrollToTop() {
  window.scrollTo(0, 0);
}

// Function to grab the first item (usually the original, highest-def image) from the collection.json manifest that each image in the NASA gallery has, to display a full-screen version of the image when the user clicks the thumbnail

async function getImageFromManifest(imageObj) {
  // To do: open the URL from res.data[0] in the modal
  const title = imageObj.title;
  const description = imageObj.description;

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
  renderSection('hd-section');
}

// Function to grab the url from the Astronomy Picture of the Day

function getImageFromURL(imageObj) {
  // To do: open the URL in the modal
  const title = imageObj.title;
  const description = imageObj.description || imageObj.explanation;
  const url = imageObj.hdurl || imageObj.url;

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
  renderSection('hd-section');
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
