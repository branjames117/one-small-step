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
        '#apod-section > h3'
      ).textContent = `${res.data.title}`;

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

        // add event listener to Favorite button
        document.querySelector('#apod-section > button').imageObj = {
          title: res.data.title,
          thumbnail: res.data.url,
          hdUrl: res.data.hdurl,
        };
        document
          .querySelector('#apod-section > button')
          .addEventListener('click', handleAddFavorite);
      } else if (res.data.media_type === 'video') {
        // if video, append a video el instead of an img el
        document.querySelector('#apod-section > video').src = res.data.url;
      }
    })
    // TO DO - enhance user feedback for API error with a modal
    .catch((err) => console.error(err));
})();
