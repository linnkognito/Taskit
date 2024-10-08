import './css/styles.css';
import './js/init';
import { showElement, hideElement } from './js/helpers';

export const projects = document.querySelector('#projects');
const titleInput = document.querySelector('#project-title');
const addBtn = document.querySelector('.add-project__body');
const projectTitle = document.querySelector('.project-card__title');
const projectsArr = [{ title: 'Test project 💻' }];

class Project {
  constructor(title, id) {
    this.title = title;
    this.id = id;
  }

  get projectTitle() {}

  changeTitle() {
    hideElement();
  }

  addNewTask() {
    return `

    `;
  }

  addTask() {
    showElement();
  }
}

// APPLICATION ARCHITECTURE //////////////////////////////////////
class App {
  constructor() {
    addBtn.addEventListener('click', this.renderProjectCard.bind(this));
    projectTitle.addEventListener('click', (e) => this.checkClickTitle(e));
    document.addEventListener('keydown', (e) => this.checkKeydown(e));
  }

  get titleInput() {
    return document.getElementById('project-title');
  }

  markup(id) {
    return `
    <div class="project-card" data-id="${id}">
      <div class="project-card__header">
        <h2 class="project-card__title hidden"></h2>
        <input type="text" id="project-title" placeholder="Untitled project" />
        <div class="project-card__buttons">
          <button class="btn-add-task" title="Add task">+</button>
          <button class="btn-settings" title="Settings">...</button>
        </div>
      </div>
      <div class="project-card__body"></div>
    </div>
    `;
  }

  checkClickTitle(e) {
    if (e.target !== projectTitle) return;
    const project = e.target.closest('.project-card');
    const id = project.dataset.id;
    this.editProjectTitle(id);
  }

  checkKeydown(e) {
    const enter = e.key === 'Enter';
    const input = e.target.id === 'project-title';

    if (enter && input) {
      this.saveProject(e.target);
    }
  }

  renderProjectCard() {
    const id = projectsArr.length;
    projects.firstElementChild.insertAdjacentHTML('afterend', this.markup(id));

    projectsArr.push({ title: '' });
    titleInput.focus();
  }

  editProjectTitle(i) {
    hideElement(projectTitle);
    showElement(titleInput);
    console.log('index:', projectsArr[i]);
    titleInput.placeholder = projectsArr[i].title;
    titleInput.focus();
  }

  saveProject(target) {
    const project = target.closest('.project-card');
    const id = project.dataset.id;
    const titleEl = project.querySelector('.project-card__title');
    let title = target.value;

    hideElement(target);
    showElement(titleEl);

    title === '' ? (title = `Untitled project #${id}`) : title;
    projectsArr[id].title = title;
    titleEl.textContent = title;

    console.log(projectsArr[id]);

    if (projectsArr[id]) return;
    const newProject = new Project(title, id);
  }
}

const app = new App();
