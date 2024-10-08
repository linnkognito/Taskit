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
    document.addEventListener('click', (e) => this.clickedTitle(e));
    //document.addEventListener('keydown', (e) => this.checkKeydown(e));
  }

  //-- GETTERS ------------------------------------------------//
  get titleInput() {
    return document.getElementById('project-title-input');
  }
  get activeInputEl() {
    return document.activeElement.id === 'project-title-input';
  }

  //-- HELPERS ----------------------------------------------//
  getActiveProject(el) {
    return el.closest('.project-card');
  }
  getActiveInputEl(parent) {
    return parent.querySelector('#project-title-input');
  }
  getProjectId(p) {
    return p.dataset.id;
  }
  getProjectTitle(p) {
    return p.querySelector('.project-card__title');
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
  clickedTitle(e) {
    if (e.target.classList.contains('project-card__title')) {
      const title = e.target;
      const project = this.getActiveProject(title);
      const id = this.getProjectId(project);

      this.editProjectTitle(id, title);
    }
  }

  checkKeydown(e) {
    const enter = e.key === 'Enter';
    const input = e.target.id === 'project-title-input';

    if (enter && input) {
      this.saveProjectTitle(e.target);
    }
  }

  //-- HANDLERS --------------------------------------------//
  renderProjectCard() {
    const id = projectsArr.length;
    projects.firstElementChild.insertAdjacentHTML('afterend', this.markup(id));

    projectsArr.push({ title: '' });
    this.titleInput.focus();
  }

  editProjectTitle(id, title) {
    const project = document.querySelector(`.project-card[data-id="${id}"]`);
    const input = this.getActiveInputEl(project);
    input.value = title.textContent;

    hideElement(title);
    showElement(input);

    input.textContent = projectsArr[id].title;
    input.focus();

    input.addEventListener('blur', () => this.saveProjectTitle(input), { once: true });
    input.addEventListener('keydown', (e) => {
      const enter = e.key === 'Enter';
      if (enter && input) this.saveProjectTitle(e.target);
    });
  }

  saveProjectTitle(input) {
    // const project = input.closest('.project-card');
    // const id = project.dataset.id;
    // const titleEl = project.querySelector('.project-card__title');
    const project = this.getActiveProject(input);
    const id = this.getProjectId(project);
    const titleEl = this.getProjectTitle(project);
    let title = input.value;

    hideElement(input);
    showElement(titleEl);

    title === '' ? (title = `Untitled project #${id}`) : title;
    projectsArr[id].title = title;
    titleEl.textContent = title;

    if (projectsArr[id]) return;
    const newProject = new Project(title, id);
  }
}

const app = new App();
