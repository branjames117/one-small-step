// Function to render to the DOM NASA's Astronomy Picture of the Day

(function () {
  const url = 'https://api.nasa.gov/planetary/apod';
  const api_key = 'lEF3XW7bbe3BIaacs2lmw47iySF6eR72wP6T1sin';
  const params = { params: { api_key } };

  const apodEl = document.querySelector('.recent-card1 img');

  axios
    .get(url, params)
    .then((res) => {
      console.log('obj returned from getAPOD function: ', res.data);
      apodEl.src = res.data.url;
    })
    .catch((err) => console.log(err));

  // old API request with Fetch
  // fetch(API_URL + API_KEY).then((res) => {
  //   if (res.ok) {
  //     res.json().then((data) => {
  //       // data object contains the following properties: copyright, date, explanation, hdurl, media_type, service_version, title, url
  //       const url = data.url;
  //       const hdUrl = data.hdurl;
  //       const copyright = data.copyright;
  //       const desc = data.explanation;
  //       const date = data.date;

  //       // render the image on the page
  //       apodEl.src = data.url;
  //     });
  //   } else {
  //     console.log('Error receiving data from API.');
  //   }
  // });
})();
