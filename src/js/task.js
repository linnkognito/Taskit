//////////////____________________T A S K____________________//////////////

import { helper } from '../index';
import { Checklist } from './task-items/checklist';
import { Note } from './task-items/note';
import itemMap from './task-items/itemMap';

//////////////__________________M A R K U P__________________//////////////

import modalDueMarkup from '../components/tasks/forms/modal-date-picker.html';
import taskCardMarkup from '../components/tasks/task-card.html';
import dropdownMarkup from '../components/menus/dropdown-sort-items.html';

//////////////_______________T A S K  C L A S S_______________//////////////

export class Task {
  generateId = helper.generateId;
  checkValue = helper.checkValue;
  checkValidity = helper.checkValidity;
  insertMarkup = helper.insertMarkupAdj;
  addClass = helper.addClass;
  hasClass = helper.hasClass;
  removeClass = helper.removeClass;
  hideElement = helper.hideElement;
  showElement = helper.showElement;
  hideAndShowEls = helper.hideAndShowEls;
  clear = helper.clear;
  scaleUp = helper.scaleUp;
  scaleDown = helper.scaleDown;

  hasChanges = false;

  constructor(id, project, projectEl) {
    this.id = id;
    this.project = project;
    this.projectEl = projectEl;

    this.title = '';
    this.prio = 0;
    this.description = itemMap['description'].default;
    this.dueDate = null;
    this.dueTime = null;
    this.dueDateObj = null;
    this.created = null;

    this.checked = false;
    this.sort = '';

    this.checklists = [];
    this.notes = [];
    this.items = [];
  }

  //////////////__________E V E N T  H A N D L E R S__________//////////////

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
  initTaskCardListeners() {
    this.taskCard.addEventListener('click', this.handleCardClick.bind(this));
  }
  handleCardClick(e) {
    const actionMap = {
      'btn-active-selection': () => this.showDropdown(),
    };

    Object.keys(actionMap).forEach((cls) => {
      if (e.target.closest(`.${cls}`)) {
        actionMap[cls]();
      }
    });
  }

  //////////////________________G E T T E R S________________//////////////

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
  get sortBar() {
    return this.taskCard.querySelector('.task-card__sort-items');
  }
  get dropdown() {
    return this.taskCard.querySelector('.dropdown-sort-items');
  }
  get btnActiveSort() {
    return this.taskCard.querySelector('.btn-active-selection');
  }
  get btnSwapSort() {
    return this.taskCard.querySelector('.btn-swap-sort-order');
  }
  get dropdownText() {
    return this.dropdown.querySelector('.btn-active-selection--text');
  }
  get dropdownSelections() {
    if (this.dropdown) return {};
  }

  //#endregion

  //////////////________________M E T H O D S________________//////////////

  //___F O R M  I T E M S_____________________________________________//
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

    // Update local storage
    this.project.saveProjectState();
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

  //___P R I O_______________________________________________________//
  setPrio(btn) {
    // Remove active style for all Prio buttons
    this.btnsPrio.forEach((btnEl) => {
      this.removeClass(btnEl, `prio${btnEl.dataset.prio}-color-profile`);
    });

    this.prio = btn.dataset.prio;
    this.addClass(btn, `prio${this.prio}-color-profile`);
    this.setPrioColors(this.prio);

    this.hasChanges = true;

    this.project.saveProjectState();
  }
  setPrioColors() {
    // PLACEHOLDER
  }

  //___D U E  D A T E________________________________________________//
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

    // Update local storage
    this.project.saveProjectState();
  }
  displayDueDate() {
    const { calendarBtn, dueDateEl } = this.getDueDateElements();

    if (!this.dueDateObj) return this.hideAndShowEls(dueDateEl, calendarBtn);
    if (calendarBtn) this.hideAndShowEls(calendarBtn, dueDateEl);

    const diff = this.calcTimeDiff(new Date(this.dueDateObj));
    this.updateDueDateDisplay(diff);

    dueDateEl.addEventListener('click', () => this.openDueModal());
  }

  //___D U E  D A T E :  H E L P E R S_______________________________//
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

  //___T A S K S_____________________________________________________//
  renderTaskCard() {
    this.insertMarkup(this.project.projectBody, 'afterbegin', this.populateTaskCardMarkup());

    // If there's no description, set default + styles
    if (this.description === itemMap['description'].default) {
      this.addClass(this.descriptionEl, 'description--default');
    }

    // Display due date
    this.displayDueDate();

    // Display task Items (if there are any)
    if (this.checklists.length || this.notes.length) {
      this.renderItems();
      this.showElement(this.sortBar);
    }

    if (this.sortBar && !this.checklists.length && !this.notes.length) this.hideElement(this.sortBar);

    this.initTaskCardListeners();
  }
  saveTask() {
    // Prevent saving if !title
    this.checkValidity(this.formTitleInput);

    // Update Task card values
    this.created = new Date();
    this.title = this.formTitleInput.value || 'Untitled';
    this.description = this.formDescInput.value.trim() || this.description;

    // Swap out markup
    this.taskForm.remove();
    this.renderTaskCard();

    // Mark changes as saved
    this.hasChanges = false;

    // Update local storage
    this.project.saveProjectState();
  }
  isChecked(task) {
    this.checked = true;
    this.project.moveChecked(task);
  }

  //___T A S K S :  H E L P E R S____________________________________//
  populateTaskCardMarkup() {
    return taskCardMarkup
      .replace('{%TASKCARD_ID%}', this.id)
      .replace('{%TASKCARD_TITLE%}', this.title)
      .replace('{%TASKCARD_DESCRIPTION%}', this.description)
      .replace('{%TASKCARD_CREATED%}', this.getCreationDateStr());
  }
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

  //___I T E M S______________________________________________________//
  renderItems() {
    let markup = '';
    this.items = [...this.checklists, ...this.notes];

    // Sort items
    if (!this.sort) this.sort = 'Creation date';
    this.sortTaskItems();

    // Render items
    this.items.forEach((item) => {
      if (item instanceof Checklist) markup += item.renderChecklist();
      if (item instanceof Note) markup += item.renderNote();
    });
    this.insertMarkup(this.taskCardContainer, 'afterbegin', markup);

    this.notes.forEach((note) => {
      note.initializeQuill(); // prevents circular bug
      note.initListeners();
    });
    this.checklists.forEach((checklist) => checklist.initListeners());
  }
  removeItemById(id, item) {
    // Filters out item from array
    this[`${item}s`] = this[`${item}s`].filter((item) => item.id !== id);
  }

  //___I T E M S :  S O R T___________________________________________//
  showDropdown() {
    // Avoid duplicate dropdown elements
    if (this.dropdown) return this.animateRemove();

    // Insert & position dropdown
    this.insertMarkup(this.sortBar, 'beforeend', dropdownMarkup);
    this.positionDropdown();
    this.scaleUp(this.dropdown, 'top');

    this.initDropdownListeners();
  }
  positionDropdown() {
    const parentRect = this.sortBar.getBoundingClientRect();
    const btnRect = this.btnActiveSort.getBoundingClientRect();

    this.dropdown.style.top = `${parentRect.height}px`;
    this.dropdown.style.right = `${parentRect.right - btnRect.right}px`;
  }
  animateRemove() {
    this.scaleDown(this.dropdown, 'top');
    this.dropdown.addEventListener('animationend', () => this.dropdown.remove(), { once: true });
  }
  sortTaskItems() {
    // Sort: Creation date
    if (this.sort === 'Creation date') {
      return this.items.sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    // Sort: Alphabetical
    if (this.sort === 'Alphabetically') {
      return this.items.sort((a, b) => b.title - a.title);
    }

    // Sort: Item type
    if (this.sort === 'Item type') {
      this.items.sort((a, b) => b.created.getTime() - a.created.getTime());
      this.items.sort((a, b) => (a instanceof Checklist) - (b instanceof Checklist));
      return;
    }
  }
  initDropdownListeners() {
    this.dropdown.addEventListener('click', (e) => this.handleDropdownClick(e));

    // Listen for close
    this.dropdown.addEventListener('mouseleave', () => this.dropdown.remove());
    document.addEventListener('click', (e) => {
      if (!this.dropdown || this.dropdown.contains(e.target) || this.btnActiveSort.contains(e.target)) return;
      this.dropdown.remove();
    });
  }
  handleDropdownClick(e) {
    const actionMap = {
      'dropdown-sort-items__li': () => this.sortTaskItems(),
    };

    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) {
        this.sort = el.dataset.sort;
        actionMap[cls]();
      }
    });
  }
  reverseSortOrder() {
    this.items.reverse();
    this.renderItems();
  }
}
