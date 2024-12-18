//////////////________________P R O J E C T________________//////////////

import { app, helper } from '../index';
import { Task } from './task';
import { Checklist } from './task-items/checklist';
import { Note } from './task-items/note';
import { ListItem } from './task-items/checklist';
import { sortByPrio, sortByDueDate, sortByAlpha, sortByCreated } from './utils/utils';

//////////////_________________M A R K U P_________________//////////////

import dropdownSettings from '../components/menus/dropdown-settings.html';
import dropdownSort from '../components/menus/dropdown-sort.html';
import projectMarkup from '../components/projects/project-card.html';
import taskFormMarkup from '../components/tasks/forms/task_form.html';

//////////////__________P R O J E C T  C L A S S__________//////////////

export class Project {
  clear = helper.clear;
  generateId = helper.generateId;
  addClass = helper.addClass;
  hasClass = helper.hasClass;
  removeClass = helper.removeClass;
  showElement = helper.showElement;
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
    this.sort = 'created';

    this.tasks = [];
  }

  //////////////_________E V E N T  H A N D L E R S_________//////////////

  initListeners() {
    this.inputTitle.addEventListener('blur', () => this.saveProjectTitle());
    this.inputTitle.addEventListener('keydown', (e) => {
      if (e.target !== 'Enter') return;
      this.saveProjectTitle();
    });

    this.projectEl.addEventListener('click', this.handleClick.bind(this));
  }
  handleClick(e) {
    // Map button classes to methods
    const actionMap = {
      'btn-add-task': () => this.addTask(),
      'btn-settings': (btn) => this.openSettings(btn),
      'btn-sort-tasks': (btn) => this.openSettings(btn),
      'project-card__title': (title) => this.editProjectTitle(title),

      // Settings dropdown
      'settings-edit': () => this.editProjectTitle(),
      'settings-clone': () => this.cloneProject(),
      'settings-delete': () => this.deleteProject(),
      'settings-delete-expired': () => this.deleteExpiredTasks(),
      'settings-mark-complete': () => this.setCompletionStatus(true),
      'settings-mark-incomplete': () => this.setCompletionStatus(false),
    };

    // Call the method
    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](el);
    });
  }
  initSortDropdownListeners() {
    this.sortDropdownLi.forEach((li) => {
      // Icon style
      li.addEventListener('mouseenter', (e) => this.swapSortIcon(e.target, true));
      li.addEventListener('mouseleave', (e) => this.swapSortIcon(e.target, false));

      // Sort order
      li.addEventListener('click', () => this.sortTasks(li.dataset.sort));
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
  get taskContainerChecked() {
    return this.projectEl.querySelector('.project-card__task-container--checked');
  }
  get taskForm() {
    return document.querySelector(`.task[data-state="form"]`);
  }
  get btnAddTask() {
    return this.projectEl.querySelector('.project-card__btn-add-task');
  }
  get completedCounter() {
    return document.querySelector('.project-card__completed-counter');
  }
  get sortDropdownLi() {
    return this.projectEl.querySelectorAll('.sort-dropdown__li');
  }
  //#endregion

  //////////////________________M E T H O D S_______________//////////////

  //___P R O J E C T_________________________________________________//
  renderProjectCard(clone = false) {
    // Update & insert markup
    const markup = projectMarkup.replace('{%PROJECT_ID%}', this.id);
    this.projects.firstElementChild.insertAdjacentHTML('afterend', markup);

    // Apply animation
    this.scaleUp(this.projectEl, 'center');
    this.projectEl.addEventListener(
      'animationend',
      () => {
        this.showElement(this.btnAddTask);
        this.scaleUp(this.btnAddTask, 'top');

        // Ensure the button remains visible
        this.btnAddTask.style.opacity = '1';
        this.projectEl.style.opacity = '1';
      },
      { once: true }
    );

    if (localStorage.getItem(`project_${this.id}`) || clone) {
      this.hideAndShowEls(this.inputTitle, this.titleEl);
      this.titleEl.textContent = this.title;
      return;
    }

    this.inputTitle.focus();
  }
  deleteProject() {
    // Warn
    const warn = confirm(`❗ Are you sure you want to permanently delete Project: ${this.title}?\nThis action is irreversable.\n`);
    if (!warn) return;

    // Delete project from array
    const i = app.projectsArr.findIndex((p) => p.id === this.id);
    if (i !== -1) app.projectsArr.splice(i, 1);

    // Remove from local storage
    localStorage.removeItem(`project_${this.id}`);

    // Remove DOM element
    this.projectEl.remove();
  }
  cloneProject() {
    // Create new Project instance
    const clonedProject = new Project(this.generateId());

    // Create deep copy of Project
    clonedProject.title = `${this.title} (Copy)`;
    clonedProject.tasks = this.tasks.map((task) => {
      const clonedTask = new Task(this.generateId(), clonedProject, clonedProject.projectEl);
      clonedTask.title = task.title;
      clonedTask.prio = task.prio;
      clonedTask.description = task.description;
      clonedTask.dueDate = task.dueDate;
      clonedTask.dueTime = task.dueTime;
      clonedTask.dueDateObj = task.dueDateObj ? new Date(task.dueDateObj) : null;
      clonedTask.created = task.created ? new Date(task.created) : new Date();
      clonedTask.checked = task.checked;
      clonedTask.sort = task.sort;

      // Checklists
      clonedTask.checklists = task.checklists.map((cl) => {
        const clonedChecklist = new Checklist(this.generateId(), clonedTask);
        clonedChecklist.title = cl.title;
        clonedChecklist.checked = cl.checked;
        clonedChecklist.created = new Date(cl.created);

        // Checklist items
        clonedChecklist.items = cl.items.map((item) => {
          const clonedItem = new ListItem(this.generateId(), clonedChecklist);
          clonedItem.value = item.value;
          clonedItem.checked = item.checked;
          clonedItem.created = new Date(item.created);

          return clonedItem;
        });

        return clonedChecklist;
      });

      // Notes
      clonedTask.notes = task.notes.map((note) => {
        const clonedNote = new Note(this.generateId(), clonedTask);
        clonedNote.title = note.title;
        clonedNote.note = note.note;
        clonedNote.created = new Date(note.created);
        return clonedNote;
      });

      return clonedTask;
    });

    // Push to array
    app.addClonedProject(clonedProject);

    // Render project card
    clonedProject.renderProjectCard(true);

    // Render tasks (if any)
    if (clonedProject.tasks.length) {
      clonedProject.tasks.forEach((task) => {
        task.renderTaskCard();
      });
    }

    // Initialize Project listeners
    clonedProject.initListeners();

    // Persist data to local storage
    clonedProject.saveProjectState();
  }
  deleteExpiredTasks() {
    // Mutate array to exclude expired tasks
    for (let i = this.tasks.length - 1; i >= 0; i--) {
      if (!this.tasks[i].dueDateObj) continue;

      const expired = this.tasks[i].dueDateObj.getTime() - new Date().getTime() <= 0 ? true : false;
      if (expired) this.tasks.splice(i, 1);
    }

    // Re-render task cards
    this.renderTaskCards();

    this.saveProjectState();
  }
  getCompletedTasks() {
    // Calculate and display number of completed tasks
    this.completedCounter.textContent = '';
    this.completedCounter.textContent = this.tasks.filter((task) => task.checked === true).length;
  }

  //___P R O J E C T  T I T L E_______________________________________//
  saveProjectTitle() {
    this.titleEl.textContent = this.title;
    this.title = this.inputTitle.value.trim() || 'Untitled Project';
    this.hideAndShowEls(this.inputTitle, this.titleEl);

    // Local storage
    this.saveProjectState();
  }
  editProjectTitle() {
    this.hideAndShowEls(this.titleEl, this.inputTitle);
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
      this.initSortDropdownListeners();
    }

    // Placement
    const headerHeight = this.projectHeader.getBoundingClientRect().height;
    this.dropdown.style.top = `calc(${headerHeight}px)`;

    // Listen for close dropdown events
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
  swapSortIcon(li, hover) {
    const iconOriginal = li.querySelector('.icon-dropdown');
    const iconHover = li.querySelector('.icon-dropdown--hover');

    if (hover) this.hideAndShowEls(iconOriginal, iconHover);
    if (!hover) this.hideAndShowEls(iconHover, iconOriginal);
  }
  listenForClose() {
    this.dropdown.addEventListener('mouseleave', () => this.removeDropdown());

    document.addEventListener('click', (e) => {
      if (!this.dropdown || this.dropdown.contains(e.target) || this.dropdownBtn.contains(e.target)) return;
      this.removeDropdown();
    });
  }

  //___S O R T_______________________________________________________//
  sortTasks(sel) {
    // Enables reversed order on second click
    if (this.sort === sel) this.tasks.reverse();

    if (this.sort !== sel) {
      this.sort = sel;
      if (sel === 'prio') sortByPrio(this.tasks);
      if (sel === 'due-date') sortByDueDate(this.tasks);
      if (sel === 'alpha') sortByAlpha(this.tasks);
      if (sel === 'created') sortByCreated(this.tasks);
    }

    // Re-render task cards
    this.renderTaskCards();

    // Persist to local storage
    this.saveProjectState();
  }

  //___T A S K S____________________________________________________//
  addTask() {
    // Check if there's already an open form
    if (this.taskForm) this.taskForm.remove();

    // Insert markup
    this.projectBody.insertAdjacentHTML('afterbegin', taskFormMarkup);

    // Apply animations
    this.scaleUp(this.taskForm, 'top');
    this.taskForm.addEventListener(
      'animationend',
      () => {
        this.taskForm.style.opacity = '1';
      },
      { once: true }
    );
    this.moveDown(this.taskContainer, this.taskContainer.getBoundingClientRect().height);

    // Create Task instance
    const newTask = new Task(this.generateId(), this, this.projectEl);
    this.tasks.push(newTask);

    document.querySelector('.task[data-state="form"]').dataset.id = newTask.id;
    this.addClass(newTask.taskEl, `prio${newTask.prio}-color-profile`);
    newTask.inputTitle.focus();

    // Initialize event listeners of Task instance
    newTask.initListeners();

    // Local storage
    this.saveProjectState();
  }
  setCompletionStatus(bool) {
    this.tasks.forEach((task) => {
      task.checked = bool;
      task.toggleChecked(true);
    });
  }
  discardChanges() {
    return confirm(`A form with unsaved changes is already open.\nDo you want to discard these canges?`); // returns boolean
  }
  renderTaskCards() {
    this.clear(this.taskContainer);
    this.clear(this.taskContainerChecked);
    this.tasks.forEach((task) => task.renderTaskCard());
  }

  //////////////__________L O C A L  S T O R A G E_________//////////////

  //___S A V E  S T A T E________________________________________________//
  saveProjectState() {
    const projectData = {
      id: this.id,
      title: this.title,

      // TASKS //
      tasks: this.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        prio: task.prio,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        dueDateObj: task.dueDateObj?.getTime() ?? null,
        created: task.created ? task.created.getTime() : null,
        sort: task.sort,
        checked: task.checked,

        // CHECKLISTS (TASKS) //
        checklists: task.checklists.map((cl) => ({
          id: cl.id,
          title: cl.title,
          checked: cl.checked,
          created: cl.created ? cl.created.getTime() : null,
          sort: cl.sort,

          // LIST ITEMS (CHECKLIST) //
          items: cl.items.map((li) => ({
            id: li.id,
            value: li.value,
            checked: li.checked,
            created: li.created ? li.created.getTime() : null,
            sort: li.sort,
          })),
        })),

        // NOTES (TASKS) //
        notes: task.notes.map((n) => ({
          id: n.id,
          title: n.title,
          note: n.note,
          created: n.created ? n.created.getTime() : null,
          sort: n.sort,
        })),
      })),
    };

    localStorage.setItem(`project_${this.id}`, JSON.stringify(projectData));
  }

  //___L O A D  S I N G L E  P R O J E C T_______________________________//
  static loadFromLocalStorage(id) {
    const savedProject = JSON.parse(localStorage.getItem(`project_${id}`));
    if (!savedProject) return null;

    // Render project & populate title
    const project = new Project(savedProject.id);
    project.title = savedProject.title;
    project.renderProjectCard();

    // Load all tasks + items
    project.tasks = savedProject.tasks.map((taskData) => {
      const newTask = new Task(taskData.id, project, project.projectEl);

      newTask.title = taskData.title;
      newTask.description = taskData.description;
      newTask.dueDate = taskData.dueDate;
      newTask.dueTime = taskData.dueTime;
      newTask.dueDateObj = taskData.dueDateObj ? new Date(taskData.dueDateObj) : null;
      newTask.prio = taskData.prio;
      newTask.created = new Date(taskData.created);
      newTask.checked = taskData.checked;

      // Restore checklists
      newTask.checklists = taskData.checklists.map((clData) => {
        const checklist = new Checklist(clData.id, newTask);
        checklist.title = clData.title;
        checklist.checked = clData.checked;
        checklist.created = new Date(clData.created);

        // Restore checklist list items
        checklist.items = clData.items.map((liData) => {
          const item = new ListItem(liData.id, checklist);
          item.value = liData.value;
          item.checked = liData.checked;
          item.created = new Date(liData.created);

          return item;
        });

        return checklist;
      });

      // Restore notes
      newTask.notes = taskData.notes.map((noteData) => {
        const note = new Note(noteData.id, newTask);
        note.title = noteData.title;
        note.note = noteData.note;
        note.created = new Date(noteData.created);
        return note;
      });

      return newTask;
    });

    // Render saved tasks
    project.tasks.forEach((task) => task.renderTaskCard());

    return project;
  }
}
