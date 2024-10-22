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

    this.openDropdown = null;
  }

  //-- EVENT HANDLERS ----------------------------//
  initListeners() {
    // HEADER BTNS //
    this.projectEl.addEventListener('click', (e) => {
      let btnAdd = e.target.closest('.btn-add-task');
      let btnSettings = e.target.closest('.btn-settings');
      let btnSort = e.target.closest('.btn-sort-tasks');

      if (btnAdd) this.addTask(e);
      if (btnSettings || btnSort) this.openSettings(btnSettings ? btnSettings : btnSort);
    });

    // CHANGE TITLE //
    this.projectEl.addEventListener('click', (e) => {
      const title = e.target.closest('.project-card__title');
      const delBtn = e.target.closest('.btn-delete');

      if (title) return this.clickedTitle(e);
      if (delBtn) return this.deleteTask(delBtn);
    });
    // DELETE TASK //
  }

  clickedTitle(e) {
    this.editProjectTitle(e.target);
  }

  //-- HELPERS ----------------------------------//
  getTaskId = (el) => el.closest('.task-card').dataset.id;

  //-- GETTERS ---------------------------------//
  get projectEl() {
    return document.querySelector(`.project-card[data-id="${this.id}"]`);
  }
  get projectBody() {
    return this.projectEl.querySelector('.project-card__body');
  }
  get titleEl() {
    return this.projectEl.querySelector('.project-card__title');
  }
  get inputEl() {
    return this.projectEl.querySelector('.project-card__title-input');
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
    // Check if dropdown is already open
    if (this.openDropdown) {
      this.openDropdown.remove();
      this.openDropdown = null;
      return;
    }

    // Variables
    const header = app.getHeaderEl(btn);
    const headerHeight = header.getBoundingClientRect().height;
    let dropdown;

    // Open Settings
    if (btn.classList.contains('btn-settings')) {
      helper.insertMarkupAdj(header, 'afterend', dropdownSettings);
      dropdown = this.projectEl.querySelector('.settings-dropdown');

      this.openDropdown = dropdown;
    }

    // Open Sort
    if (btn.classList.contains('btn-sort-tasks')) {
      helper.insertMarkupAdj(header, 'afterend', dropdownSort);
      dropdown = this.projectEl.querySelector('.sort-dropdown');

      this.openDropdown = dropdown;
    }

    // Placement
    dropdown.style.top = `calc(${headerHeight}px)`;

    // Close dropdown handler
    if (dropdown) this.closeDropdown(dropdown);
  }

  closeDropdown(dropdown) {
    const events = ['mouseleave', 'click', 'keydown'];
    events.forEach((ev) => {
      this.projectEl.addEventListener(ev, (e) => {
        if (ev === 'mouseleave') {
          return dropdown.remove();
        }
        if (ev === 'click' && !dropdown.contains(e.target)) {
          return dropdown.remove();
        }
        if (ev === 'keydown' && e.key === 'Escape') {
          return dropdown.remove();
        }
      });
    });
  }
  //-- TASKS --------------------------------//
  addTask(e) {
    const form = document.querySelector('.task-form');
    if (form) return;

    const btn = e.target.closest('.btn-add-task');

    if (btn) {
      this.projectBody.insertAdjacentHTML('afterbegin', taskFormMarkup);

      const taskForm = document.querySelector('.task-form');
      // const taskFormHeight = taskForm.getBoundingClientRect().height;

      // Apply animations
      helper.scaleUp(taskForm, 'top');

      const newTask = new Task(this.tasksArr.length + 1, this, this.projectEl);
      this.tasksArr.push(newTask);
    }
  }

  deleteTask(btn) {
    const taskId = this.getTaskId(btn);
    const task = btn.closest(`.task-card[data-id="${taskId}"]`);
    this.tasksArr.splice(taskId - 1, 1);
    task.remove();
  }

  // moveChecked(task) {
  //   this.tasksArr[task.id].checked = true; // do i need this or does the array instance point to the same thinf
  //   this.tasksArr.forEach((task) => {
  //     // sort checked and unchecked based on default (or current) sort option
  //   });
  // }

  // moveChecked(task) { }
}
