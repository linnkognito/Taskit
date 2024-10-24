// index.js

import './css/animations/animations.css';
import './css/assets/fonts.css';
import './css/projects/project.css';
import './css/projects/add-project.css';
import './css/utilities/vars.css';
import './css/utilities/color-profiles.css';
import './css/tasks/task-card.css';
import './css/tasks/task-form.css';
import './css/tasks/task-checklist.css';
import './css/tasks/task-note.css';
import './css/modals/modal-due.css';
import './css/styles.css';

//////////////////////////////////////////////////

import { App } from './js/app';
import { Helper } from './js/helpers';
let app;
let helper;

window.addEventListener('load', () => {
  app = new App();
  helper = new Helper();

  const header = document.querySelector('header');
  const headerHeight = header.getBoundingClientRect().height;
  app.projects.style.minHeight = `calc(100vh - ${headerHeight}px)`;
});

export { app, helper };
