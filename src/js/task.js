// task.js

import { app, helper } from '../index';

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
    this.due = { date: null, time: null };

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
      const insert = (markup) => els.addBtns.insertAdjacentHTML('afterend', markup);

      // Add checklist btn clicked:
      if (this.hasClass('btn-add-checklist', e.target)) {
        insert(checklistMarkup);
        els.checklistTitle().focus();
      }
      // Add note btn clicked:
      if (this.hasClass('btn-add-note', e.target)) {
        insert(noteMarkup);
        els.noteTitle().focus();
      }
    });
  }
  //-- HELPERS -------------------------------------//
  hasClass = (cls, el) => el.classList.contains(cls);
  addClass = (cls, el) => el.classList.add(cls);
  removeClass = (cls, el) => el.classList.remove(cls);

  //-- PRIO -----------------------------------------//
  setPrio(btn) {
    // Remove active styles for all Prio buttons
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

  //-- TASK -----------------------------------------//
  saveTask() {
    console.log('entered saveTask()');
  }

  updateTask() {
    console.log('entered updateTask()');
  }

  // calcDate() {}

  // formatDate(date) {
  //   return date;
  // }

  // isChecked(task) {
  //   this.checked = true;
  //   this.project.moveChecked(task);
  // }

  // POPUPS //
  // openDueModal() {
  //   const markup = fetchMarkup('../../src/tasks/forms/modal-date-picker.html');
  //   this.helper.insertMarkupAdj(body, 'afterbegin', markup);

  //   const modal = document.querySelector('.modal-due-date');
  //   modal.addEventListener('click', (e) => {
  //     if (e.target.contains('.modal')) this.helper.showElement(modal);
  //   });
  // }
}
