//////////////_____________________T A S K_____________________//////////////

import { helper } from '../index';
import { Checklist } from './task-items/checklist';
import { Note } from './task-items/note';
import itemMap from './task-items/itemMap';

//////////////_________________M A R K U P_________________//////////////

import modalDueMarkup from '../components/tasks/forms/modal-date-picker.html';
import taskCardMarkup from '../components/tasks/task-card.html';

//////////////_______________T A S K  C L A S S_______________//////////////

export class Task {
  generateId = helper.generateId;
  checkValue = helper.checkValue;
  checkValidity = helper.checkValidity;
  insertMarkup = helper.insertMarkupAdj;
  addClass = helper.addClass;
  hasClass = helper.hasClass;
  removeClass = helper.removeClass;
  hideAndShowEls = helper.hideAndShowEls;
  clear = helper.clear;
  scaleUp = helper.scaleUp;

  hasChanges = false;

  constructor(id, project, projectEl) {
    this.id = id;
    this.project = project;
    this.projectEl = projectEl;

    this.title = 'Untitled';
    this.prio = 0;
    this.description = itemMap['description'].default;
    this.dueDate = null;
    this.dueTime = null;
    this.dueDateObj = null;
    this.created = null;

    this.checked = false;
    this.sort = 'created-newest';

    this.checklists = [];
    this.notes = [];
  }

  //////////////_________E V E N T  H A N D L E R S_________//////////////
  initListeners() {
    this.taskForm.addEventListener('click', this.handleClick.bind(this));
  }
  handleClick(e) {
    // Map button classes to methods
    const actionMap = {
      'prio-btn': (btn) => this.setPrio(btn),
      'btn-due-date': (btn) => this.openDueModal(btn),
      'btn-add-checklist': (btn) => this.addItem(btn),
      'btn-add-note': (btn) => this.addItem(btn),
      'btn-save': () => this.saveTask(),
      'btn-cancel': () => this.taskForm.remove(),
    };

    // Call the method
    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](el);
    });
  }

  //////////////_______________G E T T E R S_______________//////////////
  //#region Getters
  get noteForm() {
    return document.querySelector('.task-form__note');
  }
  get checklistForm() {
    return document.querySelector('.task-form__checklist');
  }
  get body() {
    return document.querySelector('body');
  }
  get taskCard() {
    return document.querySelector(`.task-card[data-id="${this.id}"]`);
  }
  get taskForm() {
    return document.querySelector('.task-form');
  }
  get btnDueDate() {
    return document.querySelector('.task-form__btn-due-date');
  }
  get btnsAddItem() {
    return this.projectEl.querySelector('.task-form__add-item-buttons');
  }
  get formTitleInput() {
    return this.projectEl.querySelector('.task-form__title-input');
  }
  get formDescInput() {
    return document.querySelector('.task-form__description-input');
  }
  get descriptionEl() {
    return this.taskCard.querySelector('.task-card__description');
  }
  get taskCardContainer() {
    return this.taskCard.querySelector('.task-card__container');
  }
  get taskFormContainer() {
    return this.projectEl.querySelector('.task-form__container');
  }
  get btnsPrio() {
    return this.projectEl.querySelectorAll('.prio-btn');
  }
  get modalDueDate() {
    return document.querySelector('.modal-due-date');
  }
  get modal() {
    return document.querySelector('.modal');
  }
  get inputDueDate() {
    return this.modal.querySelector('.input-due-date');
  }
  get inputDueTime() {
    return this.modal.querySelector('.input-due-time');
  }
  get modalBtnCancel() {
    return this.modalDueDate.querySelector('.btn-cancel');
  }
  //#endregion

  //////////////_______________M E T H O D S_______________//////////////

  //___F O R M  I T E M S___________________________________________//
  addItem(btn) {
    const id = this.generateId();
    const type = this.getItemType(btn);
    const item = itemMap[type];

    // Render
    const markup = this.getPopulatedMarkup(item.markup, type, id);
    this.insertMarkup(this.taskFormContainer, 'afterbegin', markup);

    // Create item instance
    const newItem = item.createInstance(id, this);
    item.array(this).push(newItem);

    // Apply animation & focus
    this.scaleUp(item.formEl(this), 'top');
    newItem.titleInput.focus();

    // Indicate that changes have been made
    this.hasChanges = true;

    // Initialize Item event listeners
    newItem.initListeners();
  }

  //___F O R M  I T E M S :  H E L P E R S____________________________//
  getItemType(btn) {
    return [...btn.classList]
      .find((cls) => cls.startsWith('btn-add-') && cls !== 'btn-add-item')
      .split('-')
      .pop();
  }
  getPopulatedMarkup(template, type, id) {
    return template.replace(`{%${type.toUpperCase()}_ID%}`, id);
  }

  //___P R I O______________________________________________________//
  setPrio(btn) {
    // Remove active style for all Prio buttons
    this.btnsPrio.forEach((btnEl) => {
      this.removeClass(btnEl, `prio${btnEl.dataset.prio}-color-profile`);
    });

    this.prio = btn.dataset.prio;
    this.addClass(btn, `prio${this.prio}-color-profile`);
    this.setPrioColors(this.prio);

    this.hasChanges = true;
  }
  setPrioColors(prio) {
    // PLACEHOLDER
  }

  //___D U E  D A T E_______________________________________________//
  openDueModal() {
    // Avoid rendering duplicate modals
    if (this.modalDueDate) this.modalDueDate.remove();

    // Render modal
    this.insertMarkup(this.body, 'afterbegin', modalDueMarkup);

    // If user previously entered values → populate input fields
    if (this.dueDateObj) {
      this.inputDueDate.value = this.dueDate;
      this.inputDueTime.value = this.dueTime;
    }

    this.initDueModalListeners();
  }
  initDueModalListeners() {
    this.modal.addEventListener('click', this.handleModalClick.bind(this));
  }
  handleModalClick(e) {
    const actionMap = {
      'modal-due-date': () => this.modal.remove(),
      'btn-cancel': () => this.modal.remove(),
      'btn-save': () => this.saveDueDate(),
      clear: (e) => this.clearDueDateInput(e),
    };

    Object.keys(actionMap).forEach((cls) => {
      if (this.hasClass(e.target, cls)) {
        actionMap[cls](e);
      }
    });
  }
  saveDueDate() {
    const inputDate = this.inputDueDate.value;
    const inputTime = this.inputDueTime.value;

    if (!inputDate && !inputTime) return this.modal.remove();

    // Set due date
    this.dueDate = inputDate ? new Date(this.parseDate(inputDate)) : new Date();
    this.dueTime = inputTime || new Date().toTimeString().slice(0, 5);
    this.dueDateObj = this.getFullDate(this.dueDate);

    // Make sure the selection is in the future
    const inThePast = this.dueDate.getTime() <= new Date().getTime();
    if (inThePast) return alert('❗ The selected date and/or time must be in the future');

    // Format dueDate
    this.dueDate = this.formatDueDate();

    // Handle DOM elements
    this.modal.remove();
    this.displayDueDate();

    this.hasChanges = true;
  }
  displayDueDate() {
    const { calendarBtn, dueDateEl } = this.getDueDateElements();

    if (!this.dueDateObj) return this.hideAndShowEls(dueDateEl, calendarBtn);
    if (calendarBtn) this.hideAndShowEls(calendarBtn, dueDateEl);

    const diff = this.calcTimeDiff(new Date(this.dueDateObj));
    this.updateDueDateDisplay(diff);

    dueDateEl.addEventListener('click', () => this.openDueModal());
  }

  //___D U E  D A T E :  H E L P E R S______________________________//
  clearDueDateInput(e) {
    // Clear input element
    const input = e.target.closest('.btn-clear').previousElementSibling;
    input.value = '';

    // Update property
    input.classList.contains('input-due-date') ? (this.dueDate = null) : (this.dueTime = null);
  }
  parseDate(date) {
    const [y, m, d] = date.split('-');
    return new Date(y, m - 1, d);
  }
  formatDueDate() {
    return `${this.dueDate.getFullYear()}-${this.dueDate.getMonth() + 1}-${this.dueDate.getDate()}`;
  }
  getFullDate(date) {
    const [h, m] = this.dueTime.split(':');
    date.setHours(h);
    date.setMinutes(m);
    return date;
  }
  getDueDateElements() {
    return {
      calendarBtn: this.projectEl.querySelector('.btn-due-date'),
      dueDateEl: this.projectEl.querySelector('.due-date'),
      smallTextTop: this.projectEl.querySelector('.due-date--small-top'),
      bigText: this.projectEl.querySelector('.due-date--big'),
      smallTextBottom: this.projectEl.querySelector('.due-date--small-bottom'),
    };
  }
  calcTimeDiff(date) {
    const diffMs = date.getTime() - new Date().getTime();

    const calcYear = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    const years = calcYear >= 0.9 ? Math.ceil(calcYear) : Math.floor(calcYear);
    let remaining = diffMs % (1000 * 60 * 60 * 24 * 365.25);

    const days = Math.round(remaining / (1000 * 60 * 60 * 24));
    remaining = remaining % (1000 * 60 * 60 * 24);

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    remaining = remaining % (1000 * 60 * 60);

    const mins = Math.floor(remaining / (1000 * 60));
    remaining = remaining % (1000 * 60);

    return { years, days, hours, mins };
  }
  updateDueDateDisplay(diff) {
    // Get elements
    const { smallTextTop, bigText, smallTextBottom } = this.getDueDateElements();

    // Clear contents
    [smallTextTop, bigText, smallTextBottom].forEach((el) => {
      this.clear(el);
    });

    const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Populate elements
    if (!diff.years && !diff.days && diff.hours && !diff.mins) {
      bigText.textContent = diff.hours;
      smallTextBottom.textContent = diff.hours === 1 ? 'hour' : 'hours';
      return;
    }
    if (!diff.years && !diff.days && diff.hours && diff.mins) {
      bigText.textContent = `${diff.hours} h`;
      smallTextBottom.textContent = `${diff.mins} ${diff.mins === 1 ? 'min' : 'mins'}`;
      return;
    }
    if (!diff.years && !diff.days && !diff.hours) {
      bigText.textContent = Math.ceil(diff.mins);
      smallTextBottom.textContent = Math.ceil(diff.mins) === 1 ? 'min' : 'mins';
      return;
    }
    if (diff.days || diff.years) {
      smallTextTop.textContent = `${monthsArr[this.dueDateObj.getMonth()].slice(0, 3)}`;
      bigText.textContent = `${this.dueDateObj.getDate()}`;
      smallTextBottom.textContent = `${this.dueDateObj.getFullYear()}`;
      return;
    }
  }

  //___T A S K S____________________________________________________//
  saveTask() {
    // Prevent saving if !title
    this.checkValidity(this.formTitleInput);

    // Update Task card values
    this.created = new Date();
    this.title = this.formTitleInput.value;
    this.description = this.formDescInput.value.trim() || this.description;

    // Swap out markup
    this.taskForm.remove();
    this.insertMarkup(this.project.projectBody, 'afterbegin', this.populateTaskCardMarkup());

    // If there's no description, set default + styles
    if (this.description === itemMap['description'].default) {
      this.addClass(this.descriptionEl, 'description--default');
    }

    // Display due date
    this.displayDueDate();

    // Display task Items (if there are any)
    if (this.checklists.length || this.notes.length) this.renderItems();

    // Mark changes as saved
    this.hasChanges = false;
  }
  renderItems() {
    // INITIAL METHOD FOR SORTING & RENDERING AFTER SAVING NEW TASK //
    let markup = '';

    // Sort items by creation time (default)
    const items = [...this.checklists, ...this.notes];
    items.sort((a, b) => b.created - a.created);

    // Fetch markup for each item
    items.forEach((item) => {
      console.log(`item in loop: ${item}`);
      if (item instanceof Checklist) markup += item.renderChecklist();
      if (item instanceof Note) markup += item.renderNote();
    });

    // Insert markup
    this.insertMarkup(this.taskCardContainer, 'afterbegin', markup);
  }
  isChecked(task) {
    this.checked = true;
    this.project.moveChecked(task);
  }

  //___T A S K S :  S O R T  I T E M S_______________________________//
  sortItems() {
    // METHOD IS ENTERED WHEN USER CLICKS THE ITEM SORT BUTTON //

    // Concatinate all Items
    const items = [...this.checklists, ...this.notes];

    // Get sort preference
    const { sortOrder } = this.getSortOptions();

    items.sort((a, b) => {
      // if(this.sortb.created - a.created
    });
  }
  switchSortOrder() {
    const { sortBasis } = this.getSortOptions();

    // Toggle sort order
    this.sort = this.sort === `${sortBasis}-ascending` ? `${sortBasis}-descending` : `${sortBasis}-ascending`;
  }
  getSortOptions() {
    return { sortBasis: this.sort.split('-')[0], sortOrder: this.sort.split('-')[1] };
  }

  //___T A S K S :  H E L P E R S___________________________________//
  getCreationDateStr = () => {
    const d = this.formatCreationDate();
    const t = this.toAmPm(this.created);

    return `${d}, ${t}`;
  };
  formatCreationDate() {
    const y = this.created.getFullYear();
    const m = String(this.created.getMonth() + 1).padStart(2, 0);
    const d = String(this.created.getDate()).padStart(2, 0);

    return `${m}/${d}/${y}`;
  }
  toAmPm(date) {
    const time = date.toTimeString().slice(0, 5);
    const [h24, min] = time.split(':');
    const h12 = h24 % 12 || 12;
    const per = h24 >= 12 ? 'PM' : 'AM';

    return `${h12}:${min} ${per}`;
  }
  populateTaskCardMarkup() {
    return taskCardMarkup
      .replace('{%TASKCARD_ID%}', this.id)
      .replace('{%TASKCARD_TITLE%}', this.title)
      .replace('{%TASKCARD_DESCRIPTION%}', this.description)
      .replace('{%TASKCARD_CREATED%}', this.getCreationDateStr());
  }

  //___T A S K  I T E M S___________________________________________//
  removeItemById(id, item) {
    // Filters out item from array
    this[`${item}s`] = this[`${item}s`].filter((item) => item.id !== id);
  }
}
