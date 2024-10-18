// project.js

import { app, helper } from '../index';
import { Task } from './task';

//-- TEMPLATES ----------------------------------//
import taskFormMarkup from '../components/tasks/forms/task-form.html';
import dropdownSort from '../components/menus/dropdown-sort.html';
import dropdownSettings from '../components/menus/dropdown-settings.html';

export class Project {
  tasksArr = [];

  constructor(id) {
    this.id = id;
    this.title = `Untitled #${this.id}`;
    this.projectEl = this.getProjectEl(this.id);
  }

  //-- EVENT HANDLERS ----------------------------//
  initListeners() {
    this.projectEl.addEventListener('click', (e) => this.addTask(e));
    this.projectEl.addEventListener('click', (e) => this.clickedTitle(e));
  }

  clickedTitle(e) {
    const title = e.target.closest('.project-card__title');
    if (!title) return;
    this.editProjectTitle(e.target);
  }

  //-- HELPERS ----------------------------------//
  getProjectEl = (id) => document.querySelector(`.project-card[data-id="${id}"]`);
  getTaskId = (el) => el.closest('.task-form').dataset.id;

  //-- GETTERS ---------------------------------//
  get projectBody() {
    return this.projectEl.querySelector('.project-card__body');
  }
  get titleEl() {
    return this.projectEl.querySelector('.project-card__title');
  }
  get inputEl() {
    return this.projectEl.querySelector('.project-card__title-input');
  }
  get taskEl() {
    return document.querySelector(`.task-card[data-id="${this.id}"]`);
  }

  //-- TITLE ---------------------------------//
  saveProjectTitle() {
    let inputEl = this.inputEl;
    this.titleEl.textContent = this.title;

    // Store new title or set default
    this.title = inputEl.value.trim() || `Untitled #${this.id}`;

    helper.hideAndShowEls(inputEl, this.titleEl);
  }

  editProjectTitle() {
    helper.hideAndShowEls(this.titleEl, this.inputEl);
    this.inputEl.value = this.title;
    this.inputEl.focus();

    // Listen for save //
    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => {
        const enter = e.key === 'Enter';
        if (enter && this.inputEl) this.saveProjectTitle();
      });
      this.inputEl.addEventListener('blur', () => this.saveProjectTitle());
    }
  }

  //-- SETTINGS ------------------------------//
  openSettings(btn) {
    const header = app.getHeaderEl(btn);
    const headerHeight = header.getBoundingClientRect().height;
    const project = this.projectEl;
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
    dropdown.addEventListener('mouseleave', () => helper.hideElement(dropdown)); // close
  }

  //-- TASKS --------------------------------//
  addTask(e) {
    const form = document.querySelector('.task-form');
    if (form) return;

    const btn = e.target.closest('.btn-add-task');

    if (btn) {
      this.projectBody.insertAdjacentHTML('afterbegin', taskFormMarkup);

      const newTask = new Task(this.tasksArr.lengt + 1, this, this.projectEl);
      this.tasksArr.push(newTask);
    }
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
  //-- EFFECTS ----------------------------------//
}
