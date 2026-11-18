import { getRemainingDays, formatDate } from "./utils.js";

function renderCard(card, isCompleted) {
  // task top
  const el = document.createElement("article");
  el.className = "task-card";
  el.dataset.cardId = card.id;
  el.draggable = true;

  const taskTop = document.createElement("div");
  taskTop.className = "task-top";

  const category = document.createElement("span");
  category.className = `tag tag-${card.category}`;
  category.textContent = card.category;

  const taskMenuWrapper = document.createElement("div");
  taskMenuWrapper.className = "task-menu-wrapper";

  const moreBtn = document.createElement("button");
  moreBtn.className = "more-btn";
  moreBtn.ariaLabel = "Task options";
  moreBtn.innerHTML = "<i class='fa-solid fa-ellipsis'></i>";

  taskMenuWrapper.append(moreBtn);
  taskTop.append(category, taskMenuWrapper);

  // title & description
  const title = document.createElement("h3");
  title.textContent = card.title;

  const description = document.createElement("p");
  description.textContent = card.description;

  // task footer
  const taskFooter = document.createElement("div");
  taskFooter.className = "task-footer";

  const priorityIcon = document.createElement("i");
  priorityIcon.className = "fa-solid fa-flag";
  const priority = document.createElement("span");
  priority.className = `priority priority-${card.priority}`;
  priority.append(priorityIcon, card.priority);

  const dueIcon = document.createElement("i");
  dueIcon.className = isCompleted
    ? "fa-solid fa-circle-check"
    : "fa-regular fa-calendar";
  const dueDate = document.createElement("span");
  if (isCompleted) {
    dueDate.className = "due-date completed";
    dueDate.append(dueIcon, "Completed");
  } else if (card.dueDate) {
    if (getRemainingDays(card.dueDate) < 0) {
      dueDate.className = "due-date overdue";
    } else if (getRemainingDays(card.dueDate) < 3) {
      dueDate.className = "due-date soon";
    } else {
      dueDate.className = "due-date";
    }
    dueDate.append(dueIcon, formatDate(card.dueDate));
  }

  taskFooter.append(priority, dueDate);

  el.append(taskTop, title, description, taskFooter);
  return el;
}

function renderColumn(column) {
  const el = document.createElement("section");
  el.className = "column";
  el.dataset.columnId = column.id;

  // column header
  const columnHeader = document.createElement("div");
  columnHeader.className = "column-header";

  const columnTitle = document.createElement("div");
  columnTitle.className = "column-title";

  const statusDot = document.createElement("span");
  statusDot.className = `status-dot ${column.id}-dot`;

  const heading = document.createElement("h2");
  heading.textContent = column.title;

  const taskCount = document.createElement("span");
  taskCount.className = "task-count";
  taskCount.textContent = column.cards.length;

  columnTitle.append(statusDot, heading, taskCount);

  const iconBtn = document.createElement("button");
  iconBtn.className = "icon-btn";
  iconBtn.ariaLabel = "More options";
  iconBtn.innerHTML = "<i class='fa-solid fa-ellipsis'></i>";

  columnHeader.append(columnTitle, iconBtn);

  // task list
  const taskList = document.createElement("div");
  taskList.className = "task-list";
  taskList.append(
    ...column.cards.map((card) => renderCard(card, column.id === "done")),
  );

  el.append(columnHeader, taskList);
  return el;
}

// Re-render the board whenever the application state changes.
export function render(board, container) {
  container.replaceChildren(...[...board.columns.values()].map(renderColumn));
}

// Render the task editor modal.
export function renderModal(heading, card = {}, columnId = "todo") {
  document.querySelector(".modal-overlay")?.remove();

  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  // modal header
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const modalHeading = document.createElement("h2");
  modalHeading.textContent = heading;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "modal-close";
  closeBtn.ariaLabel = "Close modal";
  closeBtn.innerHTML = "<i class='fa-solid fa-xmark'></i>";

  modalHeader.append(modalHeading, closeBtn);

  // modal form
  const modalForm = document.createElement("form");
  modalForm.className = "modal-form";

  // title
  const title = document.createElement("div");
  const titleLabel = document.createElement("label");
  const titleInput = document.createElement("input");
  title.className = "form-group";
  titleLabel.setAttribute("for", "task-title");
  titleLabel.textContent = "Title";
  titleInput.type = "text";
  titleInput.id = "task-title";
  titleInput.name = "title";
  titleInput.className = "form-control";
  titleInput.placeholder = "Enter task title";
  titleInput.required = true;
  titleInput.value = card.title ?? "";
  title.append(titleLabel, titleInput);

  // description
  const description = document.createElement("div");
  const descriptionLabel = document.createElement("label");
  const descriptionInput = document.createElement("textarea");
  description.className = "form-group";
  descriptionLabel.setAttribute("for", "task-description");
  descriptionLabel.innerHTML =
    "Description <span class='optional'>(Optional)</span>";
  descriptionInput.id = "task-description";
  descriptionInput.name = "description";
  descriptionInput.className = "form-control";
  descriptionInput.placeholder = "Add a description...";
  descriptionInput.rows = 4;
  descriptionInput.value = card.description ?? "";
  description.append(descriptionLabel, descriptionInput);

  // category and priority
  const row1 = document.createElement("div");
  row1.className = "form-row";

  const category = document.createElement("div");
  const categoryLabel = document.createElement("label");
  const categorySelect = document.createElement("select");
  category.className = "form-group";
  categoryLabel.setAttribute("for", "task-category");
  categoryLabel.textContent = "Category";
  categorySelect.id = "task-category";
  categorySelect.name = "category";
  categorySelect.className = "form-control";
  categorySelect.innerHTML = `
    <option value="design">Design</option>
    <option value="development">Development</option>
    <option value="research">Research</option>
    <option value="bug">Bug</option>
    <option value="feature">Feature</option>
    <option value="testing">Testing</option>
    <option value="documentation">Documentation</option>
    <option value="marketing">Marketing</option>
    <option value="meeting">Meeting</option>
    <option value="planning">Planning</option>
    <option value="support">Support</option>
    <option value="other">Other</option>
  `;
  categorySelect.value = card.category ?? "design";
  category.append(categoryLabel, categorySelect);

  const priority = document.createElement("div");
  const priorityLabel = document.createElement("label");
  const prioritySelect = document.createElement("select");
  priority.className = "form-group";
  priorityLabel.setAttribute("for", "task-priority");
  priorityLabel.textContent = "Priority";
  prioritySelect.id = "task-priority";
  prioritySelect.name = "priority";
  prioritySelect.className = "form-control";
  prioritySelect.innerHTML = `
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  `;
  prioritySelect.value = card.priority ?? "medium";
  priority.append(priorityLabel, prioritySelect);

  row1.append(category, priority);

  // due date and status
  const row2 = document.createElement("div");
  row2.className = "form-row";

  const dueDate = document.createElement("div");
  const dueDateLabel = document.createElement("label");
  const dueDateInput = document.createElement("input");
  dueDate.className = "form-group";
  dueDateLabel.setAttribute("for", "task-due-date");
  dueDateLabel.innerHTML = "Due date <span class='optional'>(Optional)</span>";
  dueDateInput.type = "date";
  dueDateInput.id = "task-due-date";
  dueDateInput.name = "dueDate";
  dueDateInput.className = "form-control";
  dueDateInput.value = card.dueDate ?? "";
  dueDate.append(dueDateLabel, dueDateInput);

  const status = document.createElement("div");
  const statusLabel = document.createElement("label");
  const statusSelect = document.createElement("select");
  status.className = "form-group";
  statusLabel.setAttribute("for", "task-status");
  statusLabel.textContent = "Status";
  statusSelect.id = "task-status";
  statusSelect.name = "status";
  statusSelect.className = "form-control";
  statusSelect.innerHTML = `
    <option value="todo">To Do</option>
    <option value="doing">Doing</option>
    <option value="done">Done</option>
  `;
  statusSelect.value = columnId;
  status.append(statusLabel, statusSelect);

  row2.append(dueDate, status);

  // modal footer
  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "modal-btn modal-btn-cancel";
  cancelBtn.textContent = "Cancel";

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className = "modal-btn modal-btn-save";
  saveBtn.textContent = "Save";

  modalFooter.append(cancelBtn, saveBtn);
  modalForm.append(title, description, row1, row2, modalFooter);
  modal.append(modalHeader, modalForm);
  modalOverlay.append(modal);

  document.body.append(modalOverlay);
  return modalOverlay;
}

export function removeModal() {
  document.querySelector(".modal-overlay")?.remove();
}
