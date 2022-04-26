import { renderOnCreate, renderData } from "./render.js";

let searchText = "";
let filterType = "all";

let isSplashScreenOn = true;
let isDomLoaded = false;


document.addEventListener("DOMContentLoaded", () => {
  isDomLoaded = true;
  if (isSplashScreenOn === false) {
    renderData(searchText, filterType);
  }
});

setTimeout( () => {
  isSplashScreenOn = false;
  const splashScreen = document.querySelector(".splash-screen");
  splashScreen.style.display = 'none';
  const article = document.querySelector('article');
  article.style.display = "block";
  if (isDomLoaded)
  {  
    renderData(searchText, filterType);
  }
}, 2000);

// The create button's functionality implementation
const createButton = document.querySelector("#create-button");
createButton.addEventListener("click", () => renderOnCreate(searchText, filterType));

// The filter all button's functionality implementation
const allButton = document.querySelector("#all-button");
allButton.addEventListener("click", () => {
  allButton.disabled = true;
  incompleteButton.disabled = false;
  completeButton.disabled = false;
  filterType = "all";
  processChange();
});

// The filter incomplete button's functionality implementation
const incompleteButton = document.querySelector("#incomplete-button");
incompleteButton.addEventListener("click", () => {
  incompleteButton.disabled = true;
  completeButton.disabled = false;
  allButton.disabled = false;
  filterType = "incomplete";
  processChange();
});

// The filter complete button's functionality implementation
const completeButton = document.querySelector("#complete-button");
completeButton.addEventListener("click", () => {
  completeButton.disabled = true;
  incompleteButton.disabled = false;
  allButton.disabled = false;
  filterType = "complete";
  processChange();
});

// The search button's functionality implementation
let isSearchActivated = false;
const searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click", () => {

  const searchField = document.getElementById("search-field");

  if (!isSearchActivated) {
    isSearchActivated = true;

    // show the searchField element
    searchField.style.display = "inline-flex";

    document.activeElement.blur;
    searchField.focus();  

    searchField.addEventListener("keydown", () => processChange());
  } else {
    isSearchActivated = false;
    searchText = "";
    // remove the searchText element
    searchField.style.display = "none";
    renderData(searchText, filterType);
  }
});



const debounce = (fn, delay) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export async function searchForInput() {
  if (isSearchActivated) {
    const searchField = document.querySelector("#search-field");
    searchText = searchField.value.trim();
  }

  renderData(searchText, filterType);
}

const processChange = debounce(
  (buttonClicked) => searchForInput(),
  500
);
