//////////////_____________________A P P_____________________//////////////

import { Project } from './project';
import { helper } from '../index';

//////////////_______________A P P  C L A S S _______________//////////////
export class App {
  generateId = helper.generateId;
  addClass = helper.addClass;
  removeClass = helper.removeClass;

  constructor() {
    this.projectsArr = [];

    this.loadProjectsFromStorage();
    this.initListeners();
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
      'nav-btn-all-tasks': () => this.showTaskOverview(),
      'nav-btn-new-task': () => this.addNewTaskFromNav(),
      'nav-btn-page-settings': () => this.openPageSettings(),
    };

    Object.keys(actionMap).forEach((cls) => {
      console.log(e.target);
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls]();
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
  get taskForm() {
    return document.querySelector(`.task[data-state="form"]`);
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
  addClonedProject(projectClone) {
    this.projectsArr.push(projectClone);
  }
  showTaskOverview() {
    // Open modal
    // Render tasks from Tasks array (create markup for this)
    // From this view, the user should be able to:
    // Delete one task
    // Delete multiple tasks
    // Edit task (one at the time)
  }
  addNewTaskFromNav() {
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
