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

      // clear out the previous news container
      clearSection('#news-container');

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

      const newsContainer = document.querySelector('#news-container');

      // if there are no news results with selected filters, say so...
      if (posts.length === 0) {
        const noNewsEl = document.createElement('h3');
        noNewsEl.classList = 'mx-auto';
        noNewsEl.textContent =
          'No posts retrieved with chosen filters. Change filters to try again.';
        newsContainer.append(noNewsEl);
      }

      // create elements for each post and append to newsContainer
      posts.forEach((post) => {
        const aEl = document.createElement('a');
        aEl.classList = 'grid grid-cols-3 bg-gray-800 bg-opacity-25 p-5';
        aEl.target = '_new';
        aEl.href = post.permalink;

        const imgEl = document.createElement('img');
        // check if thumbnail exists before populating attributes of img element
        if (post.thumbnail !== 'default' && post.thumbnail !== 'self') {
          imgEl.classList = 'inline rounded-lg';
          imgEl.src = post.thumbnail;
          imgEl.title = post.title;
          imgEl.alt = post.title;
        }

        const divEl = document.createElement('div');
        divEl.classList = 'col-span-2 pl-5 text-left';

        const h3El = document.createElement('h3');
        h3El.textContent = post.title;
        const h4El = document.createElement('h4');
        h4El.classList = 'text-sm text-gray-500';
        h4El.textContent = `Posted by ${post.author} on ${new Date(
          post.created * 1000
        )
          .toString()
          .slice(0, 16)}`;
        const pEl = document.createElement('p');
        pEl.textContent = post.text;

        divEl.append(h3El, h4El, pEl);
        aEl.append(imgEl, divEl);
        newsContainer.append(aEl);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

// get copy of current localStorage object
const localStorageObj = grabLocalStorage();

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
