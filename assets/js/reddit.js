// Function to render top posts from Astronomy subreddit

(function () {
  const url = 'https://www.reddit.com/r';
  const subReddit = 'astronomy'; // we can use space, nasa, astronomy, astrophysics, etc
  const timeframe = 'day'; // can be hour, day, week, month, year, all
  const listing = 'top'; // can be controversial, best, hot, new, random, rising, top
  const params = {
    params: {
      timeframe,
    },
  };

  clearSectionById('#news-section');
  const newsSectionEl = document.getElementById('news-section');
  const newsSectionTitle = (document.createElement('h2').textContent = 'News');
  newsSectionEl.append(newsSectionTitle);

  axios
    .get(`${url}/${subReddit}/${listing}.json`, params)
    .then((res) => {
      // empty array to store our posts to render
      const posts = [];

      // get the pertinent data from each post and store in our own posts array
      res.data.data.children.forEach((post) => {
        const postObj = {
          author: post.data.author,
          created: post.data.created,
          numberOfComments: post.data.num_comments,
          permalink: 'https://www.reddit.com/' + post.data.permalink,
          score: post.data.score,
          text: post.data.selftext.substr(0, 300) + '...',
          thumbnail: post.data.thumbnail,
          title: post.data.title,
          url: post.data.url,
        };
        posts.push(postObj);
      });

      // render each post in DOM
      posts.forEach((post) => {
        const divEl = document.createElement('a');
        divEl.classList.add('flex');
        divEl.href = post.permalink;

        console.log(post.thumbnail);
        // create thumbnail
        const imageEl = document.createElement('img');
        imageEl.src =
          post.thumbnail === 'default' || post.thumbnail === 'self'
            ? './assets/images/image-placeholder-500x500.jpg'
            : post.thumbnail;
        imageEl.alt = posts.title;
        imageEl.classList = 'inline rounded-lg';

        // create text
        const newsItemEl = document.createElement('div');
        const titleEl = document.createElement('h3');
        titleEl.textContent = post.title;
        const textEl = document.createElement('p');
        textEl.textContent = post.text;
        console.log(post.text);
        newsItemEl.append(titleEl, textEl);

        // combine everything
        divEl.append(imageEl, newsItemEl);
        newsSectionEl.append(divEl);
      });
    })
    .catch((err) => {
      console.error(err);
    });
})();
