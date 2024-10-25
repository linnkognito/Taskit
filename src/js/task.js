// task.js
import { helper } from '../index';
import { Checklist } from './task-items/checklist';
import { Note } from './task-items/note';

import checklistFormMarkup from '../components/tasks/items/checklist-form.html';

import noteMarkup from '../components/tasks/items/note-form.html';
import dueModal from '../components/tasks/forms/modal-date-picker.html';
import taskCardTemp from '../components/tasks/task-card.html';

export class Task {
  body = document.querySelector('body');
  taskForm = document.querySelector('.task-form');
  btnDueDate = document.querySelector('.task-form__btn-due-date');

  constructor(id, project, projectEl) {
    this.id = id;
    this.project = project;
    this.projectEl = projectEl;

    this.title = `Untitled Task #${id}`;
    this.prio = 0;
    this.description = 'Click to add a description';
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

    //-- EVENT LISTENERS ------------------------------//
    // FORM: OPEN DUE DATE MODAL
    this.taskForm.addEventListener('click', (e) => {
      const dueBtn = e.target.closest('.task-form__btn-due-date');
      if (!dueBtn) return;
      this.openDueModal();
    });
    // FORM: SET PRIO
    this.els.prioBtns.parent.addEventListener('click', (e) => {
      const btn = e.target.closest('.prio-btn');
      if (!btn) return;
      this.setPrio(btn);
    });
    // FORM: ADD NOTE OR CHECKLIST
    this.els.addBtns.addEventListener('click', (e) => this.addItem(e));
    // FORM: SAVE OR CANCEL
    this.taskForm.addEventListener('click', (e) => this.saveOrCancelForm(e));
  }

  // GETTERS //
  get noteForm() {
    return document.querySelector('.task-form__note');
  }
  get checklistForm() {
    return document.querySelector('.task-form__checklist');
  }

  addItem(e) {
    const checklistId = this.checklists.length + 1;
    const noteId = this.notes.length + 1;

    const insert = (markup) => this.els.addBtns.insertAdjacentHTML('afterend', markup);

    // Add checklist:
    if (this.hasClass('btn-add-checklist', e.target)) {
      const markup = checklistFormMarkup.replace('{%CHECKLIST_ID%}', checklistId);
      insert(markup);
      helper.scaleUp(this.checklistForm, 'top');

      this.els.checklistTitle().focus();

      const newChecklist = new Checklist(checklistId, this);
      this.checklists.push(newChecklist);
    }

    // Add note:
    if (this.hasClass('btn-add-note', e.target)) {
      const markup = noteMarkup.replace('{%NOTE_ID%}', noteId);
      insert(markup);
      helper.scaleUp(this.noteForm, 'top');

      this.els.noteTitle().focus();

      const newNote = new Note(noteId);
      this.notes.push(newNote);
    }
  }
  saveOrCancelForm(e) {
    const btn = e.target.closest('.btn-form-footer') || e.target.closest('.task-form__btn');
    if (!btn) return;

    if (this.hasClass('btn-save', btn)) this.saveTask();
    if (this.hasClass('btn-cancel', btn)) this.taskForm.remove();
  }

  //-- HELPERS -------------------------------------//
  hasClass = (cls, el) => el.classList.contains(cls);
  addClass = (cls, el) => el.classList.add(cls);
  removeClass = (cls, el) => el.classList.remove(cls);

  //-- PRIO -----------------------------------------//
  setPrio(btn) {
    // Remove active style for all Prio buttons
    this.els.prioBtns.btns.forEach((b) => {
      this.removeClass(`prio${b.dataset.prio}-color-profile`, b);
    });

    this.prio = btn.dataset.prio;
    this.addClass(`prio${this.prio}-color-profile`, btn);
    this.setPrioColors(this.prio);
  }

  setPrioColors(prio) {
    // for changing prio color on click
  }

  //-- DUE -----------------------------------------//
  openDueModal() {
    if (document.querySelector('.modal-due-date')) document.querySelector('.modal-due-date').remove();

    helper.insertMarkupAdj(this.body, 'afterbegin', dueModal);

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
    if (this.hasClass('modal', e.target) || this.hasClass('btn-cancel', e.target)) modal.remove();
  }

  //-- DUE: HELPERS ----//
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

  //-- TASK -----------------------------------------//
  saveTask() {
    // Grab value from title
    const title = this.projectEl.querySelector('#input-task-title');
    const description = this.projectEl.querySelector('#input-task-description');

    // Prevent saving if !title
    if (!title.checkValidity()) return title.reportValidity();

    // Set creation date
    this.created = new Date();
    // Create creation date string
    const createdStr = () => {
      const d = this.formatDate(this.created);
      const t = this.toAmPm(this.created);
      return `${d}, ${t}`;
    };

    // Set title
    this.title = title.value;

    // Set description
    if (description.value.trim()) this.description = description.value;

    // Hide form
    this.taskForm.remove();

    // Set task card values
    let taskCardMarkup = taskCardTemp
      .replace('{%TASKCARD_ID%}', this.id)
      .replace('{%TASKCARD_TITLE%}', this.title)
      .replace('{%TASKCARD_DESCRIPTION%}', this.description)
      .replace('{%TASKCARD_CREATED%}', `${createdStr()}`)
      .replace('{%TASKCARD_ITEMS%}', this.sortAndRenderItems(this.sort));

    // Generate task card
    const projectBody = this.projectEl.querySelector('.project-card__body');
    helper.insertMarkupAdj(projectBody, 'afterbegin', taskCardMarkup);

    // Display due date
    this.displayDueDate('card');

    // If default description --> change color
    const taskCard = document.querySelector('.task-card');
    const taskDesc = taskCard.querySelector('.task-card__description');
    if (!description.value) taskDesc.classList.add('task-card__description--default');

    // Get due date values & display
    this.displayDueDate('card');

    // Initialize event listeners
    if (this.notes.length) this.notes.forEach((note) => note.activateListeners());
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

  updateTask() {
    console.log('entered updateTask()');
  }

  isChecked(task) {
    this.checked = true;
    this.project.moveChecked(task);
  }
}
