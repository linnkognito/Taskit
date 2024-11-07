//////////////_______________T A S K  I T E M_______________//////////////

import { helper } from '../../index';

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
    if (cls === 'item-title' || 'input-item-title') this.editTitle(parentEl);
  }

  listenForTitleSave(inputEl, titleEl, context) {
    inputEl.addEventListener('blur', () => context.saveTitle(inputEl, titleEl), { once: true });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      context.saveTitle(inputEl, titleEl);
    });
  }

  editTitle(parent) {
    // Get title elements
    const titleEl = parent.querySelector('.item-title');
    const inputEl = parent.querySelector('.input-item-title');

    // Hide title & show input
    this.hideAndShowEls(titleEl, inputEl);
    inputEl.value = this.title;
    inputEl.focus();

    // Listen for save
    this.listenForTitleSave(inputEl, titleEl, this);
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

    // Show Sortbar if there's >1 item
    this.task.renderItems();
    //if (this.task.items.length < 1) this.hideElement(this.sortBar);

    // Update local storage data
    this.task.project.saveProjectState();
  }
}
