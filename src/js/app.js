// app.js

import { Project } from './project';
import { Helper } from './helpers';

export class App {
  //-- CLASS PROPERTIES -------------------------------------//
  helper = new Helper();
  projects = document.querySelector('#projects');
  addBtn = document.querySelector('.add-project__body');
  projectsArr = [new Project('Test project 💻', 0)];

  constructor() {
    this.addBtn.addEventListener('click', this.renderProjectCard.bind(this));
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('project-card__title')) this.editProjectTitle(e.target);
    });

    projects.addEventListener('click', (e) => {
      let btn = e.target.closest('.project-card__btn');
      const id = this.getId(btn);

      if (btn && btn.classList.contains('btn-add-task')) return this.projectsArr[id].addTask();
      if (btn) this.projectsArr[id].openSettings(btn);
    });

    document.addEventListener('click', (e) => {
      const modal = document.querySelector('.modal');
      if (modal && e.target === modal) hideElement(modal);
    });
  }

  //-- HELPERS ----------------------------------------------//
  getId = (el) => el.closest('.project-card').dataset.id;
  getHeaderEl = (el) => el.closest('.project-card__header');
  getProject = (id) => document.querySelector(`.project-card[data-id="${id}"]`);
  getTitleEl = (parent) => parent.querySelector('.project-card__title');
  getInputEl = (parent) => parent.querySelector('#project-title-input');

  //-- MARKUP ------------------------------------------------//
  markup(id) {
    return `
    <div class="project-card" data-id="${id}">
    <div class="project-card__header">
    <h2 class="project-card__title hidden"></h2>
    <input type="text" id="project-title-input" placeholder="Untitled project" />
    <div class="project-card__buttons">
    <button class="btn-add-task" title="Add task">+</button>
    <button class="btn-settings" title="Settings">...</button>
    </div>
    </div>
    <div class="project-card__body"></div>
    </div>
    `;
  }

  //-- METHODS ----------------------------------------------//
  renderProjectCard() {
    const id = this.projectsArr.length;
    this.projects.firstElementChild.insertAdjacentHTML('afterend', this.markup(id));

    // Get active input element
    const project = this.getProject(id);
    const inputEl = this.getInputEl(project);
    const titleEl = this.getTitleEl(project);

    const newProject = new Project(`Untitled project ${id}`, id);
    this.projectsArr.push(newProject);
    inputEl.focus();
    this.editProjectTitle(titleEl);
  }

  editProjectTitle(titleEl) {
    const id = this.getId(titleEl);
    const project = this.getProject(id);
    const inputEl = this.getInputEl(project);

    // Keep original title name as placeholder //
    inputEl.value = titleEl.textContent;

    this.helper.hideElement(titleEl);
    this.helper.showElement(inputEl);
    inputEl.focus();

    // Listen for save //
    inputEl.addEventListener('blur', () => this.saveProjectTitle(id, inputEl, titleEl), { once: true });
    inputEl.addEventListener('keydown', (e) => {
      const enter = e.key === 'Enter';
      if (enter && inputEl) this.saveProjectTitle(id, inputEl, titleEl);
    });
  }

  saveProjectTitle(id, inputEl, titleEl) {
    let title = inputEl.value;
    title === '' ? (title = `Untitled project #${id}`) : title;
    this.projectsArr[id].title = title;
    titleEl.textContent = title;

    hideElement(inputEl);
    showElement(titleEl);

    this.projectsArr[id].title = title;
  }
}
