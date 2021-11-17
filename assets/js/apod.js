// Function to render to the DOM NASA's Astronomy Picture of the Day

function getApod() {
  const url = 'https://api.nasa.gov/planetary/apod';
  const api_key = 'lEF3XW7bbe3BIaacs2lmw47iySF6eR72wP6T1sin';
  const params = { params: { api_key } };

  // TO DO - render the APOD and pertinent info in the #apod-section container
  const titleEl = document.createElement('h3');
  const linkEl = document.createElement('a');
  const apodEl = document.createElement('img');
  const avodEl = document.createElement('video');
  const explanationEl = document.createElement('p');
  const divEl = document.querySelector('.recent-card1');

  axios
    .get(url, params)
    .then((res) => {
      console.log('obj returned from getAPOD function: ', res.data);

      // set the title for the APOD
      titleEl.textContent = `${res.data.title} (© ${res.data.copyright})`;

      // set the explanation
      explanationEl.textContent = res.data.explanation;

      // check if APOD is an image or a video and append appropriate element to render it
      if (res.data.media_type === 'image') {
        // enclose img el in a link to HD url
        linkEl.href = res.data.hdurl;
        linkEl.appendChild(apodEl);
        apodEl.src = res.data.url;
        apodEl.title = `Click for HD version of ${res.data.title}.`;

        // render everything to DOM
        divEl.append(titleEl, linkEl, explanationEl);
      } else if (res.data.media_type === 'video') {
        // if video, append a video el instead of an img el
        avodEl.src = res.data.url;
        divEl.append(titleEl, avodEl, explanationEl);
      }
    })
    // TO DO - enhance user feedback for API error with a modal
    .catch((err) => console.error(err));
}

getApod();
