"use strict";

const form = document.querySelector("#add-form");
const input = document.querySelector("#task-input");
const tip = document.querySelector("#tip");
const list = document.querySelector("#task-list");

let tasks = [];

const createTaskId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const render = () => {
  list.replaceChildren();

  if (tasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-tip";
    emptyItem.textContent = "暂无任务，添加一个吧";
    list.appendChild(emptyItem);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.id = task.id;

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    item.appendChild(text);
    list.appendChild(item);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (text === "") {
    tip.textContent = "任务名不能为空";
    input.focus();
    return;
  }

  tasks.push({ id: createTaskId(), text, done: false });
  tip.textContent = "";
  input.value = "";
  render();
});

render();
