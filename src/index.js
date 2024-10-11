import './css/animations/animations.css';
import './css/assets/fonts.css';
import './css/projects/project.css';
import './css/projects/add-project.css';
import './css/vars.css';
import './css/styles.css';
import './css/tasks/task-card.css';
import './css/tasks/task-form.css';
import './css/tasks/task-checklist.css';
import './css/tasks/task-note.css';
import { App } from './js/app';

let app;

window.addEventListener('load', () => {
  app = new App();

  const header = document.querySelector('header');
  const headerHeight = header.getBoundingClientRect().height;
  app.projects.style.minHeight = `calc(100vh - ${headerHeight}px)`;
});

export { app };
