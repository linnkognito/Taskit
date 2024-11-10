//////////////____________________N O T E____________________//////////////

import { helper } from '../../index';
import { TaskItem } from './taskItems';
import Quill from 'quill';
import './linkBlot';
import itemMap from './itemMap';

//////////////__________________M A R K U P__________________//////////////

import noteMarkup from '../../components/tasks/items/note.html';

//////////////_______________N O T E  C L A S S_______________//////////////

export class Note extends TaskItem {
  addClass = helper.addClass;
  hasClass = helper.hasClass;
  removeClass = helper.removeClass;
  showElement = helper.showElement;
  hideElement = helper.hideElement;
  hideAndShowEls = helper.hideAndShowEls;
  scaleUp = helper.scaleUp;
  scaleDown = helper.scaleDown;
  clear = helper.clear;

  constructor(id, task) {
    super(id, task);
    this.title = '';
    this.note = '';
    this.sortKey = 'Note';

    this.quill = null;
  }
  //////////////__________E V E N T  H A N D L E R S__________//////////////
  initQuill() {
    this.quill = this.quill = new Quill(this.editorContainer, {
      theme: null,
    });
    this.quill.on('selection-change', () => this.updateToolbar());
    this.quill.on('text-change', () => this.updateToolbar());
  }
  initListeners() {
    this.editorContainer.addEventListener('click', () => this.focusTextCursor());

    this.toolbar.addEventListener('click', (e) => this.handleToolbarClick(e));

    this.btnLink.addEventListener('mouseenter', () => this.toggleLinkIcon());

    this.noteEl.addEventListener('click', (e) => this.handleClick(e));

    let shouldSaveNote = true;
    document.addEventListener('mousedown', (e) => {
      if (this.noteEl && this.noteBody && this.editor) shouldSaveNote = !this.noteBody.contains(e.target);
    });

    this.noteBody.addEventListener(
      'focusout',
      () => {
        if (shouldSaveNote) this.saveNote();
        shouldSaveNote = true;
      },
      { once: true }
    );
  }
  handleClick(e) {
    const actionMap = {
      note__content: () => this.editNote(),
    };

    Object.keys(actionMap).forEach((cls) => {
      console.log(e.target);
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls]();
    });
  }
  handleToolbarClick(e) {
    const actionMap = {
      'btn-formatting': (btn) => this.formatText(btn),
    };

    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](el);
    });
  }
  initPopupListeners() {
    if (!this.popupLink) return;
    this.popupLink.addEventListener('click', (e) => this.handlePopupClick(e));
  }
  handlePopupClick(e) {
    const actionMap = {
      'btn-apply': () => this.formatLink(),
      'btn-cancel': () => this.hideElement(this.popupLink),
    };

    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls]();
    });
  }

  //////////////________________G E T T E R S________________//////////////
  //#region Getters
  get noteEl() {
    return document.querySelector(`.note[data-id="${this.id}"]`);
  }
  get inputTitle() {
    return this.noteEl.querySelector('.input-item-title');
  }
  get titleEl() {
    return this.noteEl.querySelector('.item-title');
  }
  get noteHeaderBtns() {
    return this.noteEl.querySelectorAll('.task-card__btn');
  }
  get noteBody() {
    return this.noteEl.querySelector('.note__body');
  }
  get editor() {
    return this.noteEl.querySelector('.ql-editor');
  }
  get editorContainer() {
    return this.noteEl.querySelector('.note__editor');
  }
  get noteContent() {
    return this.noteEl.querySelector('.note__content');
  }
  get linkInput() {
    return this.popupLink.querySelector('.popup-insert-link__input');
  }
  get toolbar() {
    return this.noteEl.querySelector('.note__formatting-buttons');
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
  //#endregion

  //////////////________________M E T H O D S________________//////////////
  renderItemMarkup() {
    // prettier-ignore
    return noteMarkup
      .replace('{%NOTE_ID%}', this.id)
      .replace('{%NOTE_TITLE%}', this.title)
      .replace('{%NOTE_CONTENT%}', this.note);
  }
  saveNote() {
    this.note = this.quill.root.textContent.trim() ? this.quill.root.innerHTML : itemMap['note'].default;

    this.clear(this.noteContent);
    this.noteContent.innerHTML = this.note;

    this.hideElement(this.toolbar);
    this.hideAndShowEls(this.editorContainer, this.noteContent);

    this.task.project.saveProjectState();
  }
  editNote() {
    this.showElement(this.toolbar);
    this.hideAndShowEls(this.noteContent, this.editorContainer);

    // Clear & populate editor
    this.clearClipboard();
    if (!this.isDefaultNote()) {
      this.quill.clipboard.dangerouslyPasteHTML(0, this.note);
    }

    this.quill.enable(true);
    this.quill.focus();
  }
  isDefaultNote() {
    return this.note === itemMap['note'].default;
  }

  //___Q U I L L_____________________________________________________//
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
      const url = current.link;
      if (url) return this.quill.format('link', false);

      // Open popup
      this.showElement(this.popupLink);
      this.linkInput.focus();

      // Positioning
      const btnRect = this.btnLink.getBoundingClientRect();
      this.popupLink.style.top = `${btnRect.bottom}px`;
      this.popupLink.style.left = `${btnRect.right}px`;

      this.initPopupListeners();
    }

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
  focusTextCursor() {
    this.quill.focus();

    // Make sure there's no selection
    const range = this.quill.getSelection();

    if (!range || range === 0) {
      const length = this.quill.getLength();
      this.quill.setSelection(length, length);
    }
  }

  //////////////________________H E L P E R S________________//////////////
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
}
