import { Card, Column, Board } from "./models.js";
import { render, renderModal, removeModal } from "./ui.js";

document
  .querySelector(".add-task-btn")
  .addEventListener("click", () => renderModal("Add a task"));

document.body.addEventListener("click", (event) => {
  if (event.target.closest(".modal-overlay")) {
    if (
      !event.target.closest(".modal") ||
      event.target.closest(".modal-close") ||
      event.target.closest(".modal-btn-cancel")
    ) {
      removeModal();
    }
  }
});

document.body.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    removeModal();
  }
});
