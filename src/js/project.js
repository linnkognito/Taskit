//////////////________________P R O J E C T________________//////////////

import { app, helper } from '../index';
import { Task } from './task';
import { Checklist } from './task-items/checklist';
import { Note } from './task-items/note';
import { ListItem } from './task-items/checklist';

//////////////_________________M A R K U P_________________//////////////

import dropdownSettings from '../components/menus/dropdown-settings.html';
import dropdownSort from '../components/menus/dropdown-sort.html';
import projectMarkup from '../components/projects/project-card.html';
import taskFormMarkup from '../components/tasks/forms/task_form.html';

//////////////__________P R O J E C T  C L A S S__________//////////////

export class Project {
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
      'btn-settings': (btn) => this.openSettings(btn),
      'btn-sort-tasks': (btn) => this.openSettings(btn),
      'project-card__title': (title) => this.editProjectTitle(title),
      'settings-delete': () => this.deleteProject(),
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
    return document.querySelector(`.task[data-state="form"]`);
  }
  get btnAddTask() {
    return this.projectEl.querySelector('.project-card__btn-add-task');
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

    this.projectEl.addEventListener(
      'animationend',
      () => {
        this.showElement(this.btnAddTask);
        this.scaleUp(this.btnAddTask, 'top');
      },
      { once: true }
    );

    if (localStorage.getItem(`project_${this.id}`)) {
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

    document.querySelector('.task[data-state="form"]').dataset.id = newTask.id;

    // Initialize event listeners of Task instance
    newTask.initListeners();

    // Local storage
    this.saveProjectState();
  }
  discardChanges() {
    return confirm(`A form with unsaved changes is already open.\nDo you want to discard these canges?`); // returns boolean
  }

  //___T A S K S_______________________________________________//

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
