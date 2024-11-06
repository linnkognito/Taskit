//////////////_____________________A P P_____________________//////////////

import { Project } from './project';
import { helper } from '../index';

//////////////_________________M A R K U P_________________//////////////

import overviewModalMarkup from '../components/ui-components/modal-overview.html';
import baseModalMarkup from '../components/ui-components/modal-base.html';
import taskSnippetMarkup from '../components/tasks/task-snippet.html';
import projectCardMarkup from '../components/projects/project-card.html';
import taskFormMarkup from '../components/tasks/forms/task_form.html';

//////////////_______________A P P  C L A S S _______________//////////////
export class App {
  generateId = helper.generateId;
  hideAndShowEls = helper.hideAndShowEls;
  addClass = helper.addClass;
  removeClass = helper.removeClass;
  hasClass = helper.hasClass;
  insertMarkupAdj = helper.insertMarkupAdj;
  scaleUp = helper.scaleUp;
  scaleDown = helper.scaleDown;

  constructor() {
    this.projectsArr = [];

    this.loadProjectsFromStorage();
    this.initListeners();
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  //////////////__________E V E N T  H A N D L E R S__________//////////////
  initListeners() {
    this.addBtn.addEventListener('click', this.handleClick.bind(this));
    this.nav.addEventListener('click', this.handleClick.bind(this));
  }
  handleClick(e) {
    const actionMap = {
      'btn-add-project': () => this.createNewProject(),
      'nav-btn-add-project': () => this.createNewProject(),
      'nav-btn-all-tasks': () => this.renderOverviewModal(),
      'nav-btn-new-task': () => this.addNewTaskFromNav(),
      'nav-btn-page-settings': () => this.openPageSettings(),
    };

    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls]();
    });
  }
  listenForClose() {
    // Click to close
    this.modal.addEventListener('click', (e) => {
      if (this.hasClass(e.target, 'modal')) this.closeModal();
      if (e.target.closest('.btn-close-modal')) this.closeModal();
    });

    // Esc to close
    document.addEventListener('keydown', this._handleEscClose);
  }
  _handleEscClose(e) {
    if (e.key === 'Escape') this.closeModal();
  }
  initOverviewListeners() {
    this.modalOverview.addEventListener('click', (e) => this.handleOverviewClick(e));
  }
  handleOverviewClick(e) {
    const actionMap = {
      'task-data__project-name': (el) => this.previewProject(el),
      'btn-edit-task': (el) => this.openTaskForm(el),
    };

    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](el);
    });
  }
  initEditModeListeners(task) {
    this.taskForm.addEventListener('click', (e) => this.handleTaskFormClick(e, task));
  }
  handleTaskFormClick(e, task) {
    const actionMap = {
      'task-prio__btn': (btn) => task.setPrio(btn),
    };

    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](el);
    });
  }

  //////////////________________G E T T E R S________________//////////////
  //#region Getters
  get projects() {
    return document.querySelector('#projects');
  }
  get projectBtns() {
    return document.querySelector('.project-card__buttons');
  }
  get dummyProjectCard() {
    return document.querySelector('.add-project');
  }
  get addBtn() {
    return document.querySelector('.add-project__body');
  }
  get nav() {
    return document.querySelector('nav');
  }
  get body() {
    return document.querySelector('body');
  }
  get taskForm() {
    return document.querySelector(`.task[data-state="form"]`);
  }
  get modal() {
    return document.querySelector('.modal');
  }
  get modalOverview() {
    return document.querySelector('.modal-overview');
  }
  get modalBase() {
    return document.querySelector('.modal-base');
  }

  //#endregion

  //////////////________________M E T H O D S________________//////////////

  createNewProject() {
    // Remove any open task form
    if (this.taskForm) this.taskForm.remove();

    // Create instance
    const newProject = new Project(this.generateId());
    this.projectsArr.push(newProject);

    // Render markup
    newProject.renderProjectCard();

    // Initialize event listeners
    newProject.initListeners();
  }
  addClonedProject(clone) {
    this.projectsArr.push(clone);
  }
  addNewTaskFromNav() {
    // Create markup for task form modal w/ Project selection
    // Choose what project the task should belong to
    // Choice 1: existing project
    // Choice 2: new project
    // Warn if no project is choosen
    // Close modal and focus on new Task?
  }
  openPageSettings() {
    // Opens modal with Settings
    // Universal default sort
    // Colors
  }
  closeModal() {
    if (this.modal) {
      // Apply animation
      this.scaleDown(this.modal, 'center');

      // Remove modal after animation ends
      this.modal.addEventListener(
        'animationend',
        () => {
          // Remove modal
          if (this.modal) this.modal.remove();

          // Clear reference & remove Esc listener to avoid bugs
          //document.removeEventListener('keydown', this._handleEscClose);
        },
        { once: true }
      );
    }
  }

  //___M O D A L_____________________________________________________//
  renderOverviewModal() {
    this.insertMarkupAdj(this.body, 'afterbegin', this.populateOverviewMarkup());
    this.scaleUp(this.modalOverview, 'center');

    // Remove animation class to prevent bugs
    this.modalOverview.addEventListener('animationend', () => this.removeClass(this.modalOverview, 'scale-up-center'), { once: true });

    this.listenForClose();
    this.initOverviewListeners();
  }
  populateOverviewMarkup() {
    const { tasks, checklists, notes } = this.getItemAmount();

    // prettier-ignore
    return overviewModalMarkup
      .replace('{%OVERVIEW_TASKS_LENGTH%}', tasks)
      .replace('{%OVERVIEW_CHECKLISTS_LENGTH%}', checklists)
      .replace('{%OVERVIEW_NOTES_LENGTH%}', notes)
      .replace('{%OVERVIEW_TASKS%}', this.renderTaskSnippets());
  }
  renderTaskSnippets() {
    let markup = '';

    this.projectsArr.forEach((project) => {
      if (project.tasks.length) {
        project.tasks.forEach((task) => {
          markup += this.populateTaskSnippetMarkup(task);
        });
      }
    });

    return markup;
  }
  populateTaskSnippetMarkup(task) {
    // prettier-ignore
    return taskSnippetMarkup
      .replace('{%TASK_ID%}', task.id)
      .replace('{%TASK_TITLE%}', task.title)
      .replace('{%TASK_CHECKLISTS_LENGTH%}', task.checklists.length)
      .replace('{%TASK_NOTES_LENGTH%}', task.notes.length)
      .replace('{%TASK_PROJECT_ID%}', task.project.id)
      .replace('{%TASK_PROJECT%}', task.project.title)
      .replace('{%TASK_DESCRIPTION%}', task.description)
      .replace('{%TASK_CREATED%}', task.getCreationDateStr());
  }
  populateBaseModalMarkup(markup) {
    return baseModalMarkup.replace('{%MODAL_CONTENT%}', markup);
  }

  //___M O D A L :  F O R M__________________________________________//
  openTaskForm(el) {
    // Avoid duplicate modals
    if (this.modalBase) this.modalBase.remove();

    const task = this.getTaskById(el.closest('.task-snippet').dataset.id);

    const markup = this.populateBaseModalMarkup(taskFormMarkup);
    this.insertMarkupAdj(this.body, 'afterbegin', markup);
    task.populateTaskForm();
    task.taskForm.style.width = '40%';

    this.initEditModeListeners(task);
    this.listenForClose();
  }

  //___M O D A L :  P R E V I E W____________________________________//
  previewProject(el) {
    // Avoid duplicate modals
    if (this.modalBase) this.modalBase.remove();

    const project = this.projectsArr.find((p) => p.id === el.dataset.id);
    const markup = this.populateBaseModalMarkup(this.populateProjectMarkup(project));
    this.insertMarkupAdj(this.body, 'afterbegin', markup);

    // Render project Tasks
    project.renderTaskCards();

    this.hideAndShowEls(project.inputTitle, project.titleEl);
    project.titleEl.textContent = project.title;

    this.listenForClose();
  }
  populateProjectMarkup(p) {
    return projectCardMarkup.replace('{%PROJECT_ID%}', p.id);
  }

  //___H E L P E R S_________________________________________________//
  getItemAmount() {
    let tasks = 0;
    let checklists = 0;
    let notes = 0;

    // Loop through Projects
    this.projectsArr.forEach((project) => {
      if (!project.tasks) return;
      tasks = tasks + project.tasks.length;

      // Loop through Tasks array
      project.tasks.forEach((task) => {
        if (task.checklists) checklists += task.checklists.length;
        if (task.notes) notes += task.notes.length;
      });
    });

    return { tasks, checklists, notes };
  }
  getTaskById(id) {
    for (const project of this.projectsArr) {
      const task = project.tasks.find((t) => t.id === id);
      if (task) return task;
    }

    return null;
  }

  //////////////__________L O C A L  S T O R A G E_________//////////////

  loadProjectsFromStorage() {
    // Find all project keys in local storage
    const projectIds = Object.keys(localStorage).filter((key) => key.startsWith('project_'));

    // Loop over and load projects
    projectIds.forEach((id) => {
      const project = Project.loadFromLocalStorage(id.replace('project_', ''));

      if (project) {
        this.projectsArr.push(project);
        project.initListeners();
      }
    });
  }
}
