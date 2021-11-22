// Function to render top posts from Astronomy subreddit

function getRedditPosts(filterOptions) {
  const url = 'https://www.reddit.com/r';
  const subreddit = filterOptions.subreddit; // we can use space, nasa, astronomy, astrophysics, etc
  const listing = filterOptions.listing; // can be controversial, best, hot, new, random, rising, top
  const paramsObj = {
    params: filterOptions.params,
  };

  axios
    .get(`${url}/${subreddit}/${listing}.json`, paramsObj)
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
          text:
            post.data.selftext.length > 0
              ? post.data.selftext.substr(0, 300) +
                ' ... (click post to read more).'
              : '',
          thumbnail: post.data.thumbnail,
          title: post.data.title,
          url: post.data.url,
        };
        posts.push(postObj);
      });

      // render each post in DOM
      posts.forEach((post, idx) => {
        // only render 6 elements, one for each placeholder row currently in index.html
        if (idx < 6) {
          document.querySelector(`#news-feed-${idx + 1}`).href = post.permalink;

          // create thumbnail
          const imageEl = document.createElement('img');
          document.querySelector(`#news-feed-${idx + 1} > img`).src =
            post.thumbnail === 'default' || post.thumbnail === 'self'
              ? './assets/img/iss.png'
              : post.thumbnail;
          document.querySelector(`#news-feed-${idx + 1} > img`).alt =
            posts.title;
          document.querySelector(`#news-feed-${idx + 1} > img`).title =
            posts.title;

          // create text
          document.querySelector(
            `#news-feed-${idx + 1} > div > h3`
          ).textContent = post.title;
          document.querySelector(
            `#news-feed-${idx + 1} > div > h4`
          ).textContent = `Posted by ${post.author} on ${new Date(
            post.created * 1000
          )
            .toString()
            .slice(0, 16)}`;
          document.querySelector(
            `#news-feed-${idx + 1} > div > p`
          ).textContent = post.text;
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

// get copy of current localStorage object
const localStorageObj = JSON.parse(localStorage.userInfo);

// Set default news filter options
let filterOptions = {
  subreddit: localStorageObj.preferences.mostRecentSubreddit || 'astronomy',
  listing: 'top',
  params: {
    t: 'day',
  },
};

// Select from Subreddit drop-down list most recently requested subreddit
document.querySelectorAll('#subreddit option').forEach((node) => {
  if (node.value === localStorageObj.preferences.mostRecentSubreddit) {
    node.selected = true;
  } else {
    node.selected = false;
  }
});

// Add event listener for News Filter form
const newsFeedFilterForm = document.querySelector('#news-feed-filter-form');
newsFeedFilterForm.addEventListener('change', (e) => {
  if (e.target.name === 'subreddit') {
    filterOptions = { ...filterOptions, subreddit: e.target.value };
    // update most recent subreddit in localstorage
    localStorageObj.preferences.mostRecentSubreddit = e.target.value;
    localStorage.setItem('userInfo', JSON.stringify(localStorageObj));
  } else if (e.target.name === 'listing') {
    if (e.target.value === 'top') {
      document
        .querySelector('#news-feed-filter-timeframe')
        .classList.remove('hidden');
    } else {
      document
        .querySelector('#news-feed-filter-timeframe')
        .classList.add('hidden');
    }
    filterOptions = { ...filterOptions, listing: e.target.value };
  } else if (e.target.name === 'timeframe') {
    filterOptions = { ...filterOptions, params: { t: e.target.value } };
  }

  // send new request to Reddit with updated parameters
  getRedditPosts(filterOptions);
});

// send initial request to Reddit with default parameters
getRedditPosts(filterOptions);
