import './css/styles.css';
import './js/init';
import { showElement, hideElement } from './js/helpers';

export const projects = document.querySelector('#projects');
const addBtn = document.querySelector('.add-project__body');
const titleInput = document.getElementById('project-title');
const projectsArr = [];

class Project {
  constructor(title, id) {
    this.title = title;
    this.id = id;
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
    document.addEventListener('keydown', (e) => {
      const enter = e.key === 'Enter';
      const input = e.target.id === 'project-title';
      if (enter && input) {
        this.saveProject(e.target);
      }
    });
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

  renderProjectCard() {
    const id = projectsArr.length;
    projects.firstElementChild.insertAdjacentHTML('afterend', this.markup(id));

    projectsArr.push({ title: '' });
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

    const newProject = new Project(title, id);
  }
}

// SET PRODUCT CARD TITLE //
/*
const titleInput = document.getElementById('project-title');
if (titleInput) {
  let val;

  document.addEventListener('click', (e) => {
    if (e.target !== titleInput) {
      val = titleInput.value;
      //console.log('val:', val);
      // let index = titleInput.getAttribute('data-id');
      // console.log('index:', index);

      // hideElement(titleInput);
      // showElement(title);
      // projectsArr[index].title = val;
    }
  });
}
*/
const app = new App();
