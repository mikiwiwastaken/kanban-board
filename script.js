import { Card, Board } from "./models.js";
import {
  render,
  renderFormModal,
  renderConfirmationModal,
  removeModal,
  renderTaskMenu,
  removeTaskMenu,
} from "./ui.js";

const board = new Board();
board.addColumn("todo", "To Do");
board.addColumn("doing", "Doing");
board.addColumn("done", "Done");

document.body.addEventListener("click", (event) => {
  const confirmationModal = event.target.closest(".confirm-modal");

  if (event.target.closest(".modal-overlay")) {
    if (
      (!event.target.closest(".modal") && !confirmationModal) ||
      event.target.closest(".modal-close") ||
      event.target.closest(".modal-btn-cancel") ||
      event.target.closest(".confirm-btn-cancel")
    ) {
      closeModal();
    }

    if (confirmationModal && event.target.closest(".confirm-btn-delete")) {
      closeModal();
      board.columns
        .get(confirmationModal.dataset.columnId)
        .removeCard(confirmationModal.dataset.cardId);
      render(board, document.querySelector(".board-columns"));
    }
  }

  if (event.target.closest(".add-task-btn")) {
    renderFormModal("Add task");
    syncScrollLock();
  }

  const wrapper = event.target.closest(".task-menu-wrapper");

  if (event.target.closest(".more-btn")) {
    if (wrapper.querySelector(".task-menu")) {
      closeTaskMenu();
    } else {
      renderTaskMenu(wrapper);
      syncScrollLock();
    }
  }

  if (wrapper) {
    if (event.target.closest(".edit-item")) {
      const columnId = event.target.closest(".column").dataset.columnId;
      const cardId = event.target.closest(".task-card").dataset.cardId;

      const card = board.getCard(columnId, cardId);
      closeTaskMenu();
      renderFormModal("Edit task", card, columnId);
    }

    if (event.target.closest(".remove-item")) {
      const columnId = event.target.closest(".column").dataset.columnId;
      const cardId = event.target.closest(".task-card").dataset.cardId;

      closeTaskMenu();
      renderConfirmationModal(columnId, cardId);
    }
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

// Lock scroll only while a modal or a task menu is open
function syncScrollLock() {
  const locked = document.querySelector(".modal-overlay, .task-menu") !== null;
  document.documentElement.classList.toggle("no-scroll", locked);
  document.body.classList.toggle("no-scroll", locked);
}

function closeModal() {
  removeModal();
  syncScrollLock();
}

function closeTaskMenu() {
  removeTaskMenu();
  syncScrollLock();
}
