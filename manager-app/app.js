"use strict";

const STORAGE_KEY = "homework5.yunnan.places";
const form = document.querySelector("#place-form");
const list = document.querySelector("#place-list");
const message = document.querySelector("#form-message");
const count = document.querySelector("#collection-count");
const searchInput = document.querySelector("#search-input");
const submitButton = document.querySelector("#submit-button");
const cancelEditButton = document.querySelector("#cancel-edit");

let places = [];
let editingId = null;
let searchTerm = "";

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const showMessage = (text, type = "error") => {
  message.textContent = text;
  message.classList.toggle("success", type === "success");
};

const readForm = () => ({
  id: editingId || createId(),
  name: form.elements.name.value.trim(),
  region: form.elements.region.value,
  type: form.elements.type.value,
  season: form.elements.season.value,
  rating: Number(form.elements.rating.value),
  note: form.elements.note.value.trim()
});

const isValidPlace = (place) => (
  place && typeof place.id === "string" && typeof place.name === "string" && place.name.trim() !== "" &&
  typeof place.region === "string" && place.region !== "" && typeof place.type === "string" && place.type !== "" &&
  typeof place.season === "string" && typeof place.note === "string" && place.note.length <= 160 &&
  Number.isInteger(place.rating) && place.rating >= 1 && place.rating <= 5
);

const loadPlaces = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new TypeError("收藏数据不是数组");
    return parsed.filter(isValidPlace);
  } catch (error) {
    console.warn("收藏数据读取失败，已使用空列表。", error);
    showMessage("旧数据无法读取，已安全恢复为空收藏夹");
    return [];
  }
};

const savePlaces = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    return true;
  } catch (error) {
    console.warn("收藏数据保存失败。", error);
    showMessage("浏览器存储空间不足，本次修改未能保存");
    return false;
  }
};

const resetForm = () => {
  editingId = null;
  form.reset();
  form.elements.rating.value = "5";
  submitButton.textContent = "添加到收藏";
  cancelEditButton.hidden = true;
};

const startEdit = (id) => {
  const place = places.find((item) => item.id === id);
  if (!place) return;

  editingId = id;
  form.elements.name.value = place.name;
  form.elements.region.value = place.region;
  form.elements.type.value = place.type;
  form.elements.season.value = place.season;
  form.elements.rating.value = String(place.rating);
  form.elements.note.value = place.note;
  submitButton.textContent = "保存修改";
  cancelEditButton.hidden = false;
  showMessage(`正在编辑：${place.name}`, "success");
  form.elements.name.focus();
  window.scrollTo({ top: 360, behavior: "smooth" });
};

const deletePlace = (id) => {
  const place = places.find((item) => item.id === id);
  if (!place || !window.confirm(`确定删除“${place.name}”吗？`)) return;
  places = places.filter((item) => item.id !== id);
  if (editingId === id) resetForm();
  showMessage(`已删除：${place.name}`, "success");
  savePlaces();
  render();
};

const render = () => {
  list.replaceChildren();
  const normalizedTerm = searchTerm.toLocaleLowerCase("zh-CN");
  const visiblePlaces = places.filter((place) => (
    [place.name, place.region, place.type, place.season, place.note]
      .some((value) => value.toLocaleLowerCase("zh-CN").includes(normalizedTerm))
  ));
  count.textContent = searchTerm ? `找到 ${visiblePlaces.length} / ${places.length} 个地点` : `共 ${places.length} 个地点`;

  if (visiblePlaces.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const title = document.createElement("strong");
    title.textContent = places.length === 0 ? "收藏夹还是空的" : "没有匹配的地点";
    const hint = document.createElement("span");
    hint.textContent = places.length === 0 ? "从上方添加第一个想去的地点吧。" : "换一个关键词再试试。";
    empty.append(title, hint);
    list.appendChild(empty);
    return;
  }

  visiblePlaces.forEach((place) => {
    const card = document.createElement("article");
    card.className = "place-card";
    card.dataset.id = place.id;

    const top = document.createElement("div");
    top.className = "card-top";
    const identity = document.createElement("div");
    const chip = document.createElement("span");
    chip.className = "type-chip";
    chip.textContent = place.type;
    const title = document.createElement("h3");
    title.textContent = place.name;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${place.region} · ${place.season}`;
    identity.append(chip, title, meta);

    const rating = document.createElement("span");
    rating.className = "rating";
    rating.setAttribute("aria-label", `期待评分 ${place.rating} 分`);
    rating.textContent = `${place.rating} / 5`;
    top.append(identity, rating);

    const note = document.createElement("p");
    note.className = "note";
    note.textContent = place.note || "暂未填写旅行备注。";
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "编辑";
    editButton.addEventListener("click", () => startEdit(place.id));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => deletePlace(place.id));
    actions.append(editButton, deleteButton);

    card.append(top, note, actions);
    list.appendChild(card);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const place = readForm();

  if (!isValidPlace(place)) {
    showMessage("请填写地点名称、区域、类型，并输入 1～5 的整数评分");
    return;
  }

  if (editingId) {
    places = places.map((item) => item.id === editingId ? place : item);
    showMessage("地点信息已更新", "success");
  } else {
    places.unshift(place);
    showMessage("地点已加入收藏", "success");
  }
  savePlaces();
  resetForm();
  render();
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  showMessage("已取消编辑", "success");
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  render();
});

places = loadPlaces();
render();
