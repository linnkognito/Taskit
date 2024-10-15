// task.js

import { app, helper } from '../index';

export class Task {
  body = document.querySelector('body');
  taskForm = document.querySelector('.task-form');
  btnDueDate = document.querySelector('.task-form__btn-due-date');

  prioLevels = [0, 1, 2, 3];

  constructor(title, prio, description, dueDate, dueTime, project) {
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
