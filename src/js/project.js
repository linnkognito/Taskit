export class Project {
  btnSettings = document.querySelectorAll('.btn-settings');

  constructor(title, id) {
    this.title = title;
    this.id = id;

    this.btnSettings.forEach((btn) =>
      btn.addEventListener('click', (e) => {
        console.log('btn clicked');
        this.openSettings(e);
      })
    );
  }

  //-- HELPERS ----------------------------------------------//
  //-- SETTINGS ---------------------------------------------//
  openSettings(e) {
    const btn = e.target;
    const projectId = btn.closest('.project-card').dataset.id;
    const header = btn.closest('.project-card__header');

    const markup = `
    <div class="project-card__settings-dropdown">Hello</div>
    `;

    header.insertAdjacentHTML('afterend', markup);
  }
}
