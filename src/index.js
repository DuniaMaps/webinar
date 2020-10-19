let resultsContainer = document.getElementById("js-results-container");
let searchResults = document.getElementById("js-results");
let searchInput = document.getElementById("js-search");
let clearButton = document.getElementById("js-clear");

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    fetchSearchResults(searchInput.value);
  }
});

document.getElementById("js-submit").addEventListener("click", () => {
  let query = searchInput.value;

  if (query.length === 0) {
    searchInput.focus();
  } else {
    fetchSearchResults(query);
  }
});

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  clearAllResults();
});

let clearAllResults = () => {
  searchResults.innerHTML = "";
  resultsContainer.classList.add("hidden");
  clearButton.classList.add("hidden");
};

let fetchSearchResults = (query) => {
  fetch(`/poi?q=${query}`)
    .then((res) => res.json())
    .then((data) => {
      clearAllResults();
      searchInput.blur();
      if (data.features && data.features.length > 0) {
        createSearchResults(data.features);
      } else {
        let message = document.createElement("p");
        message.classList.add("no-results");
        message.innerHTML = `Dunia Maps can't find <span>${query}</span>`;

        searchResults.append(message);
        resultsContainer.classList.remove("hidden");
        clearButton.classList.remove("hidden");
      }
    });
};

let createSearchResults = (features) => {
  let buttons = features.map((feature) => {
    let { name, level0, level1, level2, cat, subcat } = feature.properties;
    let button = document.createElement("button");
    button.classList.add("search-item");
    button.innerHTML = `
          <div>${name}</div>
          <span>${cat}${subcat ? `, ${subcat}` : ""}</span>
          <span>${level0}${level1 ? `, ${level1}` : ""}${level2 ? `, ${level2}` : ""}</span>
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/></svg>
    `;

    return button;
  });

  searchResults.append(...buttons);
  resultsContainer.classList.remove("hidden");
  clearButton.classList.remove("hidden");
};
