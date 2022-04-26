export const showSpinner = (id = "unsaved") => {
   const cardItem = document.getElementById(`cardItem_${id}`);
   const spinnerIcon = document.getElementById(`spinnerIcon_${id}`);
   if (cardItem) {
    cardItem.classList.add("lower-opacity");
    spinnerIcon.removeAttribute("hidden");
  }
}

export const hideSpinner = (id = "unsaved") => {
  const cardItem = document.getElementById(`cardItem_${id}`);
  const spinnerIcon = document.getElementById(`spinnerIcon_${id}`);

  if (cardItem) 
  {
    cardItem.classList.remove("lower-opacity");
    spinnerIcon.setAttribute("hidden", true);
  }
}

export const showMainBodySpinner = () => {
  const article = document.querySelector("article");
  const mainSpinnerIcon = document.getElementById("mainSpinnerIcon");
  const searchButton = document.getElementById("search-button");
  const createButton = document.getElementById("create-button");
  const allButton = document.getElementById("all-button");
  const incompleteButton = document.getElementById("incomplete-button");
  const completeButton = document.getElementById("complete-button");

  article.classList.add("lower-opacity");
  mainSpinnerIcon.removeAttribute("hidden");
  searchButton.disabled = true;
  createButton.disabled = true;
  allButton.disabled = true;
  incompleteButton.disabled = true;
  completeButton.disabled = true;
}

export const hideMainBodySpinner = () => {
  const article = document.querySelector("article");
  const mainSpinnerIcon = document.getElementById("mainSpinnerIcon");
  const searchButton = document.getElementById("search-button");
  const createButton = document.getElementById("create-button");
  const allButton = document.getElementById("all-button");
  const incompleteButton = document.getElementById("incomplete-button");
  const completeButton = document.getElementById("complete-button");

  article.classList.remove("lower-opacity");
  mainSpinnerIcon.setAttribute("hidden", true);
  searchButton.disabled = false;
  createButton.disabled = false;
  allButton.disabled = false;
  incompleteButton.disabled = false;
  completeButton.disabled = false;

}