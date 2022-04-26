import { getDataWithCompletionStatus, getFromDB } from "./db_calls.js";
import {
  addTodo,
  calculateElapsedTime,
  completeTodo,
  deleteTodo,
  editTodo,
  saveTodo,
} from "./event_handlers.js";
import { hideMainBodySpinner, showMainBodySpinner, showSpinner } from "./spinner.js";

// Hard-coded!
export const numberOfCardsToShow = 8;

// converts a given dateString from DB to the given date format
const toDateString = (dateString) => {
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `Created At: ${day}.${month}.${year.substring(2, 4)}`;
}

// Add a checker for create enabled
let isCreateEnabled = true;

const addEmptyTodo = () => {
  // selecting filter buttons and disable them
  const allButton = document.querySelector("#all-button");
  allButton.disabled = true;

  const incompleteButton = document.querySelector("#incomplete-button");
  incompleteButton.disabled = true;

  const completeButton = document.querySelector("#complete-button");
  completeButton.disabled = true;

  const container = document.querySelector(".container");

  const todoCardsContainer = document.querySelector(".todo-cards-container");
  if (todoCardsContainer) todoCardsContainer.remove();

  const emptyTodoContainer = document.createElement("div");
  emptyTodoContainer.setAttribute("class", "empty-todo-container");

  const emptyTodoImageContainer = document.createElement("div");
  emptyTodoImageContainer.setAttribute(
    "class",
    "empty-todo-image-container"
  );

  const emptyTodoImage = document.createElement("img");
  emptyTodoImage.src = "./images/empty.svg";

  emptyTodoImageContainer.appendChild(emptyTodoImage);

  emptyTodoContainer.appendChild(emptyTodoImageContainer);

  const emptyTodoTextContainer = document.createElement("div");
  emptyTodoTextContainer.setAttribute("class", "empty-todo-text-container");
  const emptyTodoText = document.createElement("p");
  emptyTodoText.setAttribute("class", "empty-todo-text");
  emptyTodoText.appendChild(
    document.createTextNode("You didn't add any task. Please, add one.")
  );
  emptyTodoTextContainer.appendChild(emptyTodoText);
  emptyTodoContainer.appendChild(emptyTodoTextContainer);
  container.appendChild(emptyTodoContainer);
}

export const removeEmptyTodo = (emptyTodoContainer) => {
  // selecting search and filter buttons and disable them
  const searchButton = document.querySelector("#search-button");
  searchButton.disabled = false;

  const allButton = document.querySelector("#all-button");
  allButton.disabled = false;

  const incompleteButton = document.querySelector("#incomplete-button");
  incompleteButton.disabled = false;

  const completeButton = document.querySelector("#complete-button");
  completeButton.disabled = false;

  emptyTodoContainer.remove();
  const container = document.querySelector(".container");
  const todoCardsContainer = document.createElement("div");
  todoCardsContainer.setAttribute("class", "todo-cards-container");
  container.appendChild(todoCardsContainer);
}

export const renderOnCreate = (searchText, filterType) => {
  if (isCreateEnabled) {
    isCreateEnabled = false;

    // If there exists an emptyTodoContainer it must be removed first
    const emptyTodoContainer = document.querySelector(".empty-todo-container");

    if (emptyTodoContainer) {
      removeEmptyTodo(emptyTodoContainer);
    }

    // select todoCardsContainer element
    const todoCardsContainer = document.querySelector(".todo-cards-container");

    // create the unsaved card div element representing each card
    const cardItem = document.createElement("div");
    cardItem.setAttribute("class", "card-item");
    cardItem.setAttribute("id", "cardItem_unsaved");

    // Start to fill in the unsaved card div with various elements

    // Creating a spinnerContainer for each card
    const spinnerContainer = document.createElement("div");
    spinnerContainer.setAttribute("class", "spinner-container");
    const spinnerIcon = document.createElement("img");
    spinnerIcon.setAttribute("id", `spinnerIcon_unsaved`);
    spinnerIcon.src = "./images/spinner.svg";
    spinnerIcon.setAttribute("hidden", true);
    spinnerContainer.appendChild(spinnerIcon);
    cardItem.appendChild(spinnerContainer);

    // Create the input text area element and append it to the unsaved card div
    const inputText = document.createElement("textarea");
    inputText.setAttribute("class", "input-text");
    inputText.placeholder = "What do you want to do?";

    cardItem.appendChild(inputText);

    // Create a todoButtonsContainer div containing the buttons in the unsaved cards div
    const todoButtonsContainer = document.createElement("div");
    todoButtonsContainer.setAttribute("class", "todo-button-container");

    // Create the Add Task button and appending it to the todoButtonsContainer
    const addTaskButton = document.createElement("button");
    addTaskButton.setAttribute("class", "add-task-button");
    addTaskButton.appendChild(document.createTextNode("Add Task"));
    todoButtonsContainer.appendChild(addTaskButton);

    // Create the delete button and appending it to the todoButtonsContainer
    const deleteButton = document.createElement("input");
    deleteButton.setAttribute("class", "delete-button");
    deleteButton.setAttribute("id", "deleteButton_unsaved");
    deleteButton.type = "image";
    deleteButton.name = "delete button";
    deleteButton.src = "images/delete.svg";
    deleteButton.alt = "delete button";
    todoButtonsContainer.appendChild(deleteButton);

    // appending the todo_button div to the unsaved cards div
    cardItem.appendChild(todoButtonsContainer);

    todoCardsContainer.prepend(cardItem);

    // the event handler for the Delete button
    deleteButton.addEventListener("click", () => {
      const item = document.getElementById("cardItem_unsaved");
      item.remove();
      isCreateEnabled = true;
    });

    // followed by the event handler for the Add Task button
    addTaskButton.addEventListener("click", () => {
      addTodo(searchText, filterType);
      isCreateEnabled = true;
    });

  } else {
    console.log("Create is disabled");
  }
}

export const renderData = async (searchText, filterType) => {
  // If there exists an emptyTodoContainer it must be removed first

  const emptyTodoContainer = document.querySelector(".empty-todo-container");

  if (emptyTodoContainer) {
    removeEmptyTodo(emptyTodoContainer);
  }

  // deleting the extra load more
  const loadMore = document.querySelector(".load-more");
  if (loadMore) loadMore.remove();

  // selecting the todo card div containing all the cards
  const todoCardsContainer = document.querySelector(".todo-cards-container");

  if (todoCardsContainer) {

    // deleting all the cards
    while (todoCardsContainer.firstChild) {
      todoCardsContainer.removeChild(todoCardsContainer.firstChild);
    }

    // fetching the card data from the DB
    let dataFromDB;

    showMainBodySpinner();
    if (filterType === "all")
      dataFromDB = await getFromDB(searchText);

    else if (filterType === "complete")
      dataFromDB = await getDataWithCompletionStatus(searchText, true);
    
    else if (filterType === "incomplete" )
      dataFromDB = await getDataWithCompletionStatus(searchText, false);
    hideMainBodySpinner();

    const { error, data } = dataFromDB;

    if (error) {
      throw new Error("Error while getting filtered data");
    }

    if (data.length === 0) {
      addEmptyTodo();
    } else {
      // setting initial as the minimum of data.length and numberOfCardsToShow
      const initial = data.length > numberOfCardsToShow ? numberOfCardsToShow : data.length;

      for (let i = 0; i < initial; ++i) {
        let todo = data[i];
        createCard(todo, searchText, filterType);
      }

      // filter buttons state updated
      const allButton = document.querySelector("#all-button");
      const incompleteButton = document.querySelector("#incomplete-button");
      const completeButton = document.querySelector("#complete-button");

      if (filterType === "all") {
        allButton.disabled = true;
        incompleteButton.disabled = false;
        completeButton.disabled = false;
      }
      else if (filterType === "incomplete") {
        incompleteButton.disabled = true;
        completeButton.disabled = false;
        allButton.disabled = false;
      }

      else if (filterType === "complete") {
        completeButton.disabled = true;
        incompleteButton.disabled = false;
        allButton.disabled = false;
      }

      // load more button created if there are more cards than initial numberOfCardsToShow
      if (initial < data.length) {
        createLoadMore(data, initial, searchText, filterType);
      }
    }
  }
}

const createLoadMore = (data, initial, searchText, filterType) => {

  const container = document.querySelector(".container");
  const loadMore = document.createElement("div");
  loadMore.setAttribute("class", "load-more");

  const loadMoreButton = document.createElement("button");
  loadMoreButton.setAttribute("id", "load-more-button");
  loadMoreButton.appendChild(document.createTextNode("Load More"));

  loadMore.appendChild(loadMoreButton);

  container.appendChild(loadMore);

  // load more button functionality
  loadMoreButton.addEventListener("click", () => {
    const loadMoreContainer= document.querySelector(".load-more");
    loadMoreContainer.remove();

    for (let i = initial; i < data.length; ++i) {
      let todo = data[i];
      createCard(todo, searchText, filterType);
    }
  });
}

const createCard = (todo, searchText, filterType) => {

  isCreateEnabled = true;

  // Select the todoCardsContainer div which contains all the cards
  const todoCardsContainer = document.querySelector(".todo-cards-container");

  if (todoCardsContainer) {
    // Creating a card item div for displaying the card of the todo object
    const cardItem = document.createElement("div");
    cardItem.setAttribute("class", "card-item");
    cardItem.setAttribute("id", `cardItem_${todo.id}`); // can be used to uniquely identify each card object

    // Set the contents of the card item div

    // Creating a spinnerContainer for each card
    const spinnerContainer = document.createElement("div");
    spinnerContainer.setAttribute("class", "spinner-container");
    const spinnerIcon = document.createElement("img");
    spinnerIcon.setAttribute("id", `spinnerIcon_${todo.id}`);
    spinnerIcon.src = "./images/spinner.svg";
    spinnerIcon.setAttribute("hidden", true);
    spinnerContainer.appendChild(spinnerIcon);
    cardItem.appendChild(spinnerContainer);

    // Creating an uneditable text paragraph element for displaying the text in the todo object
    // and appending it to the card item div
    const displayText = document.createElement("p");
    displayText.setAttribute("class", "uneditable-text");
    displayText.setAttribute("id", `displayText_${todo.id}`);
    displayText.appendChild(document.createTextNode(todo.text));
    cardItem.appendChild(displayText);

    // Creating a timestamp string
    const timestamp = toDateString(todo.created_at);

    // Creating a paragraph element for the timestamp and appending it to the card item div
    const displayTimestamp = document.createElement("p");
    displayTimestamp.setAttribute("class", "timestamp");
    displayTimestamp.appendChild(document.createTextNode(timestamp));
    cardItem.appendChild(displayTimestamp);

    // Creating a span element that will contain all the buttons and tags
    // contained by any card at any given state: edit, saved, completed, etc.
    const buttonsAndDuration = document.createElement("div");
    buttonsAndDuration.setAttribute("class", "buttons-and-duration");

    // creating an all todo buttons div just for the buttons and appending it to the span element
    const todoButtonsContainer = document.createElement("div");
    todoButtonsContainer.setAttribute("class", "all-todo-button-container");

    // creating the done button and appending it to the all todo buttons div
    const doneButton = document.createElement("input");
    doneButton.setAttribute("class", "done-button");
    doneButton.setAttribute("id", `doneButton_${todo.id}`);
    doneButton.type = "image";
    doneButton.name = "done button";
    doneButton.src = "images/done.svg";
    doneButton.alt = "done button";
    todoButtonsContainer.appendChild(doneButton);

    // followed by an eventhandler for the done button
    doneButton.addEventListener("click", () => completeTodo(todo, searchText, filterType));

    // creating the save button and appending it to the all todo buttons div
    const saveButton = document.createElement("button");
    saveButton.setAttribute("class", "save-button");
    saveButton.setAttribute("id", `saveButton_${todo.id}`);
    saveButton.appendChild(document.createTextNode("Save"));
    todoButtonsContainer.appendChild(saveButton);

    // followed by an eventhandler for the save button
    saveButton.addEventListener("click", () => saveTodo(todo));

    // creating the edit button and appending it to the all todo buttons div
    const editButton = document.createElement("input");
    editButton.setAttribute("class", "edit-button");
    editButton.setAttribute("id", `editButton_${todo.id}`);
    editButton.type = "image";
    editButton.name = "edit button";
    editButton.src = "images/edit.svg";
    editButton.alt = "edit button";
    todoButtonsContainer.appendChild(editButton);

    // followed by an eventhandler for the edit button
    editButton.addEventListener("click", () => editTodo(todo));

    // creating the delete button and appending it to the all todo buttons div
    const deleteButton = document.createElement("input");
    deleteButton.setAttribute("class", "delete-button");
    deleteButton.setAttribute("id", `deleteButton_${todo.id}`);
    deleteButton.type = "image";
    deleteButton.name = "delete button";
    deleteButton.src = "images/delete.svg";
    deleteButton.alt = "delete button";
    todoButtonsContainer.appendChild(deleteButton);

    // followed by an eventhandler for the delete button
    deleteButton.addEventListener("click", () => deleteTodo(todo, searchText, filterType));

    buttonsAndDuration.appendChild(todoButtonsContainer);

    // Creating a duration text div object and appending to the span element
    const durationText = document.createElement("div");
    durationText.setAttribute("class", "duration-text");
    durationText.setAttribute("id", `durationText_${todo.id}`);

    buttonsAndDuration.appendChild(durationText);

    cardItem.appendChild(buttonsAndDuration);

    // depending on states, show the particular elements

    if (todo.saved && !todo.completed) {
      // saved state
      displayText.removeAttribute("class");
      displayText.setAttribute("class", "uneditable-text");
      saveButton.style.display = "none";
      durationText.style.display = "none";
    } 
    
    else if (!todo.saved && !todo.completed) {
      // edit state
      const text = todo.text;
      const editText = document.createElement("textarea");
      editText.setAttribute("id", `displayText_${todo.id}`);
      editText.setAttribute("class", "input-text");
      editText.value = text;
      cardItem.replaceChild(editText, displayText);

      saveButton.style.display = "inline-block";
      doneButton.style.display = "none";
      editButton.style.display = "none";
      durationText.style.display = "none";
    } 
    
    else if (todo.completed) {
      // completed state
      // Calculating the elapsed time
      if (todo.completed) {
        let elapsedTime = calculateElapsedTime(
          todo.created_at,
          todo.completed_at
        );
        
        durationText.appendChild(
          document.createTextNode(`Completed in ${elapsedTime} days`)
        );
      }

      displayText.style.textDecoration = "line-through";
      displayText.style.color = "#0BC375";
      durationText.style.display = "inline-block";
      saveButton.style.display = "none";
      doneButton.style.display = "none";
      editButton.style.display = "none";
    }   
    todoCardsContainer.append(cardItem);
  }
}
