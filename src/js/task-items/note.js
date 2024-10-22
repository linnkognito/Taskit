export class Note {
  constructor(id, task) {
    this.id = id;
    this.title = `Note #${this.id}`;
    this.task = task;
  }

  get noteEl() {
    return document.querySelector(`.task-form__note[data-id="${this.id}"]`);
  }
}
