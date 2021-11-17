// Function to render top posts from Astronomy subreddit

(function () {
  const url = 'https://www.reddit.com/r';
  const subReddit = 'astronomy'; // we can use space, nasa, astronomy, astrophysics,
  const timeframe = 'day'; // can be hour, day, week, month, year, all
  const listing = 'top'; // can be controversial, best, hot, new, random, rising, top
  const params = {
    params: {
      timeframe,
    },
  };

  axios
    .get(`${url}/${subReddit}/${listing}.json`, params)
    .then((res) => {
      console.log('returned from reddit json: ', res.data.data);
    })
    .catch((err) => {
      console.error(err);
    });
})();
