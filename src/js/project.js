// project.js

import { app, helper } from '../index';
import { Task } from './task';

//-- TEMPLATES -------------------------------------------//
import taskFormMarkup from '../components/tasks/forms/task-form.html';

export class Project {
  tasksArr = [];

  constructor(title, id) {
    this.title = title;
    this.id = id;

    //this.eventListeners();
  }

  // eventListeners() {
  //   this.projectEl().addEventListener('click', (e) => {
  //     e.target.classList.contains('.btn-save');
  //   });
  // }

  //-- HELPERS ----------------------------------------------//
  getTaskId = (el) => el.closest('.task-form').dataset.id;

  //-- GETTERS ----------------------------------------------//
  get projectEl() {
    return app.getProject(this.id);
  }
  get projectBody() {
    return this.projectEl.querySelector('.project-card__body');
  }
  get taskEl() {
    return document.querySelector(`.project-card[data-id="${this.id}"]`);
  }

  //-- MARKUP -----------------------------------------------//
  settingsMarkup() {
    return `
    <div class="settings-dropdown">
      <div class="settings-dropdown__li">Edit title</div>
      <div class="settings-dropdown__li">Clone project</div>
      <div class="settings-dropdown__li">Mark all task complete</div>
      <div class="settings-dropdown__li">Delete expired tasks</div>
      <div class="settings-dropdown__li">Delete project</div>
    </div>
    `;
  }
  sortMarkup() {
    return `
      <div class='dropdown-project sort-dropdown'>
        <div class='dropdown-project__li sort-dropdown__li'>
          <img src='./icons/sort-prio.png' alt='Prio icon' class='icon-dropdown icon-swap' />
          <span>Priority</span>
        </div>
        <div class='dropdown-project__li sort-dropdown__li'>
          <img src='./icons/sort-due-date.png' alt='Due icon' class='icon-dropdown icon-due' />
          <span>Due date</span>
        </div>
        <div class='dropdown-project__li sort-dropdown__li'>
          <img src='./icons/sort-alpha.png' alt='Sort alphabetically icon' class='icon-dropdown icon-alpha' />
          <span>Alphabetically</span>
        </div>
        <div class='dropdown-project__li sort-dropdown__li'>
          <img src='./icons/sort-created.png' alt='Created icon' class='icon-dropdown icon-created' />
          <span>Created</span>
        </div>
      </div>
      `;
  }

  //-- SETTINGS ---------------------------------------------//
  openSettings(btn) {
    const header = app.getHeaderEl(btn);
    const headerHeight = header.getBoundingClientRect().height;
    const project = app.getProject(this.id);
    let dropdown;

    if (btn.classList.contains('btn-settings')) {
      header.insertAdjacentHTML('afterend', this.settingsMarkup());
      dropdown = project.querySelector('.settings-dropdown');
    }
    if (btn.classList.contains('btn-sort-tasks')) {
      header.insertAdjacentHTML('afterend', this.sortMarkup());
      dropdown = project.querySelector('.sort-dropdown');
    }

    dropdown.style.top = `calc(${headerHeight}px)`; // placement
    dropdown.addEventListener('mouseleave', () => helper.hideElement(dropdown)); // close}
  }

  //-- TASKS -----------------------------------------------//
  addTask() {
    this.projectBody.insertAdjacentHTML('afterbegin', taskFormMarkup);
  }

  newTask() {
    const taskId = this.tasksArr.length;

    // Grab all values

    // Check if Task already exists
    if (this.tasksArr[taskId]) saveTask();

    // Create new Task instance & pass project (this)
    const newTask = new Task(taskId, title, prio, description, dueDate, dueTime, this);

    // Store instance in array
    this.tasksArr.push(newTask);
  }

  saveTask() {}

  // deleteTask(id) {
  //   this.tasksArr.splice(id, 1);
  //   // Check if it exists in the checkedTasks array & delete that too
  //   // Re-render code from Array
  // }

  // moveChecked(task) {
  //   this.tasksArr[task.id].checked = true; // do i need this or does the array instance point to the same thinf
  //   this.tasksArr.forEach((task) => {
  //     // sort checked and unchecked based on default (or current) sort option
  //   });
  // }

  // moveChecked(task) { }
  //-- EFFECTS ---------------------------------------------//
}
