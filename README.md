# One Small Step

## Description

A SPA written in JavaScript and HTML that uses the Tailwind UI CSS framework and integrates various Open APIs from NASA, as well as Reddit, to create a one-stop-shop for astronomy lovers.

## Proposed Features

### Single-Page Application

A Header and a Sidebar that remain static for the most part, and a larger Main container that is cleared and then re-rendered based on user actions, so that the user never has to reload the page or navigate to a different page.

Functions: clearMain()

### Astronomy Picture of the Day (APOD)

Use NASA's APOD API to display their Picture of the Day. E.g., the user will click a button that says "Get Picture of the Day", which then displays the image and its information in the Main container.

Stretch Goal: implement a calendar input that allows user to specify a date in history to display that date's picture.

Function: getAPOD()

### Image Search

Use the NASA Image and Video Library to display multiple pictures (of a requested search term) in a gallery format. E.g, the user will enter a term like "black hole" into a search bar and then click the "Search" button to query NASA's library and get images (with descriptions and links to HD versions) of black holes, displayed in the Main container. The user's search history is stored in localStorage, with buttons near the search bar generated to make repeated searching easier.

Stretch Goal: When the user clicks the search bar, a list of common queries appears, guiding the user toward more popular searches.

Function: getImagesByQuery(query)

### Reddit Integration

Use Reddit's API to pull a collection of astronomy-related Reddit posts to render in the Main container along with the images (or independent of the images, as a separate feature). Either a) a separate feature showing a list of posts from (e.g.) the Astronomy subreddit or the NASA subreddit, or b) a feature showing a list of posts related to the image searched ("Venus", "gravitational waves", etc.).

Function: getRedditPosts(query)

### Stretch Goal: Astronomy Quiz

Integrate a trivia/quiz API that generates astronomy-related questions/answers.

### Stretch Goal: SpaceX API

SpaceX has a free API that offers data about their launches.

## Project Steps

1. Create HTML skeleton.
2. Successfully connect to API endpoints.
3. Use data from API calls to render DOM.
4. Store data in localStorage for persistence.
5. Style page with Tailwind.

## Contributors

- Nathan Helms
- Brandon Hoskins
- Patrick Manning
- Brian Sales
