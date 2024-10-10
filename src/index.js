import './css/animations.css';
import './css/fonts.css';
import './css/project.css';
import './css/add-project.css';
import './css/vars.css';
import './css/styles.css';
import './css/task-card.css';
import './css/task-form.css';
import './css/task-checklist.css';
import './css/task-note.css';
import { App } from './js/app';

let app;

window.addEventListener('load', () => {
  app = new App();

  const header = document.querySelector('header');
  const headerHeight = header.getBoundingClientRect().height;
  app.projects.style.minHeight = `calc(100vh - ${headerHeight}px)`;
});

export { app };
