// project.js

import { app } from '../index';
import { Task } from './task';
import { Helper } from './helpers';

export class Project {
  helper = new Helper();
  tasksArr = [];

  constructor(title, id) {
    this.title = title;
    this.id = id;
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
    // if (dropdown) {
    dropdown.style.top = `calc(${headerHeight}px)`; // placement
    dropdown.addEventListener('mouseleave', () => this.helper.hideElement(dropdown)); // close}
    // }
  }

  //-- TASKS -----------------------------------------------//
  addTask() {
    // Generate TASK FORM markup
    const markup = this.helper.fetchMarkup('./components/tasks/forms/task-form.html');
    console.log('addTask markup variable', markup);

    // Make project pass itself to Task //
    //const taskId = this.tasksArr.length;
    //const newTask = new Task(taskId, title, prio, description, dueDate, dueTime, this);

    //this.tasksArr.push(newTask);
  }

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
