"use strict";

const body = document.querySelector("body");
const darkModeInput = document.querySelector(".dark-mode-input");
const titleEl = document.querySelector(".title");
const listsContainer = document.querySelector(".task-lists");
const newListForm = document.getElementById("new-list-form");
const newListInput = document.getElementById("new-list-input");
const deleteCompletedTasksBtn = document.getElementById(
  "delete-comp-tasks-btn"
);
const listDisplayContainer = document.getElementById("list-container");
const listHeader = document.getElementById("todo-header");
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
    const html = `
          <li class="task-list ${
            list.id === selectedListId ? "active-list" : ""
          }" data-list-id="${list.id}">
          ${list.name}
          ${
            list.id === selectedListId
              ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="delete-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>`
              : ``
          }
          </li>
    `;
    listsContainer.insertAdjacentHTML("beforeend", html);
    const deleteListIcon = document.querySelector(".delete-icon");
    if (!deleteListIcon) return;
    deleteListIcon.addEventListener("click", deleteList);
  });
}

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function deleteList() {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  updateAndRender();
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
  const styleValue = getComputedStyle(body);
  if (darkModeInput.checked) {
    body.style.backgroundColor = styleValue.getPropertyValue("--body-dark");
    titleEl.style.color = styleValue.getPropertyValue("--title-light");
    listDisplayContainer.style.backgroundColor =
      styleValue.getPropertyValue("--list-dark-mode");
    listHeader.style.backgroundColor =
      styleValue.getPropertyValue("--list-header-dark");
  } else {
    body.style.backgroundColor = styleValue.getPropertyValue("--body-light");
    titleEl.style.color = styleValue.getPropertyValue("--title-dark");
    listDisplayContainer.style.backgroundColor =
      styleValue.getPropertyValue("--color-light");
    listHeader.style.backgroundColor = styleValue.getPropertyValue(
      "--list-header-light"
    );
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
