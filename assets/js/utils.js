// function to render specific section based on which nav bar link is clicked
console.log('Running utils');
function renderSection(sectionId) {
  // grab all sections and convert nodelist to array
  const sections = Array.from(document.querySelectorAll('section'));
  console.log('Rendering ', sectionId);
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
