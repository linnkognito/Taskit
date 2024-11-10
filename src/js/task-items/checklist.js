//////////////_______________C H E C K L I S T_______________//////////////

import { helper } from '../../index';
import { TaskItem } from './taskItems';

//////////////__________________M A R K U P__________________//////////////

import checklistMarkup from '../../components/tasks/items/checklist.html';
import listItemMarkup from '../../components/tasks/items/checklist-item.html';

//////////////__________C H E C K L I S T  C L A S S__________//////////////

export class Checklist extends TaskItem {
  generateId = helper.generateId;
  showElement = helper.showElement;
  hideAndShowEls = helper.hideAndShowEls;

  constructor(id, task) {
    super(id, task);
    this.title = '';
    this.created = new Date();
    this.checked = false;
    this.sortKey = 'Checklist';

    this.items = [];
  }

  //////////////__________E V E N T  H A N D L E R S__________//////////////

  initListeners() {
    this.checklist.addEventListener('click', (e) => this.handleLiClick(e));
  }
  handleLiClick(e) {
    // Map button classes to methods
    const actionMap = {
      'btn-add-li': () => this.addListItem(),
    };

    // Call the method
    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](el);
    });
  }

  //////////////________________G E T T E R S________________//////////////
  //#region GETTERS
  get checklist() {
    return document.querySelector(`.checklist[data-id="${this.id}"]`);
  }
  get inputTitle() {
    return document.querySelector('.input-item-title');
  }
  get titleEl() {
    return document.querySelector('.item-title');
  }
  get checklistBody() {
    return this.checklist.querySelector('.checklist__body');
  }
  get liInput() {
    return this.checklist.querySelector('.checklist__item-input');
  }
  get liInputContainer() {
    return this.checklist.querySelector('.checklist__item-content--input');
  }
  get liValueContainer() {
    return this.checklist.querySelector('.checklist__item-content--value');
  }
  get liCheckbox() {
    return this.checklist.querySelector('.checklist__item-checkbox');
  }
  get completed() {
    return this.checklist.querySelector('.checklist__completed');
  }
  //#endregion

  //////////////________________M E T H O D S_______________//////////////

  //___C H E C K L I S T_____________________________________________//
  renderItemMarkup() {
    //prettier-ignore
    return checklistMarkup
      .replace('{%CHECKLIST_ID%}', this.id)
      .replace('{%CHECKLIST_TITLE%}', this.title)
      .replace('{%CHECKLIST_ITEMS%}', this.renderListItems(false))
      .replace('{%CHECKLIST_CHECKED%}', this.renderListItems(true))
      .replace('{%CHECKLIST_COMPLETED%}', this.calcCompleted());
  }

  //___L I S T  I T E M S____________________________________________//
  renderListItems(checked) {
    let markup = '';

    this.items.sort((a, b) => a.created - b.created);
    this.items.forEach((item) => {
      if (checked !== item.checked) return;
      markup += item.renderListItem();
    });

    return markup;
  }
  addListItem() {
    // Create List Item instance
    const newListItem = new ListItem(this.generateId(), this);
    this.items.push(newListItem);

    // Render list item
    const liMarkup = newListItem.renderListItem();
    helper.insertMarkupAdj(this.checklistBody, 'afterbegin', liMarkup);

    if (this.checklist.closest('.task').dataset.state === 'form') this.liCheckbox.disabled = true;

    //this.showElement(this.liInputContainer);
    this.hideAndShowEls(this.liValueContainer, this.liInputContainer);
    this.liInput.focus();

    newListItem.initListeners();

    // Trigger save for items added in card mode
    this.task.project.saveProjectState();
  }
  calcCompleted() {
    return this.items.filter((li) => li.checked).length;
  }
}

//////////////__________L I S T  I T E M  C L A S S__________//////////////

export class ListItem {
  clear = helper.clear;
  hasClass = helper.hasClass;
  hideAndShowEls = helper.hideAndShowEls;
  insertMarkupAdj = helper.insertMarkupAdj;

  constructor(id, checklist) {
    this.id = id;
    this.value = '';
    this.checklist = checklist;
    this.created = new Date();
    this.sort = 'created';

    this.checked = false;
    this.deleted = false;
  }

  //////////////________________G E T T E R S________________//////////////
  //#region Getters
  get checklistEl() {
    return this.checklist.checklist;
  }
  get checkedItemsContainer() {
    return this.checklistEl.querySelector('.checklist__body--checked');
  }
  get uncheckedItemsContainer() {
    return this.checklistEl.querySelector('.checklist__body--unchecked');
  }
  get checkboxEl() {
    return this.listItemEl.querySelector('.checklist__item-checkbox');
  }
  get labelEl() {
    return this.listItemEl.querySelector('.checklist__item-value');
  }
  get labelContainer() {
    return this.listItemEl.querySelector('.checklist__item-content--value');
  }
  get inputEl() {
    return this.listItemEl.querySelector('.checklist__item-input');
  }
  get inputContainer() {
    return this.listItemEl.querySelector('.checklist__item-content--input');
  }
  get listItemEl() {
    return document.querySelector(`.checklist__item[data-id="${this.id}"]`);
  }
  //#endregion

  //////////////__________E V E N T  H A N D L E R S__________//////////////

  initListeners() {
    // Save ListItem value
    this.inputEl.addEventListener('blur', () => this.saveListItem());
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      this.preventBlur = true;
      this.saveListItem();
    });

    // Handle clicks
    this.listItemEl.addEventListener('click', (e) => this.handleListItemClicks(e));

    this.checkboxEl.addEventListener('click', (e) => this.toggleChecked(e));
  }
  handleListItemClicks(e) {
    const actionMap = {
      'checklist__item-value': (e) => this.editListItem(e),
      'btn-delete-li': () => this.deleteListItem(),
    };

    // Call the method
    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](e);
    });
  }

  //////////////________________M E T H O D S________________//////////////

  renderListItem() {
    return listItemMarkup
      .replace('{%LIST_ITEM_ID%}', this.id)
      .replace('{%LIST_ITEM_CHECKED%}', this.checked ? 'checked' : '')
      .replace('{%LIST_ITEM_INPUT_ID%}', `checkbox-${this.id}`)
      .replace('{%LIST_ITEM_LABEL_FOR%}', `checkbox-${this.id}`)
      .replace('{%LIST_ITEM_VALUE_INPUT%}', `value-${this.id}`)
      .replace('{%LIST_ITEM_VALUE%}', this.value);
  }
  handleEmptyInput(value) {
    // If no input and no old value
    if (!value && !this.value) {
      return this.deleteListItem();
    }

    // If old value: reset to old value
    if (!value && this.value) {
      this.hideAndShowEls(this.inputContainer, this.labelContainer);
      this.labelEl.textContent = this.value;
    }
  }
  saveListItem() {
    let value = this.inputEl.value.trim();

    // Handle empty input field
    if (!value) return this.handleEmptyInput(value);

    // Update values
    this.value = value;
    this.labelEl.textContent = this.value;

    // Update elements
    this.hideAndShowEls(this.inputContainer, this.labelContainer);

    // Enable checkbox
    this.checkboxEl.disabled = false;

    // Save to local storage if created from Task Card
    this.checklist.task.project.saveProjectState();
  }
  editListItem(e) {
    e.preventDefault();

    // Prevent editing of completed items
    if (this.checked) return;

    // Show input field
    this.checklist.hideAndShowEls(this.labelContainer, this.inputContainer);
    this.inputEl.value = this.value;
    this.inputEl.focus();
  }
  deleteListItem() {
    // Prevents bug where multiple listeners trying to delete the same item
    if (this.deleted) return;
    this.deleted = true;

    // Remove element
    this.listItemEl.remove();

    // Remove from array
    const i = this.checklist.items.findIndex((li) => li.id === this.id);
    this.checklist.items.splice(i, 1);

    this.checklist.task.project.saveProjectState();
  }
  toggleChecked(e) {
    // Disable checkboxes inside of Task Forms
    if (this.checklist.task.taskForm) return e.preventDefault();

    this.checked = this.checkboxEl.checked;
    console.log(this.checked);

    // Moved to checked ListItems
    if (this.checked) {
      this.checkedItemsContainer.appendChild(this.listItemEl);
    }

    // Move back to unchecked ListItems
    if (!this.checked) {
      // Move item back to unchecked container
      this.checkedItemsContainer.appendChild(this.listItemEl);

      // Put it back in the same spot
      this.checklist.items.sort((a, b) => b.created - a.created);
      this.checklist.items.forEach((li) => {
        if (li.checked) return;
        this.uncheckedItemsContainer.appendChild(li.listItemEl);
      });
    }

    this.checklist.completed.textContent = '';
    this.checklist.completed.textContent = this.checklist.calcCompleted();

    // Persist to local storage
    this.checklist.task.project.saveProjectState();
  }
}
