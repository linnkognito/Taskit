import { helper } from '../../index';

import listItem from '../../components/tasks/items/checklist-item.html';

export class Checklist {
  checklist = document.querySelector('.task-form__checklist');
  addItem = document.querySelector('.btn-add');

  constructor(id, task) {
    this.id = id;
    this.task = task;
    this.title = `Checklist ${this.id}`;
    this.checked = false;

    this.items = [];

    this.checklist.addEventListener('click', (e) => {
      const btnAdd = e.target.closest('.btn-add');
      const btnDel = e.target.closest('.checklist-item__delete-btn');
      const label = e.target.closest('.checklist-item__value');

      // ADD LIST ITEM
      if (btnAdd) return this.addListItem();
      if (btnDel) return this.deleteListItem(btnDel);
      // EDIT LIST ITEM
      if (label) return this.editListItem(label);
    });
  }

  addListItem() {
    const list = this.checklist.querySelector('.task-form__checklist-body');

    const itemId = this.items.length + 1;
    listItem.replace('{%CHECKLIST_ID%}', itemId);
    helper.insertMarkupAdj(list, 'afterbegin', listItem);

    const newListItem = new ListItem(itemId, this);
    this.items.push(newListItem);

    // List Item elements
    const item = list.querySelector('.task-form__checklist-item');
    const checkbox = list.querySelector('.checklist-item__checkbox');
    const input = list.querySelector('.checklist-item__value-input');
    const label = list.querySelector('.checklist-item__value-input');

    // Set attributes
    item.dataset.id = newListItem.id;
    checkbox.name = `checkbox-${newListItem.id}`;
    checkbox.id = `checkbox-${newListItem.id}`;
    input.id = `checkbox-${newListItem.id}`;
    label.for = `checkbox-${newListItem.id}`;

    input.focus();

    newListItem.initListeners();
  }

  editListItem(labelEl) {
    const inputEl = labelEl.parentNode.querySelector('.checklist-item__value-input');

    helper.hideAndShowEls(labelEl, inputEl);
    inputEl.textContent = this.value;
    inputEl.focus();
  }

  deleteListItem(btn) {
    const listItem = btn.closest('.task-form__checklist-item');
    const id = listItem.dataset.id;

    listItem.remove();
    this.items.splice(id - 1, 1);
  }
}

class ListItem {
  constructor(id, checklist) {
    this.id = id;
    this.value = '';
    this.checked = false;
    this.checklist = checklist;

    this.checklistEl = document.querySelector(`.task-form__checklist[data-id="${this.checklist.id}"]`);
  }

  // GETTERS //
  get checkboxEl() {
    return document.querySelector(`.checklist-item__checkbox[id="checkbox-${this.id}"]`);
  }
  get inputEl() {
    return document.querySelector(`.checklist-item__value-input[id="checkbox-${this.id}"]`);
  }
  get labelEl() {
    return document.querySelector(`.checklist-item__value[for="checkbox-${this.id}"]`);
  }

  // HELPERS //
  getLabelEl(el) {
    return el.parentNode.querySelector('.checklist-item__value');
  }

  // EVENT LISTENERS //
  initListeners() {
    const inputEl = this.inputEl;

    // Save new list item
    inputEl.addEventListener('blur', (e) => this.checkValue(e));
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.checkValue(e);
    });
  }

  checkValue(e) {
    const input = e === 'blur' ? e.target : this.inputEl;
    const value = input.value.trim();
    const label = this.getLabelEl(input);

    // Remove item if input is empty
    if (!value) return input.closest('.task-form__checklist-item').remove();

    // Update values
    this.value = value;
    label.textContent = this.value;

    helper.hideAndShowEls(input, label);
  }

  checkedItem() {
    this.checked = true;
  }
}

// GETTERS //
// get checklistEl() {
//   return document.querySelector(`.task-form__checklist[data-id="${this.checklist.id}"]`);
// }
// get listItem() {
//   return document.querySelector(`.task-form__checklist-item[data-id="${this.id}"]`);
// }
// get inputEl() {
//   return this.listItem.querySelector(`.checklist-item__value-input[id="checkbox-${this.id}"]`);
// }
// get labelEl() {
//   return this.listItem.querySelector(`.checklist-item__value[for="checkbox-${this.id}"]`);
// }
