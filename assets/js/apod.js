// Function to render to the DOM NASA's Astronomy Picture of the Day

(function () {
  const url = 'https://api.nasa.gov/planetary/apod';
  const api_key = 'lEF3XW7bbe3BIaacs2lmw47iySF6eR72wP6T1sin';
  const params = { params: { api_key } };

  // TO DO - render the APOD and pertinent info in the #apod-section container
  const apodEl = document.querySelector('.recent-card1 img');

  axios
    .get(url, params)
    .then((res) => {
      console.log('obj returned from getAPOD function: ', res.data);
      apodEl.src = res.data.url;
    })
    // TO DO - enhance user feedback for API error with a modal
    .catch((err) => console.error(err));
})();
