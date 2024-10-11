import { app } from '../index';
import { showElement, hideElement, containsClass } from './helpers';

export class Project {
  constructor(title, id) {
    this.title = title;
    this.id = id;
  }

  //-- HELPERS ----------------------------------------------//
  //-- MARKUP -----------------------------------------------//
  settingsMarkup() {
    return `
    <div class="settings-dropdown">
      <div class="settings-dropdown__li">Edit title</div>
      <div class="settings-dropdown__li">Clone project</div>
      <div class="settings-dropdown__li">Mark all task complete</div>
      <div class="settings-dropdown__li">Delete expired tasks</div>
      <div class="settings-dropdown__li">Delete project</div>
    </div>
    `;
  }
  sortMarkup() {
    return `
      <div class='dropdown-project sort-dropdown'>
        <div class='dropdown-project__li sort-dropdown__li'>
          <img src='./public/icons/sort-prio.png' alt='Prio icon' class='icon-dropdown icon-swap' />
          <span>Priority</span>
        </div>
        <div class='dropdown-project__li sort-dropdown__li'>
          <img src='./public/icons/sort-due-date.png' alt='Due icon' class='icon-dropdown icon-due' />
          <span>Due date</span>
        </div>
        <div class='dropdown-project__li sort-dropdown__li'>
          <img src='./public/icons/sort-alpha.png' alt='Sort alphabetically icon' class='icon-dropdown icon-alpha' />
          <span>Alphabetically</span>
        </div>
        <div class='dropdown-project__li sort-dropdown__li'>
          <img src='./public/icons/sort-created.png' alt='Created icon' class='icon-dropdown icon-created' />
          <span>Created</span>
        </div>
      </div>;
            `;
  }

  //-- SETTINGS ---------------------------------------------//
  openSettings(btn) {
    const header = app.getHeaderEl(btn);
    const headerHeight = header.getBoundingClientRect().height;
    const project = app.getProject(this.id);
    let markup;
    let dropdown;

    if (btn.classList.contains('btn-settings')) {
      markup = this.settingsMarkup();
      header.insertAdjacentHTML('afterend', markup);
      dropdown = project.querySelector('.settings-dropdown');
      console.log(dropdown);
    }
    if (btn.classList.contains('btn-sort-tasks')) {
      markup = this.sortMarkup();
      header.insertAdjacentHTML('afterend', markup);
      dropdown = project.querySelector('.sort-dropdown');
      console.log(dropdown);
    }
    dropdown.style.top = `calc(${headerHeight}px)`; // Dropdown placement

    dropdown.addEventListener('mouseleave', () => hideElement(dropdown)); // Close dropdown

    /*
    const dropdown = project.querySelector('.settings-dropdown');
    dropdown.style.top = `calc(${headerHeight}px)`; // Dropdown placement
    dropdown.addEventListener('mouseleave', () => hideElement(dropdown)); // Close dropdown
    */
  }

  //-- EFFECTS ---------------------------------------------//
  swapIcon(btn) {
    const header = app.getHeaderEl(btn);
    const headerHeight = header.getBoundingClientRect().height;
  }
}

// getId = (el) => el.closest('.project-card').dataset.id;
// getProject = (id) => document.querySelector(`.project-card[data-id="${id}"]`);
// getTitleEl = (parent) => parent.querySelector('.project-card__title');
// getInputEl = (parent) => parent.querySelector('#project-title-input');
