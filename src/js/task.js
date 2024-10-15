// task.js

import { app, helper } from '../index';

export class Task {
  body = document.querySelector('body');
  taskForm = document.querySelector('.task-form');
  btnDueDate = document.querySelector('.task-form__btn-due-date');

  prioLevels = [
    {
      primary: 'vars.$col-primary',
      light: 'vars.$col-primary-op',
      lightest: 'vars.$col-primary-low-op',
      dark: 'vars.$col-primary-dark',
      selected: 'vars.$col-primary-selected',
    },
    {
      primary: 'vars.$col-prio1',
      light: 'vars.$col-prio1-light',
      lightest: 'vars.$col-prio1-xlight',
      dark: 'vars.$col-prio1-dark',
      selected: 'vars.$col-prio1-selected',
    },
    {
      primary: 'vars.$col-prio2',
      light: 'vars.$col-prio2-light',
      lightest: 'vars.$col-prio2-xlight',
      dark: 'vars.$col-prio2-dark',
      selected: 'vars.$col-prio2-selected',
    },
    {
      primary: 'vars.$col-prio3',
      light: 'vars.$col-prio3-light',
      lightest: 'vars.$col-prio3-xlight',
      dark: 'vars.$col-prio3-dark',
      selected: 'vars.$col-prio3-selected',
    },
  ];

  constructor(id, title, prio, description, dueDate, dueTime, project) {
    this.id = id;
    this.title = title;
    this.prio = prio;
    this.description = description || '';
    this.due = { date: dueDate, time: dueTime } || null;

    this.checked = false;
    this.created = this.formatDate(new Date());
    this.project = project;

    taskForm.addEventListener('click', (e) => {
      console.log(e.target);
      this.openDueModal();
    });
  }

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
