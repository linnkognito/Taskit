import { app } from '../index';
import { showElement, hideElement, containsClass } from './helpers';

export class Project {
  constructor(title, id) {
    this.title = title;
    this.id = id;
  }

  //-- HELPERS ----------------------------------------------//
  //-- MARKUP -----------------------------------------------//
  dropdownMarkup() {
    return `
    <div class="settings-dropdown">Hello</div>
    `;
  }

  //-- SETTINGS ---------------------------------------------//
  openSettings(btn) {
    const header = app.getHeaderEl(btn);
    const headerHeight = header.getBoundingClientRect().height;
    const project = app.getProject(this.id);
    const markup = this.dropdownMarkup();

    header.insertAdjacentHTML('afterend', markup);

    const dropdown = project.querySelector('.settings-dropdown');

    // Dropdown placement //
    dropdown.style.top = `calc(${headerHeight}px)`;

    // Close dropdown //
    dropdown.addEventListener('mouseleave', () => hideElement(dropdown));
  }
}

// getId = (el) => el.closest('.project-card').dataset.id;
// getProject = (id) => document.querySelector(`.project-card[data-id="${id}"]`);
// getTitleEl = (parent) => parent.querySelector('.project-card__title');
// getInputEl = (parent) => parent.querySelector('#project-title-input');
