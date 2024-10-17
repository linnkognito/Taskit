// task.js
import { app, helper } from '../index';

import checklistMarkup from '../components/tasks/items/item-checklist.html';
import noteMarkup from '../components/tasks/items/item-note.html';
import dueModal from '../components/tasks/forms/modal-date-picker.html';

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
    this.description = '';
    this.dueDate = null;
    this.checked = false;
    //this.created = this.formatDate(new Date());

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

    this.taskForm.addEventListener('click', (e) => {
      const dueBtn = e.target.closest('.task-form__btn-due-date');
      if (!dueBtn) return;

      this.openDueModal();
    });
    this.els.prioBtns.parent.addEventListener('click', (e) => {
      const btn = e.target.closest('.prio-btn');
      if (!btn) return;
      this.setPrio(btn);
    });
    this.els.addBtns.addEventListener('click', (e) => {
      const insert = (markup) => this.els.addBtns.insertAdjacentHTML('afterend', markup);

      // Add checklist btn clicked:
      if (this.hasClass('btn-add-checklist', e.target)) {
        insert(checklistMarkup);
        this.els.checklistTitle().focus();
      }
      // Add note btn clicked:
      if (this.hasClass('btn-add-note', e.target)) {
        insert(noteMarkup);
        this.els.noteTitle().focus();
      }
    });
    this.els.taskTitle.input.addEventListener('blur', (e) => {
      if (!e.target.checkValidity()) e.target.reportValidity();
    });
    this.els.taskFooter.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-form-footer');
      console.log(e.target);
      if (!btn) return;

      if (this.hasClass('btn-save', btn)) {
        console.log('btn-save clicked');
        //this.saveTask();
      }
      if (this.hasClass('btn-cancel', btn)) console.log('btn-cancel clicked');
    });
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
    helper.insertMarkupAdj(this.body, 'afterbegin', dueModal);

    const modal = document.querySelector('.modal');
    const btnSave = document.querySelector('.btn-save');
    const btnCancel = document.querySelector('.btn-cancel');

    modal.addEventListener('click', (e) => this.closeModal(e, modal));
    btnCancel.addEventListener('click', (e) => this.closeModal(e, modal));
    btnSave.addEventListener('click', () => this.saveDueDate(modal));
  }

  saveDueDate(modal) {
    const inputDate = document.querySelector('.input-due-date').value;
    const inputTime = document.querySelector('.input-due-time').value;

    // User clicks Save w/out any input BUT w/ previous input
    if (this.dueDate) this.getDueValue();

    // User clicks Save w/out any input
    if (!inputDate && !inputTime) return alert('📅 Pick a future date or Cancel');

    // Capture time
    const date = inputDate ? new Date(this.parseDate(inputDate)) : new Date();
    const time = inputTime ? inputTime : new Date().toTimeString().slice(0, 5);
    const [h, min] = time.split(':');
    date.setHours(h);
    date.setMinutes(min);

    // Make sure the time is in the future
    const diff = this.calcTimeDiff(date);
    if (diff < 0) return alert('❗ The selected date and/or time must be in the future');

    // Set time
    this.dueDate = date;

    // Handle DOM elements
    helper.hideElement(modal);
    this.displayDueDate();
  }

  parseDate(date) {
    const [y, m, d] = date.split('-');
    return new Date(y, m - 1, d);
  }

  // UNUSED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // calcTimeDiff(date) {
  //   const diffMs = date.getTime() - new Date().getTime();

  //   const calcYear = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  //   const years = calcYear >= 0.9 ? Math.ceil(calcYear) : Math.floor(calcYear);
  //   let remaining = diffMs % (1000 * 60 * 60 * 24 * 365.25);

  //   const days = Math.round(remaining / (1000 * 60 * 60 * 24));
  //   remaining = remaining % (1000 * 60 * 60 * 24);

  //   const hours = Math.floor(remaining / (1000 * 60 * 60));
  //   remaining = remaining % (1000 * 60 * 60);

  //   const mins = Math.floor(remaining / (1000 * 60));
  //   remaining = remaining % (1000 * 60);

  //   return { years, days, hours, mins };
  // }

  displayDueDate() {
    const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const calendarBtn = this.projectEl.querySelector('.task-form__btn-due-date');
    const dueDateEl = this.projectEl.querySelector('.task-form__due-date');
    const month = this.projectEl.querySelector('.task-form__due-date--month');
    const date = this.projectEl.querySelector('.task-form__due-date--date');
    const year = this.projectEl.querySelector('.task-form__due-date--year');

    helper.hideElement(calendarBtn);
    helper.showElement(dueDateEl);

    month.innerHTML = '';
    date.innerHTML = '';
    year.innerHTML = '';

    month.textContent = `${this.dueDate.getMonth()}`;
    date.textContent = `${monthsArr[this.dueDate.getDate()]}`;
    year.textContent = `${this.dueDate.getFullYear()}`;
  }

  closeModal(e, modal) {
    if (this.hasClass('modal', e.target) || this.hasClass('btn-cancel', e.target)) helper.hideElement(modal);
  }

  //-- TASK -----------------------------------------//
  saveTask() {}

  updateTask() {
    console.log('entered updateTask()');
  }

  isChecked(task) {
    this.checked = true;
    this.project.moveChecked(task);
  }
}
