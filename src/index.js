import './css/styles.css';
import './js/init';
import { showElement, hideElement } from './js/helpers';

export const projects = document.querySelector('#projects');
const addBtn = document.querySelector('.add-project__body');
const projectsArr = [{ title: 'Test project 💻' }];

class Project {
  constructor(title, id) {
    this.title = title;
    this.id = id;
  }

  // get projectTitle() {}

  // changeTitle() {
  //   hideElement();
  // }

  // addNewTask() {
  //   return `

  //   `;
  // }

  // addTask() {
  //   showElement();
  // }
}

// APPLICATION ARCHITECTURE //////////////////////////////////////
class App {
  constructor() {
    addBtn.addEventListener('click', this.renderProjectCard.bind(this));
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('project-card__title')) this.editProjectTitle(e.target);
    });
    // document.addEventListener('click', (e) => this.editProjectTitle(e));
  }

  //-- GETTERS ------------------------------------------------//
  get titleInput() {
    return document.getElementById('project-title-input');
  }

  //-- HELPERS ----------------------------------------------//
  getId(el) {
    return el.closest('.project-card').dataset.id;
  }
  getProject(id) {
    return document.querySelector(`.project-card[data-id="${id}"]`);
  }
  getTitleEl(parent) {
    return parent.querySelector('.project-card__title');
  }
  getInputEl(parent) {
    return parent.querySelector('#project-title-input');
  }

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
    const id = projectsArr.length;
    projects.firstElementChild.insertAdjacentHTML('afterend', this.markup(id));

    // Get active input element
    const project = this.getProject(id);
    const inputEl = this.getInputEl(project);
    const titleEl = this.getTitleEl(project);

    projectsArr.push({ title: '' });
    inputEl.focus();
    this.editProjectTitle(titleEl);
  }

  editProjectTitle(titleEl) {
    const id = this.getId(titleEl);
    const project = this.getProject(id);
    const inputEl = this.getInputEl(project);

    // Keep original title name as placeholder //
    inputEl.value = titleEl.textContent;

    hideElement(titleEl);
    showElement(inputEl);
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
    projectsArr[id].title = title;
    titleEl.textContent = title;

    hideElement(inputEl);
    showElement(titleEl);

    if (!projectsArr[id]) new Project(title, id);
  }
}

const app = new App();
