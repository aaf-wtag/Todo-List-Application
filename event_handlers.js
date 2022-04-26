import {
  deleteFromDB,
  insertIntoDB,
  updateCompletedAt,
  updateCompletedState,
  updateSavedState,
  updateText,
} from "./db_calls.js";
import { renderData} from "./render.js";
import { hideSpinner, showSpinner } from "./spinner.js";
import { showToast } from "./toast.js";

export const addTodo = async(searchText, filterType) => {
  const input = document.querySelector(".input-text");
  const text = input.value.trim(); // trim white spaces in the text

  // Cannot create a card with empty text field
  if (text) {
    const addTaskButton = document.querySelector('.add-task-button');
    addTaskButton.disabled = true; // diasble the add task button so that multiple clicks don't create multiple cards
    
    const deleteButton = document.getElementById('deleteButton_unsaved');
    deleteButton.disabled = true;

    showSpinner();

    try {
      await insertIntoDB(text, false, true);
      showToast(true);
    }
    catch {
      showSpinner(false);
    }
    finally {
      hideSpinner();
      renderData(searchText, filterType);
      
    }    
  }
}

export const editTodo = async (todo) => {
  const cardItem = document.getElementById(`cardItem_${todo.id}`);
  const displayText = document.getElementById(`displayText_${todo.id}`);
  const saveButton = document.getElementById(`saveButton_${todo.id}`);
  const editButton= document.getElementById(`editButton_${todo.id}`);
  const doneButton = document.getElementById(`doneButton_${todo.id}`);
  const durationText = document.getElementById(`durationText_${todo.id}`);
  const deleteButton = document.getElementById(`deleteButton_${todo.id}`);

  editButton.disabled = true;
  doneButton.disabled = true;
  deleteButton.disabled = true;

  showSpinner(todo.id);
  todo.saved = false;
  // updating in DB
  try {
    await updateSavedState(todo.id, todo.saved);
    
    // showing the relevant elements
    const text = displayText.textContent;
    const editText = document.createElement("textarea");
    editText.setAttribute("id", `displayText_${todo.id}`);
    editText.setAttribute("class", "input-text");
    editText.value = text;
    
    cardItem.replaceChild(editText, displayText);
    
    saveButton.style.display = "inline-block";
    doneButton.style.display = "none";
    editButton.style.display = "none";
    durationText.style.display = "none";
    showToast(true);
  }
  catch {
    showToast(false);
  }

  finally {
    editButton.disabled = false;
    doneButton.disabled = false;
    deleteButton.disabled = false;
    hideSpinner(todo.id);
  }
}

export const saveTodo = async (todo) => {
  const cardItem = document.getElementById(`cardItem_${todo.id}`);
  const saveButton = document.getElementById(`saveButton_${todo.id}`);
  const editButton= document.getElementById(`editButton_${todo.id}`);
  const doneButton = document.getElementById(`doneButton_${todo.id}`);
  const durationText = document.getElementById(`durationText_${todo.id}`);
  const deleteButton = document.getElementById(`deleteButton_${todo.id}`);

  saveButton.disabled = true;
  deleteButton.disabled = true;

  showSpinner(todo.id);
  // updating in DB
  todo.saved = true;
  try {
    await updateSavedState(todo.id, todo.saved);
    // obtaining the text
    const editText = document.getElementById(`displayText_${todo.id}`);
    todo.text = editText.value;
  
    // updating in DB
    await updateText(todo.id, todo.text);
  
    // showing the relevant elements
    const displayText = document.createElement("p");
    displayText.setAttribute("id", editText.id);
    displayText.setAttribute("class", "uneditable-text");
    displayText.appendChild(document.createTextNode(todo.text));
  
    cardItem.replaceChild(displayText, editText);
  
    doneButton.style.display = "inline-block";
    editButton.style.display = "inline-block";
    saveButton.style.display = "none";
    durationText.style.display = "none";

    showToast(true);
  }
  catch {
    showToast(false);
  }

  finally {
    saveButton.disabled = false;
    deleteButton.disabled = false;
    hideSpinner(todo.id);
  }
}

export const completeTodo = async (todo, searchText, filterType) => {
  todo.completed = true;

  const displayText = document.getElementById(`displayText_${todo.id}`);
  const saveButton = document.getElementById(`saveButton_${todo.id}`);
  const editButton= document.getElementById(`editButton_${todo.id}`);
  const doneButton = document.getElementById(`doneButton_${todo.id}`);
  const durationText = document.getElementById(`durationText_${todo.id}`);
  const deleteButton = document.getElementById(`deleteButton_${todo.id}`);

  editButton.disabled = true;
  deleteButton.disabled = true;
  doneButton.disabled = true;

  showSpinner(todo.id);
  // updating in DB
  try {
    await updateCompletedState(todo.id, todo.completed);
    const completionTime = new Date(Date.now());
    await updateCompletedAt(todo.id, completionTime);
    const elapsedTime = calculateElapsedTime(todo.created_at, completionTime);

    // showing the relevant elements
    displayText.style.textDecoration = "line-through";
    displayText.style.color = "#0BC375";

    // editing the duration tag
    const elapsedTimeNode = document.createTextNode(
      `Completed in ${elapsedTime} days`
    );
    durationText.appendChild(elapsedTimeNode);

    durationText.style.display = "inline-block";
    saveButton.style.display = "none";
    doneButton.style.display = "none";
    editButton.style.display = "none";
    showToast(true);
  }
  catch {
    showToast(false);
  }
  finally {
    hideSpinner(todo.id);
    editButton.disabled = false;
    deleteButton.disabled = false;
    doneButton.disabled = false;
    renderData(searchText, filterType);
  }

  
}

export const calculateElapsedTime = (startDateString, endDate) => {
  const start = new Date(startDateString);
  const end = new Date(endDate);

  const startInMs = Number(start);
  const endInMs = Number(end);

  return Math.round((endInMs - startInMs) / (24 * 3600 * 1000)); // converting the milliseconds to days (rounded)
}

export const deleteTodo = async (todo, searchText, filterType) => {
  // console.log(`${todo.text} object's Delete clicked!`);

  const saveButton = document.getElementById(`saveButton_${todo.id}`);
  const editButton= document.getElementById(`editButton_${todo.id}`);
  const doneButton = document.getElementById(`doneButton_${todo.id}`);
  const deleteButton = document.getElementById(`deleteButton_${todo.id}`);

  saveButton.disabled = true;
  editButton.disabled = true;
  doneButton.disabled = true;
  deleteButton.disabled = true;
  
  showSpinner(todo.id);
  // delete the todo from database
  try {
    await deleteFromDB(todo.id);
    // identify the particular card by its time_started and remove it
    const cardItem = document.getElementById(`cardItem_${todo.id}`);
    cardItem.remove();
    showToast(true);
  }
  catch {
    showToast(false);
  }
  finally {
    hideSpinner(todo.id);
    saveButton.disabled = false;
    editButton.disabled = false;
    doneButton.disabled = false;
    deleteButton.disabled = false;
    renderData(searchText, filterType);
  }
}
