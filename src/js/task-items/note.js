import Quill from 'quill';
import './linkBlot';

import { helper } from '../../index';

export class Note {
  toolbar = document.querySelector('.note-body__formatting-buttons');
  buttons = this.toolbar.querySelectorAll('.btn-formatting');
  popupLink = document.querySelector('.popup-insert-link');
  btnLink = document.querySelector('.btn-link');

  constructor(id, task) {
    this.id = id;
    this.title = `Note #${this.id}`;
    this.task = task;

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
  }

  // GETTERS //
  get noteEl() {
    return document.querySelector(`.task-form__note[data-id="${this.id}"]`);
  }
  get linkInput() {
    return this.popupLink.querySelector('.popup-insert-link__input');
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
