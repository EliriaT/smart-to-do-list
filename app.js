"use strict";

// Selectors
const toDoInput = document.querySelector(".todo-input");
const toDoButton = document.querySelector(".todo-button");
const toDoList = document.querySelector(".todo-list");

// Event Listeners
toDoButton.addEventListener('click', addToDo)
toDoList.addEventListener('click', deleteAndCheck)

// Functions
function deleteAndCheck(event){
    const item = event.target;   // the object that was pressed

    if (item.classList[0] === "complete-btn"){
        item.parentElement.classList.toggle("completed")
    }
    if (item.classList[0] === "delete-btn"){
        // small animation on delete
        const toDoDiv = item.parentElement
        toDoDiv.classList.add("fall-anim")
        toDoDiv.addEventListener('transitionend', function (){
            item.parentElement .remove()
        })

    }
}


function addToDo(event) {
    event.preventDefault()      //to prevent the default refresh of the page on submit

    const toDoTask  = toDoInput.value;
    toDoInput.value = "";

    // create todo div
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo");

    // create li
    const newToDoLI = document.createElement("li");
    newToDoLI.classList.add("todo-item");
    newToDoLI.innerText = toDoTask;

    // create done mark button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");

    // create delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("delete-btn");

    // the to do div contains such children as todoLI check button and delete button
    toDoDiv.appendChild(newToDoLI)
    toDoDiv.appendChild(completedButton)
    toDoDiv.appendChild(deleteButton)

    // append to the unordered list
    toDoList.appendChild(toDoDiv)

}