// Kanban board data model.
// Each task is represented by a Card instance, while columns hold the cards assigned to them.
export class Card {
  constructor(title, description, category, priority, dueDate) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.dueDate = dueDate;
  }
}

export class Column {
  constructor(id, title) {
    this.id = id;
    this.title = title;

    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  removeCard(cardId) {
    const index = this.cards.findIndex((card) => card.id === cardId);
    if (index === -1) return null;
    return this.cards.splice(index, 1)[0];
  }
}

export class Board {
  constructor() {
    this.columns = new Map();
  }

  addColumn(id, title) {
    if (this.columns.has(id)) {
      throw new Error("Column already exists");
    }
    const column = new Column(id, title);
    this.columns.set(id, column);
    return column;
  }

  moveCard(cardId, fromColumnId, toColumnId) {
    const fromColumn = this.columns.get(fromColumnId);
    const toColumn = this.columns.get(toColumnId);

    if (!fromColumn) throw new Error(`Column not found: ${fromColumnId}`);
    if (!toColumn) throw new Error(`Column not found: ${toColumnId}`);
    if (fromColumnId === toColumnId) return;

    const card = fromColumn.removeCard(cardId);
    if (!card) throw new Error("Card not found");
    toColumn.addCard(card);
  }
}
