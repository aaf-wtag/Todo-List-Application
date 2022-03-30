import { deleteFromDB, insertIntoDB, updateCompletedAt, updateCompletedState, updateSavedState, updateText } from "./db_calls.js";
import { renderAllData } from "./render.js";

export async function addTodo()
{
    const input = document.querySelector(".input-text");
    const text = input.value.trim(); // trim white spaces in the text
    //console.log(text);

    // Cannot create a card with empty text field
    if (text != "")
    {
        await insertIntoDB(text, false, true);
        renderAllData("");
    }

}

export async function editTodo(todo)
{
    todo.saved = false;

    // updating in DB
    await updateSavedState(todo.id, todo.saved);

    // showing the relevant elements
    const display_text = document.getElementById(`display_text_${todo.id}`);
    const save_button = document.getElementById(`save_button_${todo.id}`);
    const edit_button = document.getElementById(`edit_button_${todo.id}`);
    const done_button = document.getElementById(`done_button_${todo.id}`);
    const duration_text = document.getElementById(`duration_text_${todo.id}`);

    display_text.contentEditable = true;
    display_text.setAttribute('class', 'input-text');
    save_button.style.display = "inline-block";
    done_button.style.display = "none";
    edit_button.style.display = "none";
    duration_text.style.display = "none";
}

export async function saveTodo(todo)
{
    todo.saved = true;

    // updating in DB
    await updateSavedState(todo.id, todo.saved);

    // Obtaining the text
    const display_text = document.getElementById(`display_text_${todo.id}`);
    display_text.contentEditable = false;
    display_text.removeAttribute('class');
    display_text.setAttribute('class', 'uneditable-text');
    todo.text = display_text.textContent;
    // console.log(todo.text);
    
    // updating in DB
    await updateText(todo.id, todo.text);

    // showing the relevant elements
    const save_button = document.getElementById(`save_button_${todo.id}`);
    const edit_button = document.getElementById(`edit_button_${todo.id}`);
    const done_button = document.getElementById(`done_button_${todo.id}`);
    const duration_text = document.getElementById(`duration_text_${todo.id}`);

    
    done_button.style.display = "inline-block";
    edit_button.style.display = "inline-block";
    save_button.style.display = "none";
    duration_text.style.display = "none";
}

export async function completeTodo(todo)
{
    todo.completed = true;
    
    // updating in DB
    await updateCompletedState(todo.id, todo.completed);

    const completion_time = new Date(Date.now());
    await updateCompletedAt(todo.id, completion_time);


    const elapsed_time = calculateElapsedTime(todo.created_at, completion_time);

    // console.log(elapsed_time);
    

    // showing the relevant elements
    const display_text = document.getElementById(`display_text_${todo.id}`);
    const save_button = document.getElementById(`save_button_${todo.id}`);
    const edit_button = document.getElementById(`edit_button_${todo.id}`);
    const done_button = document.getElementById(`done_button_${todo.id}`);
    const duration_text = document.getElementById(`duration_text_${todo.id}`);

    display_text.style.textDecoration = "line-through";
    display_text.style.color = "#0BC375";

    // editing the duration tag
    const elapsed_time_node = document.createTextNode(`Completed in ${elapsed_time} days`);
    duration_text.appendChild(elapsed_time_node);

    duration_text.style.display = "inline-block";   
    save_button.style.display = "none";
    done_button.style.display = "none";
    edit_button.style.display = "none";

}

export function calculateElapsedTime(startDateString, endDate)
{
    const start = new Date(startDateString);
    const end = new Date(endDate);

    const start_ms = Number(start); 
    const end_ms = Number(end);

    return Math.round((end_ms - start_ms) / (24 * 60 * 60 * 1000)); // converting the milliseconds to days (rounded)

}

export async function deleteTodo(todo)
{
    // console.log(`${todo.text} object's Delete clicked!`);

    // delete the todo from database
    await deleteFromDB(todo.id);

    // identify the particular card by its time_started and remove it
    const cardItem = document.querySelector(`[data-key='${todo.id}']`);
    cardItem.remove();
}
