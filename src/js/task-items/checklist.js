//////////////_______________C H E C K L I S T_______________//////////////

import { helper } from '../../index';
import { TaskItem } from './taskItems';

//////////////__________________M A R K U P__________________//////////////

import checklistMarkup from '../../components/tasks/items/checklist.html';
import listFormItem from '../../components/tasks/items/checklist-form-item.html';
import listItemMarkup from '../../components/tasks/items/checklist-item.html';

//////////////__________C H E C K L I S T  C L A S S__________//////////////

export class Checklist extends TaskItem {
  generateId = helper.generateId;
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
      'btn-delete-li': (e) => this.deleteListItem(e),
      'checklist__item-value': (label) => this.editListItem(label),
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
  get listItemEls() {
    return {
      item: this.checklist.querySelector('.checklist__item'),
      itemCheckbox: this.checklist.querySelector('.checklist__item-checkbox'),
      itemInput: this.checklist.querySelector('.checklist__item-input'),
      itemVal: this.checklist.querySelector('.checklist__item-value'),
    };
  }
  //#endregion

  //////////////________________M E T H O D S________________//////////////

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
    listFormItem.replace('{%CHECKLIST_ID%}', newListItem.id);
    helper.insertMarkupAdj(this.checklistBody, 'afterbegin', listFormItem);

    // List Item elements
    const { item, itemCheckbox, itemInput, itemVal } = this.listItemEls;

    // Set attributes
    item.dataset.id = newListItem.id;
    itemCheckbox.name = `checkbox-${newListItem.id}`;
    itemCheckbox.id = `checkbox-${newListItem.id}`;
    itemInput.id = `checkbox-${newListItem.id}`;
    itemVal.setAttribute('for', `checkbox-${newListItem.id}`);

    itemInput.focus();

    newListItem.initListeners();
  }
  editListItem(labelEl) {
    const inputEl = labelEl.closest('.checklist').querySelector('.checklist__item-input');

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

//////////////__________L I S T  I T E M  C L A S S__________//////////////

class ListItem {
  constructor(id, checklist) {
    this.id = id;
    this.value = '';
    this.checked = false;
    this.checklist = checklist;
    this.preventBlur = false;
    this.created = new Date();
    this.sort = 'created';
  }

  //////////////________________G E T T E R S________________//////////////
  get checkboxEl() {
    return document.querySelector(`.checklist__item-checkbox[id="checkbox-${this.id}"]`);
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

  //////////////__________E V E N T  H A N D L E R S__________//////////////

  initListeners() {
    // Check list item input value //
    this.inputEl.addEventListener('blur', (e) => {
      if (!this.preventBlur) this.checkValue(e);
      this.preventBlur = false; // Reset flag
    });

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      this.preventBlur = true;
      this.checkValue(e);
    });

    // Checked checkbox //
    this.checkboxEl.addEventListener('click', () => this.checkedBox(this.checkboxEl));
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
