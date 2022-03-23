import { renderOnCreate, renderAllData } from "./render.js";

// Select the create button element
const create = document.querySelector('#create-button'); // returns null when importing Roboto from Google Fonts
// console.log(create); 

// Add a click event listener for the create button
create.addEventListener('click', () => renderOnCreate());

const all_button = document.querySelector("#all-button");
all_button.addEventListener('click', event =>{
    console.log("All button clicked!");
});

document.addEventListener('DOMContentLoaded', () => renderAllData());