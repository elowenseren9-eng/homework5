"use strict";

const form = document.querySelector("#add-form");
const input = document.querySelector("#task-input");
const tip = document.querySelector("#tip");
const list = document.querySelector("#task-list");
const filters = document.querySelector(".filters");
const stats = document.querySelector("#task-stats");

let tasks = [];
let currentFilter = "all";

const createTaskId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const render = () => {
  list.replaceChildren();
  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  const completedCount = tasks.filter((task) => task.done).length;
  stats.textContent = `共 ${tasks.length} 项 · 已完成 ${completedCount} 项`;

  if (visibleTasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-tip";
    emptyItem.textContent = tasks.length === 0 ? "暂无任务，添加一个吧" : "当前筛选条件下没有任务";
    list.appendChild(emptyItem);
    return;
  }

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " done" : ""}`;
    item.dataset.id = task.id;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "toggle-button";
    toggle.dataset.action = "toggle";
    toggle.setAttribute("aria-label", task.done ? `将“${task.text}”标为未完成` : `完成“${task.text}”`);
    toggle.textContent = task.done ? "✓" : "";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-button";
    remove.dataset.action = "delete";
    remove.setAttribute("aria-label", `删除“${task.text}”`);
    remove.textContent = "删除";

    item.append(toggle, text, remove);
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

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  currentFilter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  render();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  const item = event.target.closest(".task-item");
  if (!button || !item) return;

  const task = tasks.find((candidate) => candidate.id === item.dataset.id);
  if (!task) return;

  if (button.dataset.action === "toggle") task.done = !task.done;
  if (button.dataset.action === "delete") {
    tasks = tasks.filter((candidate) => candidate.id !== task.id);
  }
  render();
});

render();
