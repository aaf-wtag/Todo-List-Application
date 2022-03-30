import { renderOnCreate, renderAllData, renderFilteredData } from "./render.js";

document.addEventListener('DOMContentLoaded', () => renderAllData(""));

// The create button's functionality implementation
const create = document.querySelector('#create-button'); // returns null when importing Roboto from Google Fonts
create.addEventListener('click', () => renderOnCreate());

// The filter all button's functionality implementation
const all_button = document.querySelector("#all-button");
all_button.addEventListener('click', () => {
    all_button.disabled = true;
    processChange("all");
});

// The filter incomplete button's functionality implementation
const incomplete_button = document.querySelector("#incomplete-button")
incomplete_button.addEventListener('click', () => {
    incomplete_button.disabled = true;
    processChange("incomplete");
});

// The filter complete button's functionality implementation
const complete_button = document.querySelector("#complete-button")
complete_button.addEventListener('click', () => {
    complete_button.disabled = true;
    processChange("complete");
});

// The search button's functionality implementation
let isSearchActivated = false; 
const search_button = document.querySelector("#search-button");

search_button.addEventListener("click", () => {
    if (!isSearchActivated)
    {
        isSearchActivated = true;
        const search = document.querySelector(".search"); 

        // create the text element
        const text_field = document.getElementById("search-field");
        text_field.style.display = "inline-flex";
        // text_field.setAttribute("id", "search-field");
        // text_field.type = "text";

        // search.appendChild(text_field);

        text_field.addEventListener("keydown", () => processChange());  
    }

    else
    {
        isSearchActivated = false;

        // remove the text element
        const text_field = document.getElementById("search-field");
        text_field.style.display = "none";
        renderAllData("");
    }
});

const debounce = (fn, delay) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay)
    };
}

export async function search_for_input(button_clicked = "all")
{
    let text = "";
    if (isSearchActivated) 
    {
        const text_field = document.querySelector("#search-field");
        text = text_field.value.trim();
    } 
    
    // console.log(text, button_clicked);

    if (button_clicked === "all") renderAllData(text);
    else if (button_clicked === "incomplete") renderFilteredData(button_clicked, text);
    else if (button_clicked === "complete") renderFilteredData(button_clicked, text);
}

const processChange = debounce((button_clicked) => search_for_input(button_clicked), 500); 