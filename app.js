"use strict";

// const toDoLS = {
//   id: 0,
//   text: "",
//   done: bool,
//
// };

// Selectors
const toDoInput = document.querySelector(".todo-input");
const toDoButton = document.querySelector(".todo-button");
const toDoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-dodo")

// Event Listeners
document.addEventListener('DOMContentLoaded', getAndDisplayToDosFromLocalStorage)
toDoButton.addEventListener('click', addToDo)
toDoList.addEventListener('click', deleteAndCheck)
filterOption.addEventListener("click", filterToDo)

// Functions
function deleteAndCheck(event) {
    const item = event.target;   // the object that was pressed
    const toDoDiv = item.parentElement
    if (item.classList[0] === "complete-btn") {
        toDoDiv.classList.toggle("completed")
        updateToDoInLS(toDoDiv)
    }
    if (item.classList[0] === "delete-btn") {
        // small animation on delete
        toDoDiv.classList.add("fall-anim")

        removeToDoFromLocalStorage(toDoDiv)

        toDoDiv.addEventListener('transitionend', function () {
            item.parentElement.remove()
        })

    }
}


function addToDo(event) {
    event.preventDefault()      //to prevent the default refresh of the page on submit

    const toDoTask = toDoInput.value;
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

    //  save in local storage, the toDoDiv id is setted
    saveInLocalStorage(toDoTask,toDoDiv)

    // append to the unordered list
    toDoList.appendChild(toDoDiv)

}

function filterToDo(event) {
    const filter = event.target.value
    const toDos = toDoList.childNodes;
    toDos.forEach(function (todo) {
        switch (filter) {
            case "all":
                todo.style.display = "flex";
                break;
            case "finished":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "in-progress":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "none";
                } else {
                    todo.style.display = "flex";
                }
                break;
        }
    })
}

function getToDosFromLS() {
    let toDoItems;
    // if already present in local storage
    if (localStorage.getItem('toDos') == null) {
        toDoItems = []
    } else {
        toDoItems = JSON.parse(localStorage.getItem("toDos"))
    }
    return toDoItems
}

// the toDo is a text value
function saveInLocalStorage(toDo,toDoDiv) {
    let toDoItems = getToDosFromLS();

    const toDoObj = {
        id: toDoItems.length + 1,
        text: toDo,
        done: false,

    };

    toDoDiv.id = toDoObj.id

    toDoItems.push(toDoObj)
    localStorage.setItem("toDos", JSON.stringify(toDoItems))
}

function updateToDoInLS(toDoDiv){
    const toDoID = Number(toDoDiv.id);

    let toDoItems = getToDosFromLS();

    const toBeUpdatedItemIndex = toDoItems.findIndex(function (toDo) {
        return toDo.id === toDoID
    })

    toDoItems[toBeUpdatedItemIndex].done = !toDoItems[toBeUpdatedItemIndex].done
    localStorage.setItem("toDos", JSON.stringify(toDoItems))

}

function getAndDisplayToDosFromLocalStorage() {

    let toDoItems = getToDosFromLS();

    toDoItems.forEach(function (toDo) {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo");

        // create li
        const newToDoLI = document.createElement("li");
        newToDoLI.classList.add("todo-item");
        newToDoLI.innerText = toDo.text;

        // create done mark button
        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");

        // create delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add("delete-btn");

        // the to do div contains such children as todoLI check button and delete button
        toDoDiv.appendChild(newToDoLI);
        toDoDiv.appendChild(completedButton);
        toDoDiv.appendChild(deleteButton);

        if (toDo.done){
            toDoDiv.classList.toggle("completed");
        }

        // setting the id of the div as the id of the object from the local storage, but transforming ID into string
        toDoDiv.id = toDo.id.toString();

        // append to the unordered list
        toDoList.appendChild(toDoDiv);
    })

}


function removeToDoFromLocalStorage(toDoDiv) {
    const toDoID = Number(toDoDiv.id);

    let toDoItems = getToDosFromLS();

    const toBeDeletedItemIndex = toDoItems.findIndex(function (toDo) {
        return toDo.id === toDoID
    })

    toDoItems.splice(toBeDeletedItemIndex, 1);
    localStorage.setItem("toDos", JSON.stringify(toDoItems));
}
