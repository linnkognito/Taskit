//////////////_________________P R O J E C T_________________//////////////

import { helper } from '../index';
import { Task } from './task';

//////////////_________________M A R K U P_________________//////////////

import dropdownSettings from '../components/menus/dropdown-settings.html';
import dropdownSort from '../components/menus/dropdown-sort.html';
import projectMarkup from '../components/projects/project-card.html';
import taskFormMarkup from '../components/tasks/forms/task-form.html';

//////////////__________P R O J E C T  C L A S S__________//////////////

export class Project {
  generateId = helper.generateId;
  addClass = helper.addClass;
  hasClass = helper.hasClass;
  removeClass = helper.removeClass;
  hideAndShowEls = helper.hideAndShowEls;
  getClosest = helper.getClosest;
  insert = helper.insertMarkupAdj;
  scaleUp = helper.scaleUp;
  moveDown = helper.moveDown;

  constructor(id) {
    this.id = id || this.generateId();
    this.title = 'Untitled Project';
    this.dropdown = null;
    this.dropdownBtn = null;

    this.tasks = [];
  }

  //////////////_________E V E N T  H A N D L E R S_________//////////////

  initListeners() {
    this.inputTitle.addEventListener('blur', () => this.saveProjectTitle());
    this.projectEl.addEventListener('click', this.handleClick.bind(this));
  }
  handleClick(e) {
    // Map button classes to methods
    const actionMap = {
      'btn-add-task': () => this.addTask(),
      'btn-delete': (btn) => this.deleteTask(btn),
      'btn-settings': (btn) => this.openSettings(btn),
      'btn-sort-tasks': (btn) => this.openSettings(btn),
      'project-card__title': (title) => this.editProjectTitle(title),
    };

    // Call the method
    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](el);
    });
  }

  //////////////_______________G E T T E R S_______________//////////////

  //#region Getters
  get projects() {
    return document.querySelector('#projects');
  }
  get projectEl() {
    return document.querySelector(`.project-card[data-id="${this.id}"]`);
  }
  get projectHeader() {
    return this.projectEl.querySelector('.project-card__header');
  }
  get projectBody() {
    return this.projectEl.querySelector('.project-card__body');
  }
  get inputTitle() {
    return this.projectEl.querySelector('.project-card__title-input');
  }
  get titleEl() {
    return this.projectEl.querySelector('.project-card__title');
  }
  get taskContainer() {
    return this.projectEl.querySelector('.project-card__task-container');
  }
  get taskForm() {
    return document.querySelector('.task-form');
  }
  //#endregion

  //////////////________________M E T H O D S_______________//////////////

  //___P R O J E C T_________________________________________________//
  renderProjectCard() {
    // Update & insert markup
    const markup = projectMarkup.replace('{%PROJECT_ID%}', this.id);
    this.projects.firstElementChild.insertAdjacentHTML('afterend', markup);

    // Apply animation
    helper.scaleUp(this.projectEl, 'center');

    this.inputTitle.focus();
  }

  //___P R O J E C T  T I T L E_______________________________________//
  saveProjectTitle() {
    this.titleEl.textContent = this.title;
    this.title = this.inputTitle.value.trim() || 'Untitled Project';
    this.hideAndShowEls(this.inputTitle, this.titleEl);
  }
  editProjectTitle() {
    helper.hideAndShowEls(this.titleEl, this.inputTitle);
    this.inputTitle.value = this.title;
    this.inputTitle.focus();
    this.listenForSave();
  }
  listenForSave() {
    this.inputTitle.addEventListener('blur', () => this.saveProjectTitle());
    this.inputTitle.addEventListener('keydown', (e) => {
      const enter = e.key === 'Enter';
      if (enter && this.inputTitle) this.saveProjectTitle();
    });
  }

  //___D R O P D O W N S______________________________________________//
  openSettings(btn) {
    // Check if dropdown is already open
    if (this.dropdownBtn === btn) return this.removeDropdown();
    if (this.dropdown) this.removeDropdown();

    // Store clicked button (needed for closing logic)
    this.dropdownBtn = btn;

    // Render dropdown
    if (btn.title.toLowerCase().includes('settings')) {
      this.renderDropdown(dropdownSettings, '.settings-dropdown');
    }
    if (btn.title.toLowerCase().includes('sort')) {
      this.renderDropdown(dropdownSort, '.sort-dropdown');
    }

    // Placement
    const headerHeight = this.projectHeader.getBoundingClientRect().height;
    this.dropdown.style.top = `calc(${headerHeight}px)`;

    // Listen close dropdown events
    this.listenForClose();
  }
  renderDropdown(markup, cls) {
    this.insert(this.projectHeader, 'afterend', markup);
    this.dropdown = this.projectEl.querySelector(cls);
  }
  removeDropdown() {
    this.dropdown.remove();
    this.dropdown = null;
    this.dropdownBtn = null;
  }
  listenForClose() {
    this.dropdown.addEventListener('mouseleave', () => this.removeDropdown());

    document.addEventListener('click', (e) => {
      if (!this.dropdown || this.dropdown.contains(e.target) || this.dropdownBtn.contains(e.target)) return;
      this.removeDropdown();
    });
  }

  //___S E T T I N G S_______________________________________________//
  // PLACEHOLDER

  //___T A S K S____________________________________________________//
  addTask() {
    // Check if there's already an open form
    if (this.taskForm) {
      // FIX LATER
      // if (this.hasUnsavedChanges() && !this.discardChanges()) return;
      this.taskForm.remove();
    }

    // Insert markup
    this.projectBody.insertAdjacentHTML('afterbegin', taskFormMarkup);

    // Apply animations
    this.scaleUp(this.taskForm, 'top');
    this.moveDown(this.taskContainer, this.taskContainer.getBoundingClientRect().height);

    // Create Task instance
    const newTask = new Task(this.generateId(), this, this.projectEl);
    this.tasks.push(newTask);

    // Have form id match Task id
    this.taskForm.dataset.id = newTask.id;

    newTask.initListeners();
  }
  hasUnsavedChanges() {
    return this.tasks.find((task) => task.id === this.taskForm.dataset.id)?.hasChanges();
  }
  discardChanges() {
    return confirm(`A form with unsaved changes is already open.\nDo you want to discard these canges?`);
  }
}
