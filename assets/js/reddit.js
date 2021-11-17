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
          text: post.data.selftext,
          title: post.data.title,
          url: post.data.url,
        };
        posts.push(postObj);
      });

      // TO DO - render each post in the news-section
    })
    .catch((err) => {
      console.error(err);
    });
})();
