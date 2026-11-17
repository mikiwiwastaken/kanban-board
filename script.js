import { Card, Column, Board } from "./models.js";
import { render, renderModal, removeModal } from "./ui.js";

const board = new Board();
const todo = board.addColumn("todo", "To Do");
const doing = board.addColumn("doing", "Doing");
const done = board.addColumn("done", "Done");

document.querySelector(".add-task-btn").addEventListener("click", () => {
  renderModal("Add a task");
  disableScroll();
});

document.body.addEventListener("click", (event) => {
  if (event.target.closest(".modal-overlay")) {
    if (
      !event.target.closest(".modal") ||
      event.target.closest(".modal-close") ||
      event.target.closest(".modal-btn-cancel")
    ) {
      removeModal();
      enableScroll();
    }
  }
});

document.body.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    removeModal();
    enableScroll();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.matches(".modal-form")) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target));
    const card = new Card(
      data.title,
      data.description,
      data.category,
      data.priority,
      data.dueDate,
    );

    if (data.status === "todo") {
      todo.addCard(card);
    } else if (data.status === "doing") {
      doing.addCard(card);
    } else {
      done.addCard(card);
    }

    render(board, document.querySelector(".board-columns"));

    removeModal();
  }
});

function disableScroll() {
  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");
}

function enableScroll() {
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
}
