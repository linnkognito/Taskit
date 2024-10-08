import { App } from '../index';

window.addEventListener('load', () => {
  const app = new App();

  const header = document.querySelector('header');
  const headerHeight = header.getBoundingClientRect().height;
  app.projects.style.minHeight = `calc(100vh - ${headerHeight}px)`;
});
