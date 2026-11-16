function renderCard(card) {
  const el = document.createElement("article");
  el.className = "task-card";
  el.dataset.cardId = card.id;
  el.draggable = true;

  const taskTop = document.createElement("div");
  taskTop.className = "task-top";

  const category = document.createElement("span");
  category.className = `tag tag-${card.category.toLowerCase().replace(/[^a-z]/g, "")}`;
  category.textContent = card.category;

  const moreBtn = document.createElement("button");
  moreBtn.className = "more-btn";
  moreBtn.setAttribute("aria-label", "More");
  moreBtn.innerHTML = "<i class='fa-solid fa-ellipsis'></i>";

  taskTop.append(category, moreBtn);

  const title = document.createElement("h3");
  title.textContent = card.title;

  const description = document.createElement("p");
  description.textContent = card.description;

  const taskFooter = document.createElement("div");
  taskFooter.className = "task-footer";

  const priorityIcon = document.createElement("i");
  priorityIcon.className = "fa-solid fa-flag";
  const priority = document.createElement("span");
  priority.className = `priority priority-${card.priority.toLowerCase()}`;
  priority.append(priorityIcon, card.priority);

  const isCompleted = card.dueDate === "Completed";
  const dueIcon = document.createElement("i");
  dueIcon.className = isCompleted
    ? "fa-solid fa-circle-check"
    : "fa-regular fa-calendar";
  const dueDate = document.createElement("span");
  dueDate.className = isCompleted ? "due-date completed" : "due-date";
  dueDate.append(dueIcon, card.dueDate);

  taskFooter.append(priority, dueDate);

  el.append(taskTop, title, description, taskFooter);
  return el;
}

function renderColumn(column) {
  const el = document.createElement("section");
  el.className = "column";
  el.dataset.columnId = column.id;

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

  const taskList = document.createElement("div");
  taskList.className = "task-list";
  taskList.append(...column.cards.map(renderCard));

  el.append(columnHeader, taskList);
  return el;
}

// Re-render the board whenever the application state changes.
export function render(board, container) {
  container.replaceChildren(...[...board.columns.values()].map(renderColumn));
}
