// Function to render to the DOM NASA's Astronomy Picture of the Day

(function getApod() {
  const url = 'https://api.nasa.gov/planetary/apod';
  const api_key = 'lEF3XW7bbe3BIaacs2lmw47iySF6eR72wP6T1sin';
  const params = { params: { api_key } };

  axios
    .get(url, params)
    .then((res) => {
      console.log(res);
      // set the title for the APOD
      document.querySelector(
        '#apod-section > h3 > span'
      ).textContent = `${res.data.title}`;

      // get localstorage object so we can check if image is already in favorites
      const localStorageObj = grabLocalStorage();
      let favorited = false;
      localStorageObj.favorites.forEach((favorite) => {
        if (favorite.title === res.data.title) {
          favorited = true;
        }
      });

      document.querySelector('#apod-section > h3 > button').textContent =
        favorited ? '★' : '☆';

      // add event listener to Favorite button
      document.querySelector('#apod-section > h3 > button').imageObj = {
        title: res.data.title,
        thumbnail: res.data.url,
        hdUrl: res.data.hdurl,
      };
      document
        .querySelector('#apod-section > h3 > button')
        .addEventListener('click', toggleFavorite);

      // set the explanation
      document.querySelector('#apod-section > p').textContent =
        res.data.explanation;

      // check if APOD is an image or a video and append appropriate element to render it
      if (res.data.media_type === 'image') {
        // enclose img el in a link to HD url
        document.querySelector('#apod-section > a').href = res.data.hdurl;
        document.querySelector('#apod-section img').src = res.data.url;
        document.querySelector(
          '#apod-section img'
        ).title = `Click for HD version of ${res.data.title}.`;
      } else if (res.data.media_type === 'video') {
        // if video
        document.querySelector('#apod-section > video').style.display = 'block';
        document.querySelector('#apod-section > video').src = res.data.url;
      }
    })
    // TO DO - enhance user feedback for API error with a modal
    .catch((err) => console.error(err));
})();
