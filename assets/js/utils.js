// function to clear a specified section of the DOM (delete all child elements to make way for a rerender) - must accept a CSS ID selector as argument, like '#news-section'
function clearSection(section) {
  // validate that section is a string
  if (section[0] !== '#') {
    console.error('Not an ID selector!');
  } else {
    // grab the section to be cleared
    const parentEl = document.getElementById(section);
    // if section is successfully located...
    if (parentEl) {
      // ... start removing the last child until there are no more children
      while (parentEl.lastChild) {
        parentEl.removeChild(parentEl.lastChild);
      }
    }
  }
}
