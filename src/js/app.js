// app.js

import { Project } from './project';
import { helper } from '../index';

import projectTemp from '../components/projects/project-card.html';

export class App {
  //-- CLASS PROPERTIES -------------------------------------//
  projects = document.querySelector('#projects');
  projectBtns = document.querySelector('.project-card__buttons');
  dummyProjectCard = document.querySelector('.add-project');
  addBtn = document.querySelector('.add-project__body');
  nav = document.querySelectorAll('nav-link');

  projectsArr = [];

  constructor() {
    this.addBtn.addEventListener('click', this.createNewProject.bind(this));
  }

  //-- HELPERS ----------------------------------------------//
  getId = (el) => el.closest('.project-card').dataset.id;
  getHeaderEl = (el) => el.closest('.project-card__header');
  getProject = (id) => document.querySelector(`.project-card[data-id="${id}"]`);
  getTitleEl = (parent) => parent.querySelector('.project-card__title');
  getInputEl = (parent) => parent.querySelector('.project-card__title-input');
  hasClass = (el, cls) => el.classList.contains(cls);

  //-- METHODS ----------------------------------------------//
  createNewProject() {
    // Remove any open task form
    const taskForm = document.querySelector('.task-form');
    if (taskForm) taskForm.remove();

    // Create ID & render markup
    const id = this.projectsArr.length + 1;
    this.renderProjectCard(id);

    // Focus on title input element
    const inputEl = this.getInputEl(this.getProject(id));
    inputEl.focus();

    // Create instance
    const newProject = new Project(id);
    this.projectsArr.push(newProject);

    // Initialize event listeners
    newProject.initListeners();

    // Capture title
    inputEl.addEventListener('blur', () => newProject.saveProjectTitle());
  }

  renderProjectCard(id) {
    // Update & insert markup
    const projectMarkup = projectTemp.replace('{%PROJECT_ID%}', id);
    this.projects.firstElementChild.insertAdjacentHTML('afterend', projectMarkup);

    // Apply animation
    helper.scaleUp(this.getProject(id), 'center');
  }
}
