// Function to render to the DOM NASA's Astronomy Picture of the Day

(function getApod() {
  const url = 'https://api.nasa.gov/planetary/apod';
  const api_key = 'lEF3XW7bbe3BIaacs2lmw47iySF6eR72wP6T1sin';
  const params = { params: { api_key } };

  axios
    .get(url, params)
    .then((res) => {
      // set the title for the APOD
      document.querySelector(
        '#apod-section > h3 > span'
      ).textContent = `${res.data.title}`;

      // get localstorage object so we can check if image is already in favorites
      const localStorageObj = grabLocalStorage();
      let favorited = false;
      localStorageObj.favorites.forEach((favorite) => {
        if (favorite.nasa_id === res.data.title) {
          favorited = true;
        }
      });

      document.querySelector('#apod-section > h3 > button').textContent =
        favorited ? '★' : '☆';

      // add event listener to Favorite button
      document.querySelector('#apod-section > h3 > button').imageObj = {
        title: res.data.title,
        thumbnail: res.data.url,
        url: res.data.hdurl || res.data.url,
        description: res.data.explanation,
        nasa_id: res.data.title,
      };
      document
        .querySelector('#apod-section > h3 > button')
        .addEventListener('click', toggleFavorite);

      // set the explanation
      document.querySelector(
        '#apod-desc'
      ).textContent = `${res.data.date}. ${res.data.explanation}. (© ${res.data.copyright}.)`;

      // check if APOD is an image or a video and append appropriate element to render it
      if (res.data.media_type === 'image') {
        // enclose img el in a link to HD url
        document
          .querySelector('#apod-section > a')
          .addEventListener('click', () => {
            getImageFromURL(res.data, 'apod-section');
          });
        document.querySelector('#apod-section img').src = res.data.url;
        document.querySelector(
          '#apod-section img'
        ).title = `Click to open HD version of ${res.data.title}.`;
        document.querySelector(
          '#apod-section img'
        ).alt = `Click to open HD version of ${res.data.title}.`;
        document.querySelector('#apod-section img').style.cursor = 'pointer';
      } else if (res.data.media_type === 'video') {
        // if video
        document.querySelector('#apod-video').classList.remove('hidden');
        document.querySelector('#apod-video').src = res.data.url;
      }
    })
    // TO DO - enhance user feedback for API error with a modal
    .catch((err) => console.error(err));
})();
