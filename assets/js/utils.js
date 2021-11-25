// function to render specific section based on which nav bar link is clicked

console.log('Running utils');
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

// Function to grab the first item (usually the original, highest-def image) from the collection.json manifest that each image in the NASA gallery has, to display a full-screen version of the image when the user clicks the thumbnail

async function getImageFromManifest(imageObj) {
  // To do: open the URL from res.data[0] in the modal
  const title = imageObj.title;
  console.log(imageObj);
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
    if (favorite.nasa_id === res.data.title) {
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
  const url = imageObj.url;

  renderSection('hd-section');
  document.querySelector('#hd-title span').textContent = title;
  document.querySelector('#hd-desc').textContent = description;
  document.querySelector('#hd-img').src = url;
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
  console.log('modal toggled');
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
