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
      if (btnDel) return this.deleteListItem(e);
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
    const label = list.querySelector('.checklist-item__value');

    // Set attributes
    item.dataset.id = newListItem.id;
    checkbox.name = `checkbox-${newListItem.id}`;
    checkbox.id = `checkbox-${newListItem.id}`;
    input.id = `checkbox-${newListItem.id}`;
    label.setAttribute('for', `checkbox-${newListItem.id}`);

    input.focus();

    newListItem.initListeners();
  }

  editListItem(labelEl) {
    const inputEl = labelEl.parentNode.querySelector('.checklist-item__value-input');

    helper.hideAndShowEls(labelEl, inputEl);
    inputEl.textContent = this.value;
    inputEl.focus();
  }

  deleteListItem(e) {
    const listItem = e.target.closest('.task-form__checklist-item');
    const id = listItem.dataset.id;

    if (listItem) {
      listItem.remove();
      this.items.splice(id - 1, 1);
    }
  }
}

class ListItem {
  constructor(id, checklist) {
    this.id = id;
    this.value = '';
    this.checked = false;
    this.checklist = checklist;
    this.preventBlur = false;
  }

  // GETTERS //
  get checkboxEl() {
    return document.querySelector(`.checklist-item__checkbox[id="checkbox-${this.id}"]`);
  }
  get labelEl() {
    return document.querySelector(`.checklist-item__value[for="checkbox-${this.id}"]`);
  }
  get inputEl() {
    return document.querySelector(`.checklist-item__value-input[id="checkbox-${this.id}"]`);
  }
  get listItemEl() {
    return document.querySelector(`.task-form__checklist-item[data-id="checkbox-${this.id}"]`);
  }

  // EVENT LISTENERS //
  initListeners() {
    // Check list item input value //
    this.inputEl.addEventListener('blur', (e) => {
      if (!this.preventBlur) this.checkValue(e);
      this.preventBlur = false; // Reset flag
    });

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      this.preventBlur = true; // Set flag --> prevent blur event
      this.checkValue(e);
    });

    // Checked checkbox //
    this.checkboxEl.addEventListener('click', () => this.checkedBox(this.checkboxEl));
  }

  // METHODS //
  checkValue(e) {
    const input = e.target;
    const value = input.value.trim();

    // Remove item if input is empty
    if (!value) {
      return this.checklist.deleteListItem(e);
    }

    // Update values
    this.value = value;
    this.labelEl.textContent = this.value;

    // Update elements
    helper.hideAndShowEls(input, this.labelEl);
  }

  checkedBox(cb) {
    this.checked = cb.checked;

    if (this.checked) {
      // Move right after checked items
    }
    if (!this.checked) {
      // Move to the top of the checklist
      const value = this.labelEl.textContent;
    }
  }
}
