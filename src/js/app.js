// app.js

import { Project } from './project';
import { helper } from '../index';

import projectCardMarkup from '../components/projects/project-card.html';

export class App {
  //-- CLASS PROPERTIES -------------------------------------//
  projects = document.querySelector('#projects');
  projectBtns = document.querySelector('.project-card__buttons');
  addBtn = document.querySelector('.add-project__body');
  projectsArr = [new Project('Test project 💻', 0)];

  constructor() {
    this.addBtn.addEventListener('click', this.renderProjectCard.bind(this));

    // CLICKS
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('project-card__title')) this.editProjectTitle(e.target);
    });

    // CLICKS ON PROJECT HEADER BTNS:
    projects.addEventListener('click', (e) => {
      let btn = e.target.closest('.project-card__btn');
      if (!btn) return;
      const id = this.getId(btn);

      // ADD TASK BTN is clicked:
      if (btn && btn.classList.contains('btn-add-task')) {
        return this.projectsArr[id].addTask();
      }
      // SETTINGS BTN or SORT BTN is clicked:
      if (btn && !btn.classList.contains('btn-add-task')) {
        this.projectsArr[id].openSettings(btn);
      }
    });

    // CLICKS OUTSIDE OF MODAL:
    document.addEventListener('click', (e) => {
      const modal = document.querySelector('.modal');
      if (modal && e.target === modal) helper.hideElement(modal);
    });
  }

  //-- HELPERS ----------------------------------------------//
  getId = (el) => el.closest('.project-card').dataset.id;
  getHeaderEl = (el) => el.closest('.project-card__header');
  getProject = (id) => document.querySelector(`.project-card[data-id="${id}"]`);
  getTitleEl = (parent) => parent.querySelector('.project-card__title');
  getInputEl = (parent) => parent.querySelector('.project-card__title-input');

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
    this.projects.firstElementChild.insertAdjacentHTML('afterend', projectCardMarkup);

    const id = this.projectsArr.length;

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

    helper.hideElement(titleEl);
    helper.showElement(inputEl);
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

    helper.hideElement(inputEl);
    helper.showElement(titleEl);

    this.projectsArr[id].title = title;
  }
}
