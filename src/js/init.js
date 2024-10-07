import { projects } from '../index';

window.addEventListener('load', () => {
  const header = document.querySelector('header');
  const headerHeight = header.getBoundingClientRect().height;

  projects.style.minHeight = `calc(100vh - ${headerHeight}px)`;
});
