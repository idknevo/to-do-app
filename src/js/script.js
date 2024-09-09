"use strict";

const body = document.querySelector("body");
const darkModeInput = document.querySelector(".dark-mode-input");
const titleEl = document.querySelector(".title");
const listsContainer = document.querySelector(".task-lists");
const newListForm = document.getElementById("new-list-form");
const newListInput = document.getElementById("new-list-input");
const deleteListBtn = document.getElementById("delete-list-btn");
const deleteCompletedTasksBtn = document.getElementById(
  "delete-comp-tasks-btn"
);
const listDisplayContainer = document.getElementById("list-container");
const listTitle = document.getElementById("list-title");
const listsCount = document.getElementById("lists-count");
const tasksContainer = document.getElementById("tasks");
const newTaskForm = document.getElementById("new-task-form");
const newTaskInput = document.getElementById("new-task-input");
const LOCAL_STORAGE_LISTS_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener("click", function (e) {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    updateAndRender();
  }
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    updateLS();
    renderTasksCount(selectedList);
  }
});

newListForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const listName = newListInput.value;
  if (!listName || listName === "") return;
  const list = createList(listName);
  newListInput.value = "";
  lists.push(list);
  updateAndRender();
});

newTaskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (!taskName || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = "";
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  updateAndRender();
});

deleteListBtn.addEventListener("click", function () {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  updateAndRender();
});

deleteCompletedTasksBtn.addEventListener("click", function () {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  updateAndRender();
});

function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedList = lists.find((list) => list.id === selectedListId);
  if (!selectedList) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitle.innerText = selectedList.name;
    renderTasksCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasksCount(list) {
  const inCompletedTasks = list.tasks.filter((task) => !task.complete).length;
  const countString = inCompletedTasks === 1 ? "task" : "tasks";
  listsCount.innerText = `${inCompletedTasks} ${countString} remaining`;
}

function renderTasks(list) {
  list.tasks.forEach((task) => {
    const html = `
          <div class="todo-task">
            <input type="checkbox" id="${task.id}" ${
      task.complete ? "checked" : ""
    } />
            <label for="${task.id}">
              <span class="custom-checkbox"></span>
              ${task.name}
            </label>
          </div>
    `;
    tasksContainer.insertAdjacentHTML("beforeend", html);
  });
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.classList.add("task-list");
    listElement.dataset.listId = list.id;
    if (list.id === selectedListId) listElement.classList.add("active-list");
    listElement.innerHTML = list.name;
    listsContainer.appendChild(listElement);
  });
}

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

// clear an element
function clearElement(element) {
  element.innerHTML = ``;
}

// save lists to local storage
function updateLS() {
  localStorage.setItem(LOCAL_STORAGE_LISTS_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function updateAndRender() {
  updateLS();
  render();
}

render();

// dark mode
darkModeInput.checked = JSON.parse(localStorage.getItem("mode"));

const updateBackground = function () {
  if (darkModeInput.checked) {
    body.style.backgroundColor = "#212529";
    titleEl.style.color = "rgba(255, 255, 255, 0.1)";
  } else {
    body.style.backgroundColor = "#5f3dc4";
    titleEl.style.color = "rgba(0, 0, 0, 0.1)";
  }
};
updateBackground();

const updateLocalStorage = function () {
  localStorage.setItem("mode", JSON.stringify(darkModeInput.checked));
};
darkModeInput.addEventListener("input", function () {
  updateBackground();
  updateLocalStorage();
});
