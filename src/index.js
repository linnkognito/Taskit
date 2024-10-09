import './css/styles.css';
import { App } from './js/app';

let app;

window.addEventListener('load', () => {
  app = new App();

  const header = document.querySelector('header');
  const headerHeight = header.getBoundingClientRect().height;
  app.projects.style.minHeight = `calc(100vh - ${headerHeight}px)`;
});

export { app };
