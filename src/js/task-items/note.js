import Quill from 'quill';
import './linkBlot';

import { helper } from '../../index';
import noteMarkup from '../../components/tasks/items/note.html';

export class Note {
  toolbar = document.querySelector('.note-body__formatting-buttons');
  buttons = this.toolbar.querySelectorAll('.btn-formatting');
  popupLink = document.querySelector('.popup-insert-link');
  btnLink = document.querySelector('.btn-link');
  //titleInput = document.querySelector('.task-form__note-input-title');
  titleEl = document.querySelector('.task-form__note-title');

  constructor(id, task) {
    this.id = id;
    this.title = '';
    this.note = '';
    this.task = task;
    this.created = new Date();
    this.sort = 'created';

    // QUILL //
    this.quill = new Quill(this.noteEl.querySelector('.task-form__note-editor'), {
      theme: null,
    });
    this.quill.on('selection-change', () => {
      this.updateToolbar();
    });
    this.quill.on('text-change', () => {
      this.updateToolbar();
    });

    // EVENT LISTENERS //
    this.btnLink.addEventListener('mouseenter', () => {
      this.toggleLinkIcon();
    });
    this.toolbar.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-formatting');
      if (!btn) return;
      this.formatText(btn);
    });
    this.popupLink.addEventListener('click', (e) => {
      const apply = e.target.closest('.btn-apply');
      const cancel = e.target.closest('.btn-cancel');
      if (!apply && !cancel) return;

      if (apply) return this.formatLink();
      if (cancel) return helper.hideElement(this.popupLink);
    });
    document.addEventListener('focusout', (e) => {
      const input = e.target.closest('.title-input');

      if (input) return this.saveTitle(e);
    });
    this.editor.addEventListener('blur', (e) => {
      this.saveNote(e);
    });
    this.editorContainer.addEventListener('click', () => this.editor.focus());
  }

  // GETTERS //
  get noteEl() {
    return document.querySelector(`.task-form__note[data-id="${this.id}"], .task-card__note[data-id="${this.id}"]`);
  }
  get noteTitle() {
    return this.noteEl.querySelector('.task-card__note-title');
  }
  get noteInputTitle() {
    return this.noteEl.querySelector('.task-card__note-input-title');
  }
  get titleInput() {
    return this.noteEl.querySelector('.title-input');
  }
  get noteHeaderBtns() {
    return this.noteEl.querySelectorAll('.task-card__btn');
  }
  get editor() {
    return this.noteEl.querySelector('.ql-editor');
    // return document.querySelector('.ql-editor');
  }
  get editorContainer() {
    return document.querySelector('.task-form__note-editor');
  }
  get noteContent() {
    return this.noteEl.querySelector('.task-card__note-content');
  }
  get linkInput() {
    return this.popupLink.querySelector('.popup-insert-link__input');
  }

  // EVENT LISTENERS //
  activateListeners() {
    this.noteEl.addEventListener('click', (e) => {
      if (e.target.closest('.btn-edit')) this.editNote();
      if (e.target.closest('.btn-del')) this.deleteNote();
    });
    this.noteEl.addEventListener('click', (e) => {
      if (e.target.closest('.title')) this.editElement(e.target, 'title');
    });
  }

  // HELPERS //
  toggleFormatBtn(btn, bool) {
    return btn.classList.toggle('btn-formatting--active', bool);
  }
  isLink() {
    const selection = this.quill.getSelection();
    return selection ? !!this.quill.getFormat(selection).link : false;
  }

  // METHODS //
  editElement(el, type) {
    if (type === 'title') {
      const title = el;
      const input = title.nextElementSibling;
      helper.hideAndShowEls(title, input);
      input.value = this.title;
      input.focus();
    }
  }

  deleteNote() {
    return console.log(`delete note`);
  }

  renderNote() {
    // prettier-ignore
    return noteMarkup
      .replace('{%NOTE_ID%}', this.id)
      .replace('{%NOTE_TITLE%}', this.title)
      .replace('{%NOTE_CONTENT%}', this.note);
  }

  saveNote(e) {
    let editor = e.target;

    editor.innerHTML ? (this.note = editor.innerHTML) : this.note;
  }

  saveTitle(e) {
    let title = e.target;

    // Set title
    title.value ? (this.title = title.value) : this.title;
    console.log(this.title);

    // Add placeholder & value
    title.placeholder = this.title || 'Add title';
    title.value = this.title;

    // If form, return
    if (title.closest('.task-form__note')) return;

    // If card, update title text
    if (title.closest('.task-card__note')) {
      helper.hideAndShowEls(this.titleInput, this.noteTitle);
      this.noteTitle.textContent = this.title;
    }
  }

  formatLink() {
    const input = this.popupLink.querySelector('.popup-insert-link__input');
    const url = input.value;

    if (!input.checkValidity()) return input.reportValidity();

    if (url) this.quill.format('link', url);

    helper.hideElement(this.popupLink);
    input.value = '';
    this.updateToolbar();
  }

  toggleLinkIcon() {
    // No selection || Selection is not a link
    const selection = this.quill.getSelection();
    if (!selection || !this.isLink()) return;

    // Icon elements
    const link = this.btnLink.querySelector('.btn-link-icon');
    const linkOff = this.btnLink.querySelector('.btn-link-off-icon');

    // If there's a selection and it is a link
    helper.hideAndShowEls(link, linkOff);

    // Reset on mouseleave
    this.btnLink.addEventListener('mouseleave', () => {
      helper.hideAndShowEls(linkOff, link);
    });

    this.updateToolbar();
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
    // Get selection
    const selection = this.quill.getSelection();
    if (!selection) return;

    // Get formatting name from button class
    const type = this.getFormatType(btn);

    // Get current formatting
    const current = this.quill.getFormat(selection);
    const isApplied = current[type];

    // Link formatting
    if (type === 'link') {
      // Toggle off if link already exists
      const url = current.link;
      if (url) return this.quill.format('link', false);

      // Open popup
      helper.showElement(this.popupLink);
      //const input = this.popupLink.querySelector('.popup-insert-link__input');
      this.linkInput.focus();
      return;
    }

    // Text formatting
    this.quill.format(type, !isApplied);
    this.toggleFormatBtn(btn, !isApplied);
  }

  updateToolbar() {
    const selection = this.quill.getSelection();
    if (!selection) return this.resetToolbar();

    const current = this.quill.getFormat(selection);

    // Highlight the correct formatting buttons
    this.buttons.forEach((btn) => {
      const type = this.getFormatType(btn);
      const isApplied = current[type];

      this.toggleFormatBtn(btn, !!isApplied);
    });
  }
}
