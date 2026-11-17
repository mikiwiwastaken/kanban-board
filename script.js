import { Card, Column, Board } from "./models.js";
import { render, renderModal, removeModal } from "./ui.js";

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

function disableScroll() {
  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");
}

function enableScroll() {
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
}
