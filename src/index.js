import { map, zoomToMarker, addToMap, clearMap } from "./map.js";

let autocompleteResults = document.getElementById("js-autocomplete");
let resultsContainer = document.getElementById("js-results-container");
let searchResults = document.getElementById("js-results");
let searchInput = document.getElementById("js-search");
let clearButton = document.getElementById("js-clear");
let autocompleteData = null;

searchInput.addEventListener("input", (event) => {
  fetchAutocompleteResults(event.target.value);
});
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    fetchSearchResults(searchInput.value);
  }
});
searchInput.addEventListener("blur", (event) => {
  if (event.relatedTarget.classList.contains("autocomplete-item")) return;

  autocompleteResults.innerHTML = "";
});
searchInput.addEventListener("focus", () => {
  if (autocompleteData) {
    createAutocompleteResults(autocompleteData);
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
  autocompleteData = null;
  clearAllResults();
});

let clearAllResults = () => {
  autocompleteResults.innerHTML = "";
  searchResults.innerHTML = "";
  resultsContainer.classList.add("hidden");
  clearButton.classList.add("hidden");
};

let fetchAutocompleteResults = (query) => {
  fetch(`/poi?q=${query}&limit=5`)
    .then((res) => res.json())
    .then((data) => {
      autocompleteResults.innerHTML = "";
      if (data.features) {
        autocompleteData = data.features;
        createAutocompleteResults(data.features);
      }
    });
};

let fetchSearchResults = (query) => {
  let { lat, lng } = map.getCenter();
  fetch(`/poi?q=${query}&lat=${lat}&lon=${lng}`)
    .then((res) => res.json())
    .then((data) => {
      clearAllResults();
      clearMap();
      searchInput.blur();
      if (data.features && data.features.length > 0) {
        createSearchResults(data.features);
        addToMap(data);
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

let createAutocompleteResults = (features) => {
  let buttons = features.map((feature) => {
    let { name, level0, level1, level2 } = feature.properties;
    let button = document.createElement("button");
    button.classList.add("autocomplete-item");
    button.innerHTML = `
          <div>${name}</div>
          <span>${level0}${level1 ? `, ${level1}` : ""}${level2 ? `, ${level2}` : ""}</span>
    `;
    button.addEventListener("click", () => {
      searchInput.value = feature.properties.name;
      fetchSearchResults(feature.properties.name);
    });

    return button;
  });

  autocompleteResults.append(...buttons);
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
    button.addEventListener("click", () => {
      zoomToMarker(feature);
    });

    return button;
  });

  searchResults.append(...buttons);
  resultsContainer.classList.remove("hidden");
  clearButton.classList.remove("hidden");
};
