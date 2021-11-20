// Function to render top posts from Astronomy subreddit

function getRedditPosts() {
  const url = 'https://www.reddit.com/r';
  const subReddit = 'astronomy'; // we can use space, nasa, astronomy, astrophysics, etc
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
              ? './assets/images/image-placeholder-500x500.jpg'
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

getRedditPosts();
