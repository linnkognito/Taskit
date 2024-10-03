import './css/styles.css';

const projects = document.querySelector('#projects');
const addBtn = document.querySelector('.add-project__body');
const title = document.querySelector('.project-card__title');

const projectsArr = [];
const titleEvents = ['click', 'keydown'];

class Project {
  constructor(title = 'Untitled project', id) {
    this.title = title;
    this.id = id;
  }

  markup() {
    return `
    <div class="project-card">
      <div class="project-card__header">
        <h2 class="project-card__title hidden">${this.title}</h2>
        <input type="text" id="project-title" class="project-card__title-input" placeholder="Untitled project" />
        <div class="project-card__buttons">
          <button class="btn-add-task" title="Add task">+</button>
          <button class="btn-settings" title="Settings">...</button>
        </div>
      </div>
      <div class="project-card__body"></div>
    </div>
    `;
  }

  showElement(el) {
    el.classList.remove('hidden');
  }
  hideElement(el) {
    el.classList.add('hidden');
  }

  renderProjectCard() {
    projects.insertAdjacentHTML('afterbegin', this.markup());

    const titleInput = document.querySelector('.project-card__title-input');
    titleInput.focus();
  }
}

// ADD NEW PRODUCT CARD //
addBtn.addEventListener('click', (e) => {
  const id = projectsArr.length;
  const newProjectCard = new Project(null, id);
  newProjectCard.renderProjectCard();
});
