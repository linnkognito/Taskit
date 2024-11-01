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
    this.checked = false;

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

  //////////////_______________G E T T E R S_______________//////////////
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
  get liCheckbox() {
    return this.checklist.querySelector('.checklist__item-checkbox');
  }
  //#endregion

  //////////////________________M E T H O D S________________//////////////

  //___C H E C K L I S T_____________________________________________//
  renderItemMarkup() {
    //prettier-ignore
    return checklistMarkup
      .replace('{%CHECKLIST_ID%}', this.id)
      .replace('{%CHECKLIST_TITLE%}', this.title)
      .replace('{%CHECKLIST_ITEMS%}', this.renderListItems());
  }

  //___L I S T  I T E M S____________________________________________//
  renderListItems() {
    let markup = '';
    this.items.forEach((item) => (markup += item.renderListItem()));

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

    this.showElement(this.liInput);
    this.liInput.focus();

    newListItem.initListeners();

    // Trigger save for items added in card mode
    this.task.project.saveProjectState();
  }
}

//////////////__________L I S T  I T E M  C L A S S__________//////////////

export class ListItem {
  hasClass = helper.hasClass;

  constructor(id, checklist) {
    this.id = id;
    this.value = '';
    this.checked = false;
    this.checklist = checklist;
    this.created = new Date();
    this.sort = 'created';
    this.deleted = false;
  }

  //////////////________________G E T T E R S________________//////////////
  get checklistEl() {
    return this.checklist.checklist;
  }
  get checkedItemsContainer() {
    return this.checklistEl.querySelector('.checklist__body--checked');
  }
  get checkboxEl() {
    //return this.checklist.liCheckbox;
    return this.listItemEl.querySelector('.checklist__item-checkbox');
  }
  get labelEl() {
    //return document.querySelector(`.checklist__item-value[for="checkbox-${this.id}"]`);
    return this.listItemEl.querySelector('.checklist__item-value');
  }
  get inputEl() {
    //return this.checklist.liInput;
    return this.listItemEl.querySelector('.checklist__item-input');
  }
  get listItemEl() {
    return document.querySelector(`.checklist__item[data-id="${this.id}"]`);
  }

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
      .replace('{%LIST_ITEM_INPUT_ID%}', `checkbox-${this.id}`)
      .replace('{%LIST_ITEM_LABEL_FOR%}', `checkbox-${this.id}`)
      .replace('{%LIST_ITEM_VALUE_INPUT%}', `value-${this.id}`)
      .replace('{%LIST_ITEM_VALUE%}', this.value);
  }
  saveListItem() {
    // Remove item if input is empty
    let value = this.inputEl.value.trim();
    if (!value) return;

    // Update values
    this.value = value;
    this.labelEl.textContent = this.value;

    // Update elements
    helper.hideAndShowEls(this.inputEl, this.labelEl);

    // Enable checkbox
    this.checkboxEl.disabled = false;

    // Save to local storage if created from Task Card
    this.checklist.task.project.saveProjectState();
  }
  editListItem(e) {
    e.preventDefault();
    this.checklist.hideAndShowEls(this.labelEl, this.inputEl);
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

    if (this.checked) {
      // console.log(`checked entered`);
      // this.listItemEl.remove();
      // this.checkedItemsContainer.insertAdjecentHTML('afterbegin', this.renderListItem());
      // this.checkboxEl.disabled = false;
      // this.checkboxEl.checked = true;
    }
    if (!this.checked) {
      // Move to the top of the checklist
      const value = this.labelEl.textContent;
    }
  }
}
