export class Note {
  constructor(id, task) {
    this.id = id;
    this.title = `Note #${this.id}`;
    this.task = task;
  }
}
