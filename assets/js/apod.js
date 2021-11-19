// Function to render to the DOM NASA's Astronomy Picture of the Day

(function getApod() {
  const url = 'https://api.nasa.gov/planetary/apod';
  const api_key = 'lEF3XW7bbe3BIaacs2lmw47iySF6eR72wP6T1sin';
  const params = { params: { api_key } };

  // create elements for displaying APOD
  const sectionTitleEl = (document.createElement('h2').textContent =
    'Image of the Day');
  const titleEl = document.createElement('h3');
  const linkEl = document.createElement('a');
  const apodEl = document.createElement('img');
  const avodEl = document.createElement('video');
  const explanationEl = document.createElement('p');
  const favoriteBtnEl = document.createElement('button');

  // clear placeholder
  clearSectionById('#apod-section');

  // get section to display API data
  const apodSectionEl = document.getElementById('apod-section');
  apodSectionEl.style.position = 'relative';

  axios
    .get(url, params)
    .then((res) => {
      // set the title for the APOD
      titleEl.textContent = `${res.data.title}`;
      titleEl.style.fontSize = '2rem';

      // set the explanation
      explanationEl.textContent = res.data.explanation;
      explanationEl.classList = 'w-4/5 text-left';

      // add a Favorite button, only for images
      favoriteBtnEl.textContent = '☆';
      favoriteBtnEl.style.position = 'absolute';
      favoriteBtnEl.style.backgroundColor = 'black';
      favoriteBtnEl.style.color = 'white';
      favoriteBtnEl.style.top = '30px';
      favoriteBtnEl.style.right = '150px';
      favoriteBtnEl.style.borderRadius = '50%';

      // check if APOD is an image or a video and append appropriate element to render it
      if (res.data.media_type === 'image') {
        // enclose img el in a link to HD url
        linkEl.href = res.data.hdurl;
        linkEl.appendChild(apodEl);
        apodEl.src = res.data.url;
        apodEl.title = `Click for HD version of ${res.data.title}.`;

        // add event listener to Favorite button
        favoriteBtnEl.imageObj = {
          title: res.data.title,
          thumbnail: res.data.url,
          hdUrl: res.data.hdurl,
        };
        favoriteBtnEl.addEventListener('click', handleAddFavorite);

        // render everything to DOM
        apodSectionEl.append(
          sectionTitleEl,
          linkEl,
          titleEl,
          explanationEl,
          favoriteBtnEl
        );
      } else if (res.data.media_type === 'video') {
        // if video, append a video el instead of an img el
        avodEl.src = res.data.url;
        apodSectionEl.append(titleEl, avodEl, explanationEl);
      }
    })
    // TO DO - enhance user feedback for API error with a modal
    .catch((err) => console.error(err));
})();
