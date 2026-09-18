"use strict";

const form = document.querySelector("#place-form");
const list = document.querySelector("#place-list");
const message = document.querySelector("#form-message");
const count = document.querySelector("#collection-count");

let places = [];

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const showMessage = (text, type = "error") => {
  message.textContent = text;
  message.classList.toggle("success", type === "success");
};

const readForm = () => ({
  id: createId(),
  name: form.elements.name.value.trim(),
  region: form.elements.region.value,
  type: form.elements.type.value,
  season: form.elements.season.value,
  rating: Number(form.elements.rating.value),
  note: form.elements.note.value.trim()
});

const isValidPlace = (place) => (
  place.name !== "" && place.region !== "" && place.type !== "" &&
  Number.isInteger(place.rating) && place.rating >= 1 && place.rating <= 5
);

const render = () => {
  list.replaceChildren();
  count.textContent = `共 ${places.length} 个地点`;

  if (places.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const title = document.createElement("strong");
    title.textContent = "收藏夹还是空的";
    const hint = document.createElement("span");
    hint.textContent = "从上方添加第一个想去的地点吧。";
    empty.append(title, hint);
    list.appendChild(empty);
    return;
  }

  places.forEach((place) => {
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
    card.append(top, note);
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

  places.unshift(place);
  form.reset();
  form.elements.rating.value = "5";
  showMessage("地点已加入收藏", "success");
  render();
});

render();
