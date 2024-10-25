// project.js

import { helper } from '../index';
import { Task } from './task';

import dropdownSettings from '../components/menus/dropdown-settings.html';
import dropdownSort from '../components/menus/dropdown-sort.html';
import projectMarkup from '../components/projects/project-card.html';
import taskFormMarkup from '../components/tasks/forms/task-form.html';

////////////////////////////////////////////////////////////////////////

export class Project {
  generateId = helper.generateId;
  addClass = helper.addClass;
  hasClass = helper.hasClass;
  removeClass = helper.removeClass;
  hideAndShowEls = helper.hideAndShowEls;
  getClosest = helper.getClosest;

  constructor(id) {
    this.id = id || this.generateId();
    this.title = 'Untitled Project';
    this.openDropdown = null;

    this.tasksArr = [];
  }

  //-- EVENT HANDLERS ----------------------------//
  initListeners() {
    // SAVE TITLE //
    this.inputEl.addEventListener('blur', () => this.saveProjectTitle());

    // HEADER BTNS //
    this.projectEl.addEventListener('click', (e) => {
      const btnAdd = e.target.closest('.btn-add-task');
      const btnSettings = e.target.closest('.btn-settings');
      const btnSort = e.target.closest('.btn-sort-tasks');

      if (btnAdd) this.addTask(e);
      if (btnSettings || btnSort) this.openSettings(btnSettings ? btnSettings : btnSort);
    });

    // CHANGE TITLE //
    this.projectEl.addEventListener('click', (e) => {
      const title = e.target.closest('.project-card__title');
      const delBtn = e.target.closest('.btn-delete');

      if (title) return this.editProjectTitle(e.target);
      if (delBtn) return this.deleteTask(delBtn);
    });
    // this.projectEl.addEventListener('click', (e) => {
    //   const title = e.target.closest('.project-card__title');
    //   const delBtn = e.target.closest('.btn-delete');

    //   if (title) return this.editProjectTitle(e.target);
    //   if (delBtn) return this.deleteTask(delBtn);
    // });
  }

  //-- GETTERS ---------------------------------//
  //#region Getters
  get projectEl() {
    return document.querySelector(`.project-card[data-id="${this.id}"]`);
  }
  get projects() {
    return document.querySelector('#projects');
  }
  get titleInput() {
    return this.projectEl.querySelector('.project-card__title-input');
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
  //#endregion

  //-- PROJECT --------------------------------//
  renderProjectCard() {
    // Update & insert markup
    const markup = projectMarkup.replace('{%PROJECT_ID%}', this.id);
    this.projects.firstElementChild.insertAdjacentHTML('afterend', markup);

    // Apply animation
    helper.scaleUp(this.projectEl, 'center');

    this.titleInput.focus();
  }

  saveProjectTitle() {
    this.titleEl.textContent = this.title;
    this.title = this.inputEl.value.trim() || 'Untitled Project';
    this.hideAndShowEls(this.inputEl, this.titleEl);
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
    const header = this.getClosest(btn, '.project-card__header');
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
      // Insert markup
      this.projectBody.insertAdjacentHTML('afterbegin', taskFormMarkup);

      // Get elements
      const taskForm = document.querySelector('.task-form');
      const content = document.querySelector('.project-card__body--content');

      // Get form height
      const taskFormHeight = taskForm.getBoundingClientRect().height;

      // Apply animations
      helper.scaleUp(taskForm, 'top');
      content.transition = 'transform 0.3s ease';
      helper.moveDown(content, taskFormHeight);

      // Create Task instance
      const newTask = new Task(this.tasksArr.length + 1, this, this.projectEl);
      this.tasksArr.push(newTask);
    }
  }

  deleteTask(btn) {
    console.log(`deleteTask entered (it's empty, needs to be reworked)`);
    // const taskId = this.getTaskId(btn);
    // const task = btn.closest(`.task-card[data-id="${taskId}"]`);
    // this.tasksArr.splice(taskId - 1, 1);
    // task.remove();
  }
}
