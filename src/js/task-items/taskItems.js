//////////////_______________T A S K  I T E M_______________//////////////

import { helper } from '../../index';
// import { Task } from './task';

//////////////__________T A S K  I T E M  C L A S S__________//////////////

export class TaskItem {
  hasClass = helper.hasClass;
  hideAndShowEls = helper.hideAndShowEls;

  constructor(id, task) {
    this.id = id;
    this.task = task;
    this.created = new Date();
    this.sort = 'created';
  }

  //////////////________________M E T H O D S________________//////////////
  activateEdit(cls, parentEl) {
    console.log(`avtivateEdit called!`);
    console.log(`cls: ${cls}. parentEl: ${parentEl}`);
    console.log(`parentEl.mode: ${parentEl.dataset.mode}`);
    if (cls === 'title' || 'input-title') this.editTitle(parentEl);
  }

  editTitle(parent) {
    // Check if Item is in a Form or Card
    const mode = parent.dataset.mode;

    // Get title elements
    const titleEl = parent.querySelector('.title');
    const inputEl = parent.querySelector('.input-title');

    // If Card: Hide title & show input
    //if (mode === 'card')
    this.hideAndShowEls(titleEl, inputEl);
    inputEl.focus();

    // Listen for blur on inputEl
    inputEl.addEventListener('blur', () => this.saveTitle(inputEl, titleEl), { once: true });
  }

  saveTitle(inputEl, titleEl) {
    // Save input data
    this.title = inputEl.value.trim() || 'Untitled';

    // Hide input and show title element
    this.hideAndShowEls(inputEl, titleEl);

    // Populate fields
    titleEl.textContent = this.title;
    inputEl.placeholder = this.title;
    inputEl.value = this.title;

    // Update local storage
    this.task.project.saveProjectState();
  }

  deleteItem(itemEl, itemType) {
    // Remove item instance and element
    this.task.removeItemById(this.id, itemType);
    itemEl.remove();

    // Update local storage data
    this.task.project.saveProjectState();
  }
  editItem() {
    //
  }
}
