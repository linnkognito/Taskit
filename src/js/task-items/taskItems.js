//////////////_______________T A S K  I T E M_______________//////////////

// import { Task } from './task';

//////////////__________T A S K  I T E M  C L A S S__________//////////////

export class TaskItem {
  constructor(id, task) {
    this.id = id;
    this.task = task;
    this.created = new Date();
    this.sort = 'created';
  }

  //////////////________________M E T H O D S________________//////////////
  deleteItem(itemEl, itemType) {
    // Remove item instance and element
    this.task.removeItemById(this.id, itemType);
    itemEl.remove();

    // Update local storage data
    this.task.project.saveProjectState();
  }
  // deleteItem() {
  //   this.task.removeItemById(this.id, 'checklist');
  //   this.checklist.remove();

  //   this.task.project.saveProjectState();
  // }
  editItem() {
    //
  }
}
