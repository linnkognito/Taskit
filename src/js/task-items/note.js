import Quill from 'quill';
import './linkBlot';

export class Note {
  toolbar = document.querySelector('.note-body__formatting-buttons');
  buttons = this.toolbar.querySelectorAll('.btn-formatting');

  constructor(id, task) {
    this.id = id;
    this.title = `Note #${this.id}`;
    this.task = task;

    // QUILL //
    this.quill = new Quill(this.noteEl.querySelector('.task-form__note-editor'), {
      theme: null,
    });
    this.quill.on('selection-change', () => this.updateToolbar());

    // EVENT LISTENERS //
    this.toolbar.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-formatting');
      if (!btn) return;
      this.formatText(btn);
    });
  }

  get noteEl() {
    return document.querySelector(`.task-form__note[data-id="${this.id}"]`);
  }

  toggleFormatBtn(btn, bool) {
    return btn.classList.toggle('btn-formatting--active', bool);
  }

  formatLink() {
    const url = prompt('Enter the link URL:');
    if (url) this.quill.format('link', url);
  }

  resetToolbar() {
    this.buttons.forEach((btn) => {
      if (btn.classList.contains('btn-formatting--active')) btn.classList.remove('btn-formatting--active');
    });
  }

  getFormatType(btn) {
    const cls = [...btn.classList].find((cls) => cls.startsWith('btn-') && cls !== 'btn-formatting');

    return cls.split('-')[1];
  }

  formatText(btn) {
    // Get formatting name from button class
    const type = this.getFormatType(btn);

    // Link formatting
    if (type === 'link') return this.formatLink(btn);

    // Get selection
    const selection = this.quill.getSelection();
    if (!selection) return;

    // Get current formatting
    const current = this.quill.getFormat(selection);
    const isApplied = current[type];

    // Text formatting
    this.quill.format(type, !isApplied);
    this.toggleFormatBtn(btn, !isApplied);
  }

  updateToolbar() {
    const selection = this.quill.getSelection();
    if (!selection) return this.resetToolbar();

    const current = this.quill.getFormat(selection);

    this.buttons.forEach((btn) => {
      const type = this.getFormatType(btn);
      const isApplied = current[type];

      this.toggleFormatBtn(btn, !!isApplied);
    });
  }
}
