import { getCompleteData, getFromDB, getIncompleteData } from "./db_calls.js"
import { addTodo, calculateElapsedTime, completeTodo, deleteTodo, editTodo, saveTodo } from "./event_handlers.js"

const limit = 6; // number of cards to be displayed without pressing "Load More"

// converts a given dateString from DB to the given date format
function toDateString(dateString)
{
    const [year, month, day] = dateString.split("T")[0].split('-');   
    return `Created At: ${day}.${month}.${year.substring(2,4)}`;
}


// Add a checker for create enabled
let isCreateEnabled = true;

export function renderOnCreate()
{
//    console.log("Create clicked");
   if (isCreateEnabled)
   {
        isCreateEnabled = false;

        // select todo_cards element
        const todo_cards = document.querySelector('.todo-cards');
        // console.log(todo_cards);

        // create the unsaved card div element representing each card
        const node = document.createElement('div');  
        node.setAttribute('class', 'card-item unsaved-card'); 

        // Start to fill in the unsaved card div with various elements 

        // Create the input text area element and append it to the unsaved card div
        const input_text = document.createElement('textarea');
        input_text.setAttribute("class", "input-text");
        input_text.placeholder = "What do you want to do?";
        
        // input_text.focus(); // NOT WORKING :(
        // input_text.autofocus = true; // Autofocus processing was blocked because a document already has a focused element.
                                    // Cannot even find the element that is focused

        node.appendChild(input_text);

        // Create a todo_buttons div containing the buttons in the unsaved cards div
        const todo_buttons = document.createElement('div');
        todo_buttons.setAttribute('class', 'todo-buttons');
        
        // Create the Add Task button and appending it to the todo_buttons
        const add_task_button = document.createElement('button');
        add_task_button.setAttribute('class', 'add-task-button');
        add_task_button.appendChild(document.createTextNode("Add Task"));
        todo_buttons.appendChild(add_task_button);

        // followed by the event handler for the Add Task button 
        add_task_button.addEventListener('click', () => {
            add_task_button.disabled = true; // diasble the add task button so that multiple clicks don't create multiple cards
            addTodo();
            isCreateEnabled = true;
        });
        
        // Create the delete button and appending it to the todo_buttons
        const delete_button = document.createElement("input");
        delete_button.setAttribute('class', 'delete-button');
        delete_button.type = "image";
        delete_button.name = "delete button";
        delete_button.src="images/delete.svg";
        delete_button.alt="delete button";
        todo_buttons.appendChild(delete_button);

        // followed by the event handler for the Delete button
        delete_button.addEventListener("click", () => {
            const item = document.querySelector('.unsaved-card');
            item.remove();
            isCreateEnabled = true;
        });

        // appending the todo_button div to the unsaved cards div
        node.appendChild(todo_buttons);

        // Prepend the element to the DOM as the first child of the 
        // element referenced by the 'todo_cards' element
        todo_cards.prepend(node);
   }
   
   else
   {
       console.log("Create is disabled");
   }

}

export async function renderAllData(search_text)
{
    // selecting the todo card div containing all the cards
    const todo_cards = document.querySelector('.todo-cards'); 
    
    // deleting all the cards
    while(todo_cards.firstChild)
    {
        todo_cards.removeChild(todo_cards.firstChild);
    }

    // fetching the card data from the DB
    const {error, data} = await getFromDB(search_text);

    if(error)
    {
        throw new Error("Error while getting filtere data");
    }

    // setting initial as the minimum of data.length and limit
    const initial = (data.length > limit) ? limit : data.length;

    for (let i = 0; i < initial; ++i)
    {
        let todo = data[i];
        createCard(todo);
    }

    // all button activated
    const all_button = document.querySelector('#all-button');
    if (all_button.disabled === true) all_button.disabled = false;

    // load more button created if there are more cards than initial limit
    if (initial < data.length)
    {
        const load_more = document.createElement("div");
        load_more.setAttribute('class', 'load-more');


        const load_more_button = document.createElement("button");
        load_more_button.setAttribute('id', 'load-more-button');
        load_more_button.appendChild(document.createTextNode("Load More"));
    
        load_more.appendChild(load_more_button);

        todo_cards.appendChild(load_more);
    
        // load more button functionality
        load_more_button.addEventListener('click', () => {
            load_more_button.disabled = true;
            load_more_button.style.display = 'none';
    
            for (let i = initial; i < data.length; ++i)
            {
                let todo = data[i];
                createCard(todo);
            }
    
        });
    }

}

export async function renderFilteredData(type, search_text)
{
    // selecting the todo card div containing all the cards
    const todo_cards = document.querySelector('.todo-cards'); 
    
    // deleting all the cards
    while(todo_cards.firstChild)
    {
        todo_cards.removeChild(todo_cards.firstChild);
    }

    // fetching the card data from the DB based on the filter

    // When the filter is incomplete
    if (type === 'incomplete')
        var {error, data} = await getIncompleteData(search_text);

    else if (type === 'complete')
        var {error, data} = await getCompleteData(search_text);

    if (error)
    {
        throw new Error("Error while getting filtered data");
    }

    // setting initial as the minimum between data.length and limit
    const initial = (data.length > limit) ? limit : data.length;

    for (let i = 0; i < initial; ++i)
    {
        let todo = data[i];
        createCard(todo);
    }

    const incomplete_button = document.querySelector('#incomplete-button');
    const complete_button = document.querySelector('#complete-button');
    
    if (incomplete_button.disabled === true) incomplete_button.disabled = false;
    if (complete_button.disabled === true) complete_button.disabled = false;

    // if anymore data is left load them
    if (initial < data.length)
    {
        const load_more = document.createElement("div");
        load_more.setAttribute('class', 'load-more');

        const load_more_button = document.createElement("button");
        load_more_button.setAttribute('id', 'load-more-button');
        load_more_button.appendChild(document.createTextNode("Load More"));
    
        load_more.appendChild(load_more_button);

        todo_cards.appendChild(load_more);
        
        // load more button functionality
        load_more_button.addEventListener('click', () => {
            load_more_button.disabled = true;
            load_more_button.style.display = 'none';
    
            for (let i = initial; i < data.length; ++i)
            {
                let todo = data[i];
                createCard(todo);
            }
    
        });
    }
}

function createCard(todo)
{
    // Select the todo_cards div which contains all the cards
    const todo_cards = document.querySelector('.todo-cards');

    // Creating a card item div for displaying the card of the todo object
    const node = document.createElement("div");
    node.setAttribute('class', 'card-item');
    node.setAttribute('data-key', todo.id); // can be used to uniquely identify each card object

    // Set the contents of the card item div

    // Creating an uneditable text paragraph element for displaying the text in the todo object
    // and appending it to the card item div
    const display_text = document.createElement("p");
    display_text.setAttribute('class', 'uneditable-text');
    display_text.setAttribute('id', `display_text_${todo.id}`);
    display_text.appendChild(document.createTextNode(todo.text));
    node.appendChild(display_text);

    // Creating a timestamp string
    const timestamp = toDateString(todo.created_at);

    // Creating a paragraph element for the timestamp and appending it to the card item div
    const display_timestamp = document.createElement("p");
    display_timestamp.setAttribute('class', 'timestamp');
    display_timestamp.appendChild(document.createTextNode(timestamp));
    node.appendChild(display_timestamp);

    // Creating a span element that will contain all the buttons and tags 
    // contained by any card at any given state: edit, saved, completed, etc.
    const span_element = document.createElement('span');

    // creating an all todo buttons div just for the buttons and appending it to the span element
    const all_todo_buttons = document.createElement("div");
    all_todo_buttons.setAttribute('class', 'all-todo-buttons');
    
    // creating the done button and appending it to the all todo buttons div
    const done_button = document.createElement("input");
    done_button.setAttribute('class', 'done-button');
    done_button.setAttribute('id', `done_button_${todo.id}`);
    done_button.type = "image";
    done_button.name = "done button";
    done_button.src="images/done.svg";
    done_button.alt="done button";
    all_todo_buttons.appendChild(done_button);

    // followed by an eventhandler for the done button
    done_button.addEventListener("click", () => completeTodo(todo));

    // creating the save button and appending it to the all todo buttons div
    const save_button = document.createElement("button");
    save_button.setAttribute('class', 'save-button');
    save_button.setAttribute('id', `save_button_${todo.id}`);
    save_button.appendChild(document.createTextNode("Save"));
    all_todo_buttons.appendChild(save_button);

    // followed by an eventhandler for the save button
    save_button.addEventListener("click", () => saveTodo(todo))

    // creating the edit button and appending it to the all todo buttons div
    const edit_button = document.createElement("input");
    edit_button.setAttribute('class', 'edit-button');
    edit_button.setAttribute('id', `edit_button_${todo.id}`);
    edit_button.type = "image";
    edit_button.name = "edit button";
    edit_button.src="images/edit.svg";
    edit_button.alt="edit button";
    all_todo_buttons.appendChild(edit_button);

    // followed by an eventhandler for the edit button
    edit_button.addEventListener("click", () => editTodo(todo));

    // creating the delete button and appending it to the all todo buttons div
    const delete_button = document.createElement("input");
    delete_button.setAttribute('class', 'delete-button');
    delete_button.setAttribute('id', `delete_button_${todo.id}`);
    delete_button.type = "image";
    delete_button.name = "delete button";
    delete_button.src="images/delete.svg";
    delete_button.alt="delete button";
    all_todo_buttons.appendChild(delete_button);

    // followed by an eventhandler for the delete button
    delete_button.addEventListener("click", () => deleteTodo(todo));

    span_element.appendChild(all_todo_buttons);

    // Creating a duration text div object and appending to the span element
    const duration_text = document.createElement("div");
    duration_text.setAttribute('class', 'duration-text');
    duration_text.setAttribute('id', `duration_text_${todo.id}`);

    span_element.appendChild(duration_text);
   
    node.appendChild(span_element);

    // depending on states, show the particular elements

    if (todo.saved && !todo.completed) // saved state
    {
        display_text.removeAttribute('class');
        display_text.setAttribute('class', 'uneditable-text');
        save_button.style.display = "none";
        duration_text.style.display = "none";
    }

    else if (!todo.saved && !todo.completed) // edit state
    {
        display_text.contentEditable = true;
        display_text.setAttribute('class', 'input-text');
        save_button.style.display = "inline-block";
        done_button.style.display = "none";
        edit_button.style.display = "none";
        duration_text.style.display = "none";
    }

    else if (todo.completed) // completed state
    {
        // Calculating the elapsed time
        if (todo.completed)
        {
            let elapsed_time = calculateElapsedTime(todo.created_at, todo.completed_at);
            // console.log(elapsed_time);
            duration_text.appendChild(document.createTextNode(`Completed in ${elapsed_time} days`));
        }

        display_text.style.textDecoration = "line-through";
        display_text.style.color = "#0BC375";
        duration_text.style.display = "inline-block";   
        save_button.style.display = "none";
        done_button.style.display = "none";
        edit_button.style.display = "none";
    }

    todo_cards.append(node);
}