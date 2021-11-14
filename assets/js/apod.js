// Function to render to the DOM NASA's Astronomy Picture of the Day

(function getAPOD() {
  const API_URL = 'https://api.nasa.gov/planetary/apod?api_key=';
  const API_KEY = 'lEF3XW7bbe3BIaacs2lmw47iySF6eR72wP6T1sin';

  const apodEl = document.querySelector('.recent-card1 img');

  fetch(API_URL + API_KEY).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        // data object contains the following properties: copyright, date, explanation, hdurl, media_type, service_version, title, url
        const url = data.url;
        const hdUrl = data.hdurl;
        const copyright = data.copyright;
        const desc = data.explanation;
        const date = data.date;

        // render the image on the page
        apodEl.src = data.url;
      });
    } else {
      console.log('Error receiving data from API.');
    }
  });
})();
