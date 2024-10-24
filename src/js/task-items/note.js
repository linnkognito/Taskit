import Quill from 'quill';
import './linkBlot';

import { helper } from '../../index';
import noteMarkup from '../../components/tasks/items/note.html';

export class Note {
  hideElement = helper.hideElement;
  showElement = helper.showElement;
  hideAndShowEls = helper.hideAndShowEls;
  hasClass = helper.hasClass;

  constructor(id, task) {
    this.id = id;
    this.title = `Note #${this.id}`;
    this.task = task;
    this.note = '';
    this.created = new Date();
    this.sort = 'created';
    this.editAllMode = false;

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
      if (cancel) return this.hideElement(this.popupLink);
    });
    document.addEventListener('focusout', (e) => {
      if (this.editAllMode) return;

      const input = e.target.closest('.title-input');
      const note = e.target.closest('.ql-editor');

      if (input) return this.saveTitle(e.target);
      if (note) return this.saveNote(e.target);
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
  get toolbar() {
    return document.querySelector('.note-body__formatting-buttons');
  }
  get buttons() {
    return this.toolbar.querySelectorAll('.btn-formatting');
  }
  get popupLink() {
    return document.querySelector('.popup-insert-link');
  }
  get btnLink() {
    return document.querySelector('.btn-link');
  }

  // EVENT LISTENERS //
  activateListeners() {
    // HEADER BTNS CLICKED
    this.noteEl.addEventListener('click', (e) => {
      // ENTER EDIT ALL MODE
      if (e.target.closest('.btn-edit-note')) {
        this.editAllMode = true;
        this.toggleEditModeBtns(this.noteEl, '.task-card__btn');
        this.editAll([
          { el: this.noteTitle, type: 'title' },
          { el: this.noteContent, type: 'note' },
        ]);
      }

      // SAVE & EXIT EDIT ALL MODE
      if (e.target.closest('.btn-save-edits')) {
        this.saveTitle(this.noteInputTitle);
        this.saveNote(this.editor);
        this.editAllMode = false;
        this.toggleEditModeBtns(this.noteEl, '.task-card__btn');
      }

      // CANCEL EDIT ALL MODE
      if (e.target.closest('.btn-cancel-edits')) {
        const userConfirmed = confirm('Cancel editing? All unsaved changes will be lost.');
        if (userConfirmed) {
          this.editAllMode = false;
          this.toggleEditModeBtns(this.noteEl, '.task-card__btn');
          this.hideAndShowEls(this.noteInputTitle, this.noteTitle);
          this.hideAndShowEls(this.editorContainer, this.noteContent);
          this.hideElement(this.toolbar);
        }
      }

      // DELETE NOTE
      if (e.target.closest('.btn-delete-note')) {
        this.deleteNote();
      }
    });

    // EDIT SINGLE ELEMENT
    this.noteEl.addEventListener('click', (e) => {
      // TITLE CLICKED
      if (e.target.closest('.title')) return this.editElement(e.target, 'title');

      // NOTE CLICKED
      if (e.target.closest('.task-card__note-content')) return this.editElement(e.target.closest('.task-card__note-content'), 'note');
    });
  }

  // HELPERS //
  toggleFormatBtn(btn, bool) {
    return btn.classList.toggle('btn-formatting--active', bool);
  }
  toggleEditModeBtns(parent, cls) {
    const buttons = parent.querySelectorAll(cls);

    if (this.editAllMode) {
      buttons.forEach((btn) => (this.hasClass(btn, 'edit-all-mode') ? this.showElement(btn) : this.hideElement(btn)));
    }
    if (!this.editAllMode) {
      buttons.forEach((btn) => (this.hasClass(btn, 'edit-all-mode') ? this.hideElement(btn) : this.showElement(btn)));
    }
  }
  isLink() {
    const selection = this.quill.getSelection();
    return selection ? !!this.quill.getFormat(selection).link : false;
  }
  clearClipboard() {
    this.quill.root.innerHTML = '';
  }

  // METHODS //
  editAll(elements) {
    elements.forEach((el) => {
      this.editElement(el.el, el.type);
    });
  }

  editElement(el, type) {
    let input = el.nextElementSibling;
    this.hideAndShowEls(el, input);

    if (type === 'note') {
      this.showElement(this.toolbar);

      // Reinitialize Quill
      this.quill = new Quill(this.noteEl.querySelector('.task-form__note-editor'), {
        theme: null,
      });

      // Clear & populate editor
      this.clearClipboard();
      this.quill.clipboard.dangerouslyPasteHTML(0, this.note);
    }

    if (type === 'title') {
      input.value = this.title;
    }

    input.focus();
  }

  deleteNote() {
    this.task.removeItemById(this.id);
    this.noteEl.remove();
  }

  renderNote() {
    // prettier-ignore
    return noteMarkup
      .replace('{%NOTE_ID%}', this.id)
      .replace('{%NOTE_TITLE%}', this.title)
      .replace('{%NOTE_CONTENT%}', this.note);
  }

  saveNote(noteInput) {
    // Grab note value
    const content = this.quill.root.innerHTML;

    // Update note property to new value
    this.note = content;

    // Insert new value
    if (this.noteContent) this.noteContent.innerHTML = this.note;

    //if (e.target.closest('.task-card__note')) {
    if (noteInput.closest('.task-card__note')) {
      this.hideElement(this.toolbar);
      this.hideAndShowEls(this.editor, this.noteContent);
    }
  }

  saveTitle(title) {
    // Set title
    title.value.trim() ? (this.title = title.value) : this.title;

    // Add placeholder & value
    title.placeholder = this.title || 'Add title';
    title.value = this.title;

    // If form, return
    if (title.closest('.task-form__note')) return;

    // If card, update title text
    if (title.closest('.task-card__note')) {
      this.hideAndShowEls(this.titleInput, this.noteTitle);
      this.noteTitle.textContent = this.title;
    }
  }

  formatLink() {
    const input = this.popupLink.querySelector('.popup-insert-link__input');
    const url = input.value;

    if (!input.checkValidity()) return input.reportValidity();

    if (url) this.quill.format('link', url);

    this.hideElement(this.popupLink);
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
    this.hideAndShowEls(link, linkOff);

    // Reset on mouseleave
    this.btnLink.addEventListener('mouseleave', () => {
      this.hideAndShowEls(linkOff, link);
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
      this.showElement(this.popupLink);
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
