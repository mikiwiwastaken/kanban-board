import { Card, Board } from "./models.js";
import {
  render,
  renderModal,
  removeModal,
  renderTaskMenu,
  removeTaskMenu,
} from "./ui.js";

const board = new Board();
board.addColumn("todo", "To Do");
board.addColumn("doing", "Doing");
board.addColumn("done", "Done");

document.body.addEventListener("click", (event) => {
  if (event.target.closest(".modal-overlay")) {
    if (
      !event.target.closest(".modal") ||
      event.target.closest(".modal-close") ||
      event.target.closest(".modal-btn-cancel")
    ) {
      closeModal();
    }
  }

  if (event.target.closest(".add-task-btn")) {
    renderModal("Add task");
    disableScroll();
  }

  const wrapper = event.target.closest(".task-menu-wrapper");

  if (event.target.closest(".more-btn")) {
    if (wrapper.querySelector(".task-menu")) {
      closeTaskMenu();
    } else {
      renderTaskMenu(wrapper);
      disableScroll();
    }
  }

  if (wrapper && event.target.closest(".edit-item")) {
    const columnId = event.target.closest(".column").dataset.columnId;
    const cardId = event.target.closest(".task-card").dataset.cardId;

    const card = board.getCard(columnId, cardId);
    closeTaskMenu();
    renderModal("Edit task", card, columnId);
  }

  if (!wrapper) {
    closeTaskMenu();
  }
});

document.body.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeTaskMenu();
  }
});

document.addEventListener("submit", (event) => {
  if (!event.target.matches(".modal-form")) return;
  event.preventDefault();

  const form = event.target;
  const data = Object.fromEntries(new FormData(form));
  const { cardId, columnId } = form.dataset;

  // cardId, columnId: data attributes of the card being edited
  // data: new data from the form

  if (cardId) {
    // Edit mode: mutate the existing card so its id stays the same
    board.getCard(columnId, cardId).update(data);
    // moveCard already returns early when from and to are the same column
    board.moveCard(cardId, columnId, data.status);
  } else {
    // Add mode
    const card = new Card(
      data.title,
      data.description,
      data.category,
      data.priority,
      data.dueDate,
    );
    board.columns.get(data.status).addCard(card);
  }

  render(board, document.querySelector(".board-columns"));
  closeModal();
});

function closeModal() {
  removeModal();
  enableScroll();
}

function closeTaskMenu() {
  removeTaskMenu();
  enableScroll();
}

function disableScroll() {
  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");
}

function enableScroll() {
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
}
