"use strict";

// const toDoLS = {
//   id: uuid,
//   text: "",
//   done: bool,
//   date: date,
//   time: time
//   notifyBeforeValue: int
//   notifyChoice: month/days/hours
// };

// const notification ={
//    id: uuid,
//    text :"",
//    remaining:""
// }

// creez un to do
// programez notificarea data nu e in trecut deadline-ul
// stochez notificarea in LS
// la refresh scheduling-ul e resetat, deci e nevoie iarasi sa obtin notificarile din LS
// sa afisez notificarile deja trecute
// sa programez  notificarile care inca urmeaza sa apara
// even after refresh, notifications are scheduled, and seen notifications are persisted till user deletes them

// Constants and vars
const TO_DO_STORAGE_KEY = "to-dos";
const USERNAME_STORAGE_KEY = "username";
const NOTIFICATION_STORAGE_KEY = "notifications";
let currDate = new Date();
let currYear = currDate.getFullYear();
let currMonth = currDate.getMonth();
let currDay = currDate.getDay();
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

// Selectors
const toDoInput = document.querySelector(".todo-input");
const toDoButton = document.querySelector(".todo-button");
const toDoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const nameInput = document.getElementById('nameInput');
const hiButton = document.querySelector(".hiButton");
const toDoListName = document.querySelector(".headerName");
const date = document.getElementById("date");
const time = document.getElementById("time");
const notifyInterval = document.querySelector(".notify-interval-select");
const notifyChoice = document.querySelector(".notify-choice-select");
const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days ");
const prevIcon = document.getElementById("prev");
const nextIcon = document.getElementById("next");

// Event Listeners
document.addEventListener('DOMContentLoaded', getAndDisplayToDosFromLocalStorage);
document.addEventListener('DOMContentLoaded', getUsername);
document.addEventListener('DOMContentLoaded', scheduleNotifications);
// document.addEventListener('DOMContentLoaded', loadNotificationsFromLS);
toDoButton.addEventListener('click', addToDo);
toDoList.addEventListener('click', deleteAndCheck);
filterOption.addEventListener("click", filterToDo);
nameInput.addEventListener("blur", focusAlwaysOn);
nameInput.addEventListener("input", helloGreeting);
nameInput.addEventListener("keypress", checkIfEnter);
hiButton.addEventListener("click", saveUserNameInLS);
nextIcon.addEventListener("click", () => {
    currMonth = currMonth + 1;
    if (currMonth < 0 || currMonth > 11) {
        // creating a new date of current year & month and pass it as date value
        let date = new Date(currYear, currMonth);
        currYear = date.getFullYear(); // updating current year with new date year
        currMonth = date.getMonth(); // updating current month with new date month
    } else {
        currDate = new Date(); // pass the current date as date value
    }
    renderCalendar();
})
prevIcon.addEventListener("click", () => {
    currMonth = currMonth - 1;
    if (currMonth < 0 || currMonth > 11) {
        // creating a new date of current year & month and pass it as date value
        let date = new Date(currYear, currMonth);
        currYear = date.getFullYear(); // updating current year with new date year
        currMonth = date.getMonth(); // updating current month with new date month
    } else {
        currDate = new Date(); // pass the current date as date value
    }
    renderCalendar();
})


// Function calls
// schedule checking deadling every 30 minutes
setInterval(checkDeadline, 1000 * 60 * 30)
renderCalendar()

// Functions
function renderCalendar() {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";

    for (let i = firstDayOfMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === currDate.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

}

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

    // refresh to do list according to current filter
    toDoDiv.addEventListener('transitionend', function () {
        filterOption.click()
    })


}


function addToDo(event) {
    event.preventDefault()      //to prevent the default refresh of the page on submit

    const toDoTask = toDoInput.value;
    toDoInput.value = "";

    // create todo div
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo");

    // const firstRowDiv = document.createElement("div")
    // firstRowDiv.classList.add("todo");

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


    const calendarIcon = document.createElement("i")
    calendarIcon.classList.add("fa-regular")
    calendarIcon.classList.add("fa-calendar")

    const dateT = document.createElement("p")
    dateT.classList.add("dateT")
    dateT.innerText = date.value

    const dotIcon = document.createElement("i")
    dotIcon.classList.add("fa-solid")
    dotIcon.classList.add("fa-circle")

    const clockIcon = document.createElement("i")
    clockIcon.classList.add("fa-solid")
    clockIcon.classList.add("fa-clock")

    const timeT = document.createElement("p")
    timeT.classList.add("timeT")
    timeT.innerText = time.value

    // the to do div contains such children as todoLI check button and delete button
    toDoDiv.appendChild(newToDoLI);
    toDoDiv.appendChild(calendarIcon);
    toDoDiv.appendChild(dateT);
    toDoDiv.appendChild(dotIcon);
    toDoDiv.appendChild(clockIcon);
    toDoDiv.appendChild(timeT);

    toDoDiv.appendChild(completedButton);
    toDoDiv.appendChild(deleteButton);


    //  save in local storage, the toDoDiv id is setted
    saveToDoInLocalStorage(toDoTask, toDoDiv, date.value, time.value, notifyInterval.value, notifyChoice.value)

    // append to the unordered list
    toDoList.appendChild(toDoDiv)

    // refresh to do list according to current filter
    filterOption.click()

    checkDeadline()


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
    if (localStorage.getItem(TO_DO_STORAGE_KEY) == null) {
        toDoItems = []
    } else {
        toDoItems = JSON.parse(localStorage.getItem(TO_DO_STORAGE_KEY))
    }
    return toDoItems
}

// the toDo is a text value
function saveToDoInLocalStorage(toDo, toDoDiv, dateV, timeV, interval, choice) {
    let toDoItems = getToDosFromLS();

    const toDoObj = {
        id: crypto.randomUUID(),
        text: toDo,
        done: false,
        date: dateV,
        time: timeV,
        notifyBeforeValue: interval,
        notifyChoice: choice

    };

    toDoDiv.id = toDoObj.id

    toDoItems.push(toDoObj)
    localStorage.setItem(TO_DO_STORAGE_KEY, JSON.stringify(toDoItems))

    // // after storing one to Do, it must be tried to schedule it
    scheduleOneToDo(toDoObj)
}

function updateToDoInLS(toDoDiv) {
    const toDoID = toDoDiv.id;

    let toDoItems = getToDosFromLS();

    const toBeUpdatedItemIndex = toDoItems.findIndex(function (toDo) {
        return toDo.id === toDoID
    })

    toDoItems[toBeUpdatedItemIndex].done = !toDoItems[toBeUpdatedItemIndex].done
    localStorage.setItem(TO_DO_STORAGE_KEY, JSON.stringify(toDoItems))

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

        const calendarIcon = document.createElement("i")
        calendarIcon.classList.add("fa-regular")
        calendarIcon.classList.add("fa-calendar")

        const dateT = document.createElement("p")
        dateT.classList.add("dateT")
        dateT.innerText = toDo.date

        const clockIcon = document.createElement("i")
        clockIcon.classList.add("fa-solid")
        clockIcon.classList.add("fa-clock")

        const dotIcon = document.createElement("i")
        dotIcon.classList.add("fa-solid")
        dotIcon.classList.add("fa-circle")

        const timeT = document.createElement("p")
        timeT.classList.add("timeT")
        timeT.innerText = toDo.time


        // the to do div contains such children as todoLI check button and delete button and others
        toDoDiv.appendChild(newToDoLI);
        toDoDiv.appendChild(calendarIcon);
        toDoDiv.appendChild(dateT);
        toDoDiv.appendChild(dotIcon);
        toDoDiv.appendChild(clockIcon);
        toDoDiv.appendChild(timeT);

        toDoDiv.appendChild(completedButton);
        toDoDiv.appendChild(deleteButton);

        if (toDo.done) {
            toDoDiv.classList.toggle("completed");
        }

        // setting the id of the div as the id of the object from the local storage, but transforming ID into string
        toDoDiv.id = toDo.id;

        // append to the unordered list
        toDoList.appendChild(toDoDiv);
    })
    nameInput.value = ""
    checkDeadline()

}


function removeToDoFromLocalStorage(toDoDiv) {
    const toDoID = toDoDiv.id;

    let toDoItems = getToDosFromLS();

    const toBeDeletedItemIndex = toDoItems.findIndex(function (toDo) {
        return toDo.id === toDoID
    })

    toDoItems.splice(toBeDeletedItemIndex, 1);
    localStorage.setItem(TO_DO_STORAGE_KEY, JSON.stringify(toDoItems));
}

function getUsername() {
    let username;
    // if already present in local storage
    if (localStorage.getItem(USERNAME_STORAGE_KEY) == null) {
        username = ""
    } else {
        username = JSON.parse(localStorage.getItem(USERNAME_STORAGE_KEY))
    }

    if (username !== "") {
        toDoListName.innerText = username + "'s To Do List!"
        document.querySelector(".popUpMain").style.display = "none";

    }
}

function focusAlwaysOn() {
    setTimeout(function () {
        nameInput.focus();
    });
}

function helloGreeting() {
    hiButton.innerText = "Hi " + nameInput.value
}

function saveUserNameInLS() {
    const username = nameInput.value
    localStorage.setItem(USERNAME_STORAGE_KEY, JSON.stringify(username))
    toDoListName.innerText = username + "'s To Do List!"
    document.querySelector(".popUpMain").style.display = "none";


}

function checkIfEnter(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        hiButton.click();
    }
}

function checkDeadline() {
    let toDoItems = getToDosFromLS();
    const currentDateTime = new Date();
    const hour = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const time = ('0' + hour).slice(-2) + ":" + ('0' + minutes).slice(-2);

    const year = currentDateTime.getFullYear();
    const month = currentDateTime.getMonth() + 1;
    const day = currentDateTime.getDate();

    const date = year.toString() + "-" + ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);

    toDoItems.forEach(function (toDo) {
        const toDoDiv = document.getElementById(toDo.id)

        if ((compareDates(toDo.date, date) === "=" && toDo.time < time) || compareDates(toDo.date, date) === false) {

            toDoDiv.classList.add("lateDeadline")

        }

    })

}

function compareDates(d1, d2) {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    // console.log(date1)
    // console.log(d2)

    if (date1 < date2) {
        return false;
    } else if (date1 > date2) {
        return true;
    } else if (date1 === date2) {
        return "="
    }
}

function notify(message, dueTime, divId) {
    (() => {
        let n = document.createElement("div");
        n.classList.add("notification");

        const firstRow = document.createElement("div")
        firstRow.classList.add("firstRowNotif")

        const header = document.createElement("h3");
        header.innerText = "Reminder";

        const task = document.createElement("h4");
        task.innerText = message

        const tillTime = document.createElement("h5");
        tillTime.innerText = dueTime;


        const xButton = document.createElement("button");
        xButton.innerHTML = '<i class="fa-solid fa-x"></i>';
        xButton.addEventListener("click", function (event) {
            n.style.display = "none"
            removeNotificationFromLocalStorage(n.id)

        })

        firstRow.appendChild(header)
        firstRow.appendChild(xButton)

        n.appendChild(firstRow)
        n.appendChild(task)
        n.appendChild(tillTime)
        n.id = divId
        document.getElementById("notification-area").appendChild(n);

    })();
}

function getNotifications() {
    let notifications;
    // if already present in local storage
    if (localStorage.getItem(NOTIFICATION_STORAGE_KEY) == null) {
        notifications = []
    } else {
        notifications = JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY))
    }
    return notifications
}

function saveNotificationsInLS(text, remainingTime, uuid) {
    let notifications = getNotifications();

    const notification = {
        id: uuid,
        text: text,
        remaining: remainingTime

    };

    notifications.push(notification)
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications))

}


function removeNotificationFromLocalStorage(id) {
    let notifications = getNotifications();

    const toBeDeletedItemIndex = notifications.findIndex(function (n) {
        return n.id === id
    })

    notifications.splice(toBeDeletedItemIndex, 1);
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
}

function scheduleNotifications() {
    let toDos = getToDosFromLS();

    toDos.forEach(function (toDo) {
        // sa formez o data noua
        // sa verific ca data la to do nu e deja din trecut
        // sa gasesc data pentru notificare
        // sa verific ca data  pentru notificare nu e in trecut
        // daca nu e in trecut, sa setez timerul pentru notificare

        scheduleOneToDo(toDo)
    })

    let notifications = getNotifications()
    notifications.forEach(function (n) {
        // sa formez o data noua
        // sa verific ca data la to do nu e deja din trecut
        // sa gasesc data pentru notificare
        // sa verific ca data  pentru notificare nu e in trecut
        // daca nu e in trecut, sa setez timerul pentru notificare

        notify(n.text, n.remaining, n.id)
    })

}

function scheduleOneToDo(toDo) {
    const currentDateTime = new Date();
    const toDoDate = new Date(toDo.date + " " + toDo.time);
    let beforeNotification = 0

    // find the notify time
    if (toDoDate - currentDateTime > 0) {
        // console.log(toDoDate)
        switch (toDo.notifyChoice) {
            case "months":
                toDoDate.setMonth(toDoDate.getMonth() - parseInt(toDo.notifyBeforeValue));
                break;
            case "days":
                toDoDate.setDate(toDoDate.getDate() - parseInt(toDo.notifyBeforeValue));
                break;
            case "hours":
                toDoDate.setHours(toDoDate.getHours() - parseInt(toDo.notifyBeforeValue));
                break;
            case "minutes":
                toDoDate.setMinutes(toDoDate.getMinutes() - parseInt(toDo.notifyBeforeValue));
                break;
        }
        // console.log(toDo.notifyBeforeValue)
    }
    // check if notify time is not in the past
    if (toDoDate - currentDateTime > 0) {
        beforeNotification = toDoDate - currentDateTime;
        const remainingTime = "Remaining " + toDo.notifyBeforeValue + " " + toDo.notifyChoice
        const uuid = crypto.randomUUID()
        setTimeout(function () {

            notify(toDo.text, remainingTime, uuid)
            // save notifications that already appeared, to retrieve them later from LS
            saveNotificationsInLS(toDo.text, remainingTime, uuid)
        }, beforeNotification)


    }
}



