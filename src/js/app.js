// app.js

import { Project } from './project';
import { helper } from '../index';

////////////////////////////////////////////////////////////////////////

export class App {
  generateId = helper.generateId;
  addClass = helper.addClass;
  removeClass = helper.removeClass;

  constructor() {
    this.projectsArr = [];

    this.addBtn.addEventListener('click', this.createNewProject.bind(this));
  }

  //-- GETTERS ----------------------------------------------//
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
    return document.querySelectorAll('.nav-link');
  }
  get taskForm() {
    return document.querySelector('.task-form');
  }
  //#endregion

  //-- METHODS ----------------------------------------------//
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
}
