import './css/styles.css';
import './js/init';
import { showElement, hideElement } from './js/helpers';

export const projects = document.querySelector('#projects');
const addBtn = document.querySelector('.add-project__body');
const title = document.querySelector('.project-card__title');
const titleInput = document.getElementById('project-title');
const titleEvents = ['click', 'keydown'];

const projectsArr = [];

class Project {
  constructor(title = 'Untitled project', id) {
    this.title = title;
  }
}

// APPLICATION ARCHITECTURE //////////////////////////////////////
class App {
  constructor() {
    addBtn.addEventListener('click', this.renderProjectCard.bind(this));
  }

  get titleInput() {
    return document.getElementById('project-title');
  }

  markup() {
    return `
    <div class="project-card">
      <div class="project-card__header">
        <h2 class="project-card__title hidden"></h2>
        <input type="text" id="project-title" placeholder="Untitled project" data-id="" />
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
    projects.firstElementChild.insertAdjacentHTML('afterend', this.markup());
    titleInput.focus();
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
