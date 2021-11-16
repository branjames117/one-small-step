// Function to render top posts from Astronomy subreddit

(function () {
  const url = 'https://www.reddit.com/r';
  const subReddit = 'astronomy';
  const timeframe = 'day';
  const listing = 'top';
  const params = {
    params: {
      timeframe,
    },
  };

  axios
    .get(`${url}/${subReddit}/${listing}.json`, params)
    .then((res) => console.log('returned from reddit json: ', res.data.data));
})();
