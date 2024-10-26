//////////////_____________________T A S K_____________________//////////////

import { helper } from '../index';
import { Checklist } from './task-items/checklist';
import { Note } from './task-items/note';
import itemMap from './task-items/itemMap';

//////////////_________________M A R K U P_________________//////////////

import dueModal from '../components/tasks/forms/modal-date-picker.html';
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
  scaleUp = helper.scaleUp;

  hasChanges = false;

  constructor(id, project, projectEl) {
    this.id = id;
    this.project = project;
    this.projectEl = projectEl;

    this.title = `Untitled`;
    this.prio = 0;
    this.description = itemMap['description'].default;
    this.dueDate = null;
    this.dueTime = null;
    this.dueDateObj = null;
    this.checked = false;
    this.created = null;
    this.sort = 'created';

    this.checklists = [];
    this.notes = [];

    this.els = {
      addBtns: this.projectEl.querySelector('.task-form__add-item-buttons'),
      taskFormBody: this.projectEl.querySelector('.task-form__body'),

      taskTitle: {
        input: this.projectEl.querySelector('#input-task-title'),
        val: this.projectEl.querySelector('#input-task-title').value,
      },
      prioBtns: {
        parent: this.projectEl.querySelector('.task-form__prio'),
        btns: this.projectEl.querySelectorAll('.prio-btn'),
      },
      description: {
        input: this.projectEl.querySelector('#input-task-description'),
        val: this.projectEl.querySelector('#input-task-description').value,
      },
      checklist: {
        checklist: () => this.projectEl.querySelector('.task-form__checklist'),
      },
      taskFooter: document.querySelector('.task-form__footer'),

      checklistTitle: () => this.projectEl.querySelector('.task-form__checklist-input-title'),
      noteTitle: () => this.projectEl.querySelector('.task-form__note-input-title'),
    };
  }

  //////////////_________E V E N T  H A N D L E R S_________//////////////
  initListeners() {
    this.taskForm.addEventListener('click', this.handleClick.bind(this));
  }
  handleClick(e) {
    // Map button classes to methods
    const actionMap = {
      'prio-btn': (btn) => this.setPrio(btn),
      'task-form__btn-due-date': (btn) => this.openDueModal(btn),
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
  get taskFormContainer() {
    return this.projectEl.querySelector('.task-form__container');
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
    this.els.prioBtns.btns.forEach((b) => {
      this.removeClass(b, `prio${b.dataset.prio}-color-profile`);
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
    if (document.querySelector('.modal-due-date')) document.querySelector('.modal-due-date').remove();

    this.insertMarkup(this.body, 'afterbegin', dueModal);

    const modal = document.querySelector('.modal');
    const btnSave = document.querySelector('.btn-save');
    const btnCancel = document.querySelector('.btn-cancel');

    // If the user previously entered values
    if (this.dueDate) {
      const dateInput = modal.querySelector('.input-due-date');
      const timeInput = modal.querySelector('.input-due-time');

      // Insert stored values into input fields
      dateInput.value = this.dueDate;
      timeInput.value = this.dueTime;
    }

    modal.addEventListener('click', (e) => this.closeModal(e, modal), { once: true });
    btnCancel.addEventListener('click', (e) => this.closeModal(e, modal), { once: true });
    btnSave.addEventListener('click', () => this.saveDueDate(modal), { once: true });
  }
  saveDueDate(modal) {
    const inputDate = document.querySelector('.input-due-date').value;
    const inputTime = document.querySelector('.input-due-time').value;

    // User clicks Save w/out any input
    if (!inputDate && !inputTime) return alert('📅 Pick a future date or Cancel');

    // Capture time
    const date = inputDate ? new Date(this.parseDate(inputDate)) : new Date();
    const time = inputTime ? inputTime : new Date().toTimeString().slice(0, 5);
    const fullDate = this.getFullDate(date, time);

    // Set time
    this.dueDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    this.dueTime = time;
    this.dueDateObj = fullDate;

    // Make sure the time is in the future
    const diff = this.dueDateObj.getTime() - new Date().getTime();
    if (diff < 0) return alert('❗ The selected date and/or time must be in the future');

    // Handle DOM elements
    modal.remove();
    this.displayDueDate('form');

    this.hasChanges = true;
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
  displayDueDate(cls) {
    const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const calendarBtn = this.projectEl.querySelector(`.task-${cls}__btn-due-date`);
    const dueDateEl = this.projectEl.querySelector(`.task-${cls}__due-date`);
    const monthEl = this.projectEl.querySelector(`.task-${cls}__due-date--month`);
    const dateEl = this.projectEl.querySelector(`.task-${cls}__due-date--date`);
    const yearEl = this.projectEl.querySelector(`.task-${cls}__due-date--year`);

    if (!this.dueDateObj) {
      helper.hideElement(dueDateEl);
      helper.showElement(calendarBtn);
      return;
    }

    if (calendarBtn) helper.hideElement(calendarBtn);
    helper.showElement(dueDateEl);

    monthEl.innerHTML = '';
    dateEl.innerHTML = '';
    yearEl.innerHTML = '';

    const diff = this.calcTimeDiff(new Date(this.dueDateObj));

    if (!diff.years && !diff.days && diff.hours && !diff.mins) {
      dateEl.textContent = diff.hours;
      yearEl.textContent = diff.hours === 1 ? 'hour' : 'hours';
    }
    if (!diff.years && !diff.days && diff.hours && diff.mins) {
      dateEl.textContent = `${diff.hours}h`;
      yearEl.textContent = `${diff.mins} ${diff.mins === 1 ? 'min' : 'mins'}`;
    }
    if (!diff.years && !diff.days && !diff.hours) {
      dateEl.textContent = Math.ceil(diff.mins);
      yearEl.textContent = Math.ceil(diff.mins) === 1 ? 'min' : 'mins';
    }
    if (diff.days || diff.years) {
      monthEl.textContent = `${monthsArr[this.dueDateObj.getMonth()].slice(0, 3)}`;
      dateEl.textContent = `${this.dueDateObj.getDate()}`;
      yearEl.textContent = `${this.dueDateObj.getFullYear()}`;
    }

    dueDateEl.addEventListener('click', () => this.openDueModal());
  }
  closeModal(e, modal) {
    if (this.hasClass(e.target, 'modal') || this.hasClass(e.target, 'btn-cancel')) modal.remove();
  }

  //___D U E  D A T E :  H E L P E R S______________________________//
  parseDate(date) {
    const [y, m, d] = date.split('-');
    return new Date(y, m - 1, d);
  }
  getFullDate(date, time) {
    const [h, m] = time.split(':');
    date.setHours(h);
    date.setMinutes(m);
    return date;
  }
  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, 0);
    const d = String(date.getDate()).padStart(2, 0);

    return `${m}/${d}/${y}`;
  }
  toAmPm(date) {
    const time = date.toTimeString().slice(0, 5);
    const [h24, min] = time.split(':');
    const h12 = h24 % 12 || 12;
    const per = h24 >= 12 ? 'PM' : 'AM';

    return `${h12}:${min} ${per}`;
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
    this.displayDueDate('card');

    // Mark changes as saved
    this.hasChanges = false;
  }

  sortAndRenderItems(sortPref) {
    let items;
    let markup = '';

    // Sort by creation date
    if (sortPref === 'created') {
      items = [...this.checklists, ...this.notes];
      items.sort((a, b) => b.created - a.created);

      // Render markup for items
      items.forEach((item) => {
        if (item instanceof Checklist) markup += item.renderChecklist();
        if (item instanceof Note) markup += item.renderNote();
      });
    }

    // Sort by due date
    if (sortPref === 'due') {
      return console.log('due date selected as sorting preference');
    }

    return markup;
  }

  isChecked(task) {
    this.checked = true;
    this.project.moveChecked(task);
  }

  //___T A S K S :  H E L P E R S___________________________________//
  getCreationDateStr = () => {
    const d = this.formatDate(this.created);
    const t = this.toAmPm(this.created);

    return `${d}, ${t}`;
  };
  populateTaskCardMarkup() {
    return taskCardMarkup
      .replace('{%TASKCARD_ID%}', this.id)
      .replace('{%TASKCARD_TITLE%}', this.title)
      .replace('{%TASKCARD_DESCRIPTION%}', this.description)
      .replace('{%TASKCARD_CREATED%}', this.getCreationDateStr())
      .replace('{%TASKCARD_ITEMS%}', this.sortAndRenderItems(this.sort));
  }

  //___T A S K  I T E M S___________________________________________//
  removeItemById(id, item) {
    // Filters out item from array
    this[`${item}s`] = this[`${item}s`].filter((item) => item.id !== id);
  }
}
