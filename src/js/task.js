//////////////____________________T A S K____________________//////////////

import { helper } from '../index';
import { Checklist } from './task-items/checklist';
import { Note } from './task-items/note';
import itemMap from './task-items/itemMap';

//////////////__________________M A R K U P__________________//////////////

import modalDueMarkup from '../components/tasks/forms/modal-date-picker.html';
import taskMarkup from '../components/tasks/task.html';
import dropdownMarkup from '../components/menus/dropdown-sort-items.html';

//////////////__________________I M A G E S__________________//////////////

import iconBlankCb from '../../public/icons/checkbox-blank.png';
import iconCheckedCb from '../../public/icons/checkbox.png';

//////////////_______________T A S K  C L A S S_______________//////////////

export class Task {
  generateId = helper.generateId;
  checkValue = helper.checkValue;
  checkValidity = helper.checkValidity;
  insertMarkup = helper.insertMarkupAdj;
  addClass = helper.addClass;
  hasClass = helper.hasClass;
  removeAndAddCls = helper.removeAndAddCls;
  removeClass = helper.removeClass;
  hideElement = helper.hideElement;
  showElement = helper.showElement;
  hideAndShowEls = helper.hideAndShowEls;
  clear = helper.clear;
  scaleUp = helper.scaleUp;
  scaleDown = helper.scaleDown;

  hasChanges = false;

  constructor(id, project, projectEl) {
    this.id = id;
    this.project = project;
    this.projectEl = projectEl;

    this.title = '';
    this.prio = 0;
    this.description = itemMap['description'].default;
    this.dueDate = null;
    this.dueTime = null;
    this.dueDateObj = null;
    this.created = null;

    this.checked = false;
    this.sort = '';
    this.reverseSort = false;

    this.checklists = [];
    this.notes = [];
    this.items = [];
  }

  //////////////__________E V E N T  H A N D L E R S__________//////////////

  initListeners() {
    this.taskEl.addEventListener('click', this.handleClick.bind(this));

    // if (this.sortBar) this.sortBar.addEventListener

    if (this.inputTitle) {
      this.inputTitle.addEventListener('blur', () => this.saveTitle(this.inputTitle, this.titleEl));

      this.inputTitle.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        this.saveTitle(this.inputTitle, this.titleEl);
      });
    }
  }
  handleClick(e) {
    // Map button classes to methods
    const actionMap = {
      'task-header__checkbox': () => this.toggleChecked(),
      'task-header__title': () => this.editTitle(),
      'task-prio__btn': (btn) => this.setPrio(btn),
      'task-description': () => this.editDescription(),
      'task-due': (btn) => this.openDueModal(btn),
      'btn-save-task': () => this.saveTask(),
      'task-footer__btn--cancel': () => this.taskForm.remove(),
      'btn-delete-task': () => this.deleteTask(),
      'task-sort__selection': () => this.showDropdown(),
      'task-sort__swap-btn': () => this.reverseSortOrder(),

      'btn-add-checklist': (btn) => this.addItem(btn),
      'btn-delete-checklist': (btn) => this.triggerItemAction(btn, 'delete'),

      'btn-add-note': (btn) => this.addItem(btn),
      'btn-delete-note': (btn) => this.triggerItemAction(btn, 'delete'),

      'item-title': (el, cls) => this.triggerItemAction(el, 'edit', cls),
      'input-item-title': (el, cls) => this.triggerItemAction(el, 'edit', cls),
    };

    // Call the method
    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) actionMap[cls](el, cls);
    });
  }
  initDropdownListeners() {
    if (this.dropdown) {
      // Listen for sorting changes
      this.dropdown.addEventListener('click', (e) => this.handleDropdownClick(e));

      // Listen for close
      this.dropdown.addEventListener('mouseleave', () => this.dropdown.remove());
      document.addEventListener('click', (e) => {
        if (!this.dropdown || this.dropdown.contains(e.target) || this.sortSelection.contains(e.target)) return;
        this.dropdown.remove();
      });
    }
  }
  handleDropdownClick(e) {
    const actionMap = {
      'dropdown-sort-items__li': (el) => this.updateSortOrder(el),
    };

    Object.keys(actionMap).forEach((cls) => {
      const el = e.target.closest(`.${cls}`);
      if (el) {
        this.sort = el.dataset.sort;
        actionMap[cls](el);
      }
    });
  }
  triggerItemAction(el, action, cls) {
    const itemEl = el.closest('.checklist, .note');
    if (!itemEl) return;

    const itemId = itemEl.dataset.id;
    const itemType = itemEl.dataset.type;
    const item = this.findById(itemId, itemType);

    if (action === 'delete') item.deleteItem(itemEl, itemType);
    if (action === 'edit') item.activateEdit(cls, itemEl);
  }

  //////////////________________G E T T E R S________________//////////////
  //#region Getters
  get taskEl() {
    return document.querySelector(`.task[data-id="${this.id}"]`);
  }
  get taskForm() {
    return document.querySelector(`.task[data-id="${this.id}"][data-state="form"]`);
  }
  get inputTitle() {
    return this.taskEl.querySelector('.task-header__input');
  }
  get titleEl() {
    return this.taskEl.querySelector('.task-header__title');
  }
  get taskCheckbox() {
    return this.taskEl.querySelector('.task-header__checkbox, .task-header__checkbox--no-hover');
  }
  get taskHeaderBtns() {
    return this.taskEl.querySelector('.task-header__buttons');
  }
  get taskBody() {
    return this.taskEl.querySelector('.task-body');
  }
  get taskFooter() {
    return this.taskEl.querySelector('.task-footer--created');
  }

  get descInput() {
    return this.taskForm.querySelector('#description-textarea');
  }
  get descriptionEl() {
    return this.taskEl.querySelector('.task-description');
  }
  get itemsContainer() {
    return this.taskEl.querySelector('.task-items-container');
  }

  get noteForm() {
    return document.querySelector('.task-form__note');
  }
  get body() {
    return document.querySelector('body');
  }

  get btnDueDate() {
    return document.querySelector('.task-due');
  }
  get btnsAddItem() {
    return this.projectEl.querySelector('.task-add-item');
  }
  get btnsPrio() {
    return this.projectEl.querySelectorAll('.task-prio__btn');
  }
  get getDueDateElements() {
    return {
      calendarBtn: this.taskEl.querySelector('.task-due--icon'),
      dueDateEl: this.taskEl.querySelector('.task-due--text'),
      smallTextTop: this.taskEl.querySelector('.task-due__small-top'),
      bigText: this.taskEl.querySelector('.task-due__big'),
      smallTextBottom: this.taskEl.querySelector('.task-due__small-bottom'),
    };
  }

  //___D U E  D A T E________________________________________________//
  get modalDueDate() {
    return document.querySelector('.modal-due-date');
  }
  get modal() {
    return document.querySelector('.modal');
  }
  get inputDueDate() {
    return this.modal.querySelector('.input-due-date');
  }
  get inputDueTime() {
    return this.modal.querySelector('.input-due-time');
  }
  get modalBtnCancel() {
    return this.modalDueDate.querySelector('.btn-cancel');
  }

  //___S O R T_______________________________________________________//
  get sortBar() {
    return this.taskEl.querySelector('.task-sort');
  }
  get dropdown() {
    return this.taskEl ? this.taskEl.querySelector('.dropdown-sort-items') : null;
  }
  get sortSelectionText() {
    return this.taskEl.querySelector('.task-sort__selection-text');
  }
  get sortSelection() {
    return this.taskEl.querySelector('.task-sort__selection');
  }
  get btnSwapSort() {
    return this.taskEl.querySelector('.task-sort__swap-btn');
  }
  //#endregion

  //////////////________________M E T H O D S________________//////////////

  //___T A S K S_____________________________________________________//
  addItem(btn) {
    // Get type
    const itemType = btn.dataset.item;
    const item = itemMap[itemType];

    // Create item instance
    const newItem = item.createInstance(this.generateId(), this);
    item.array(this).push(newItem);

    // Render
    this.insertMarkup(this.itemsContainer, 'afterbegin', newItem.renderItemMarkup());

    // Apply animation & focus
    const itemEl = this.taskEl.querySelector(`${item.element}[data-id="${newItem.id}"]`);
    this.scaleUp(itemEl, 'top');
    itemEl.addEventListener(
      'animationend',
      () => {
        itemEl.style.opacity = '1';
      },
      { once: true }
    );

    // Focus on the title input element
    if (this.hasClass(newItem.inputTitle, 'hidden')) {
      this.hideAndShowEls(newItem.titleEl, newItem.inputTitle);
      newItem.inputTitle.focus();
    }

    // Show Sortbar (disabled in Form state)
    if (!this.taskForm) this.showElement(this.sortBar);

    // Initialize Item event listeners
    newItem.initListeners();
    if (newItem instanceof Note) newItem.initQuill();

    this.hasChanges = true;
    this.project.saveProjectState();

    // Listen for blur on inputEl
    newItem.listenForTitleSave(newItem.inputTitle, newItem.titleEl, newItem);
  }
  saveTask() {
    // Update Task card values
    this.created = new Date();
    this.title = this.inputTitle.value || 'Untitled';
    this.description = this.descInput.value.trim() || this.description;

    // Swap out markup
    this.taskForm.remove();
    this.renderTaskCard();

    // Mark changes as saved
    this.hasChanges = false;

    // Update local storage
    this.project.saveProjectState();
  }
  renderTaskCard() {
    // If Task is marked as checked
    if (this.checked) {
      this.insertMarkup(this.project.taskContainerChecked, 'afterbegin', this.populatetaskMarkup());
    }
    if (!this.checked) {
      this.insertMarkup(this.project.taskContainer, 'afterbegin', this.populatetaskMarkup());
    }
    // Apply styles
    this.applyCheckedStatusStyles();

    // If there's no description, set default + styles
    if (this.description === itemMap['description'].default) {
      this.addClass(this.descriptionEl, 'task-description--default');
    }

    // Display due date
    this.displayDueDate();

    // Display task Items (if there are any)
    if (this.checklists.length || this.notes.length) {
      this.renderItems();
      this.showElement(this.sortBar);
    }

    // Hide sortbar if there's no Task Items
    if (this.sortBar && !this.checklists.length && !this.notes.length) this.hideElement(this.sortBar);

    // Calculate and display number of completed tasks
    this.project.getCompletedTasks();

    // Apply correct styles for checked/Unchecked Tasks
    this.initListeners();
  }
  populatetaskMarkup() {
    //prettier-ignore
    return taskMarkup
      .replace('{%TASK_ID%}', this.id)
      .replace('{%TASK_TITLE%}', this.title)
      .replace('{%TASK_DESCRIPTION%}', this.description)
      .replace('{%TASK_CREATED%}', this.getCreationDateStr());
  }
  toggleChecked(checkAll = false) {
    // Prevent checkbox interaction while editing Task title
    if (this.hasClass(this.taskCheckbox, 'task-header__checkbox--no-hover')) return;

    // Toggle checked value
    if (!checkAll) this.checked = !this.checked;

    // Update checkbox attributes
    this.taskCheckbox.dataset.checked = this.checked.toString();
    this.taskCheckbox.src = this.checked ? iconCheckedCb : iconBlankCb;

    // Append checked
    if (this.checked) {
      // Move to checked container
      this.project.taskContainerChecked.appendChild(this.taskEl);
      this.taskCheckbox.setAttribute('title', 'Undo checked');
    }
    // Append unchecked
    if (!this.checked) {
      this.project.taskContainer.appendChild(this.taskEl);
      this.taskCheckbox.removeAttribute('title');
      // Put back in the same spot
      //FIX LATER Call Project method "sortTasks" or similar
      this.project.tasks.sort((a, b) => b.created - a.created);
      this.project.tasks.forEach((task) => {
        if (task.checked) return;
        this.project.taskContainer.appendChild(task.taskEl);
      });
    }

    // Apply styles
    this.applyCheckedStatusStyles();

    // Persist to local storage
    this.project.saveProjectState();
  }
  deleteTask() {
    this.project.tasks = this.project.tasks.filter((t) => t.id !== this.id);
    this.taskEl.remove();

    // Update state
    this.project.saveProjectState();
  }

  //___T A S K S :  H E L P E R S____________________________________//
  applyCheckedStatusStyles() {
    this.taskCheckbox.src = this.checked ? iconCheckedCb : iconBlankCb;

    if (this.checked) {
      this.hideElement(this.taskBody);
      this.hideElement(this.taskFooter);
      this.hideElement(this.taskHeaderBtns);
      this.addClass(this.taskEl, 'low-opacity');
    }

    if (!this.checked) {
      this.showElement(this.taskBody);
      this.showElement(this.taskFooter);
      this.showElement(this.taskHeaderBtns);
      this.removeClass(this.taskEl, 'low-opacity');
    }
  }
  isChecked(task) {
    this.checked = true;
    this.project.moveChecked(task);
  }

  //___T I T L E_____________________________________________________//
  editTitle() {
    this.hideAndShowEls(this.titleEl, this.inputTitle);

    if (this.taskCheckbox) {
      this.removeAndAddCls(this.taskCheckbox, 'task-header__checkbox', 'task-header__checkbox--no-hover');
      this.addClass(this.taskCheckbox, 'low-opacity');
    }

    // Listen for blur on inputEl
    this.inputTitle.focus();
    this.inputTitle.addEventListener('blur', () => this.saveTitle(this.inputTitle, this.titleEl), { once: true });
  }
  saveTitle(inputEl, titleEl) {
    // Save input data
    this.title = inputEl.value.trim() || 'Untitled';

    // Hide input and show title element
    this.hideAndShowEls(inputEl, titleEl);

    if (this.taskCheckbox) {
      this.removeAndAddCls(this.taskCheckbox, 'task-header__checkbox--no-hover', 'task-header__checkbox');
      this.removeClass(this.taskCheckbox, 'low-opacity');
    }

    // Populate fields
    titleEl.textContent = this.title;
    inputEl.placeholder = this.title;
    inputEl.value = this.title;

    // Update local storage
    this.project.saveProjectState();
  }

  //___D E S C R I P T I O N_________________________________________//
  editDescription() {}
  //___P R I O_______________________________________________________//
  setPrio(btn) {
    // Remove active style for all Prio buttons
    this.btnsPrio.forEach((btnEl) => {
      this.removeClass(btnEl, `prio${btnEl.dataset.prio}-color-profile`);
    });

    this.prio = btn.dataset.prio;
    this.addClass(btn, `prio${this.prio}-color-profile`);
    this.setPrioColors(this.prio);

    this.hasChanges = true;

    // Update local storage
    this.project.saveProjectState();
  }
  setPrioColors() {
    // PLACEHOLDER
  }

  //___D U E  D A T E________________________________________________//
  openDueModal() {
    // Avoid rendering duplicate modals
    if (this.modalDueDate) this.modalDueDate.remove();

    // Render modal
    this.insertMarkup(this.body, 'afterbegin', modalDueMarkup);

    // If user previously entered values → populate input fields
    if (this.dueDateObj) {
      this.inputDueDate.value = this.dueDate;
      this.inputDueTime.value = this.dueTime;
    }

    this.initDueModalListeners();
  }
  initDueModalListeners() {
    this.modal.addEventListener('click', this.handleModalClick.bind(this));
  }
  handleModalClick(e) {
    const actionMap = {
      'modal-due-date': () => this.modal.remove(),
      'btn-cancel': () => this.modal.remove(),
      'btn-save': () => this.saveDueDate(),
      clear: (e) => this.clearDueDateInput(e),
    };

    Object.keys(actionMap).forEach((cls) => {
      if (this.hasClass(e.target, cls)) {
        actionMap[cls](e);
      }
    });
  }
  saveDueDate() {
    // For readability
    const inputDate = this.inputDueDate.value;
    const inputTime = this.inputDueTime.value;

    // Saving cleared input elements (reset)
    if (!inputDate && !inputTime) {
      this.setDueDateToNull();
      this.modal.remove();
      this.displayDueDate();
      return;
    }

    // Set due date
    this.dueDate = inputDate ? new Date(this.parseDate(inputDate)) : new Date();
    this.dueTime = inputTime || new Date().toTimeString().slice(0, 5);
    this.dueDateObj = this.getFullDate(this.dueDate);

    // Make sure the selection is in the future
    const inThePast = this.dueDate.getTime() <= new Date().getTime();
    if (inThePast) {
      alert('❗ The selected date and/or time must be in the future');
      this.setDueDateToNull();
      this.inputDueDate.value = '';
      this.inputDueTime.value = '';
      return;
    }

    // Format dueDate
    this.dueDate = this.formatDueDate();

    // Handle DOM elements
    this.modal.remove();
    this.displayDueDate();

    this.hasChanges = true;

    // Update local storage
    this.project.saveProjectState();
  }
  displayDueDate() {
    const { calendarBtn, dueDateEl } = this.getDueDateElements;

    if (!this.dueDateObj) return this.hideAndShowEls(dueDateEl, calendarBtn);
    if (calendarBtn) this.hideAndShowEls(calendarBtn, dueDateEl);

    const diff = this.calcTimeDiff(new Date(this.dueDateObj));
    this.updateDueDateDisplay(diff);

    dueDateEl.addEventListener('click', () => this.openDueModal());
  }

  //___D U E  D A T E :  H E L P E R S_______________________________//
  clearDueDateInput(e) {
    // Clear input element
    const input = e.target.closest('.btn-clear').previousElementSibling;
    input.value = '';

    // Update property
    input.classList.contains('input-due-date') ? (this.dueDate = null) : (this.dueTime = null);
  }
  setDueDateToNull() {
    this.dueDate = null;
    this.dueTime = null;
    this.dueDateObj = null;
  }
  parseDate(date) {
    const [y, m, d] = date.split('-');
    return new Date(y, m - 1, d);
  }
  formatDueDate() {
    return `${this.dueDate.getFullYear()}-${this.dueDate.getMonth() + 1}-${this.dueDate.getDate()}`;
  }
  getFullDate(date) {
    const [h, m] = this.dueTime.split(':');
    date.setHours(h);
    date.setMinutes(m);
    return date;
  }
  calcTimeDiff(date) {
    const diffMs = date.getTime() - new Date().getTime();

    const calcYear = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    const years = calcYear >= 0.9 ? Math.ceil(calcYear) : Math.floor(calcYear);
    let remaining = diffMs % (1000 * 60 * 60 * 24 * 365.25);

    const days = Math.round(remaining / (1000 * 60 * 60 * 24));
    remaining = remaining % (1000 * 60 * 60 * 24);

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    remaining = remaining % (1000 * 60 * 60);

    const mins = Math.floor(remaining / (1000 * 60));
    remaining = remaining % (1000 * 60);

    return { years, days, hours, mins };
  }
  updateDueDateDisplay(diff) {
    // Get elements
    const { smallTextTop, bigText, smallTextBottom } = this.getDueDateElements;

    // Clear contents
    [smallTextTop, bigText, smallTextBottom].forEach((el) => {
      this.clear(el);
    });

    const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Populate elements
    if (!diff.years && !diff.days && diff.hours && !diff.mins) {
      bigText.textContent = diff.hours;
      smallTextBottom.textContent = diff.hours === 1 ? 'hour' : 'hours';
      return;
    }
    if (!diff.years && !diff.days && diff.hours && diff.mins) {
      bigText.textContent = `${diff.hours} h`;
      smallTextBottom.textContent = `${diff.mins} ${diff.mins === 1 ? 'min' : 'mins'}`;
      return;
    }
    if (!diff.years && !diff.days && !diff.hours) {
      bigText.textContent = Math.ceil(diff.mins);
      smallTextBottom.textContent = Math.ceil(diff.mins) === 1 ? 'min' : 'mins';
      return;
    }
    if (diff.days || diff.years) {
      smallTextTop.textContent = `${monthsArr[this.dueDateObj.getMonth()].slice(0, 3)}`;
      bigText.textContent = `${this.dueDateObj.getDate()}`;
      smallTextBottom.textContent = `${this.dueDateObj.getFullYear()}`;
      return;
    }
  }

  //___T A S K S :  H E L P E R S____________________________________//
  getCreationDateStr = () => {
    const d = this.formatCreationDate();
    const t = this.toAmPm(this.created);

    return `${d}, ${t}`;
  };
  formatCreationDate() {
    const y = this.created.getFullYear();
    const m = String(this.created.getMonth() + 1).padStart(2, 0);
    const d = String(this.created.getDate()).padStart(2, 0);

    return `${m}/${d}/${y}`;
  }
  toAmPm(date) {
    const time = date.toTimeString().slice(0, 5);
    const [h24, min] = time.split(':');
    const h12 = h24 % 12 || 12;
    const per = h24 >= 12 ? 'PM' : 'AM';

    return `${h12}:${min} ${per}`;
  }

  //___I T E M S______________________________________________________//
  renderItems() {
    // Make sure Sort Dropdown isn't shown when reloading/rendering the page
    if (this.dropdown) this.dropdown.remove();

    let markup = '';
    this.items = [...this.checklists, ...this.notes];

    // Sort items
    this.sortTaskItems();
    this.clear(this.itemsContainer);

    // Show Sortbar if there's >1 item
    this.items.length >= 1 ? this.showElement(this.sortBar) : this.hideElement(this.sortBar);

    // Render items
    this.items.forEach((item) => (markup += item.renderItemMarkup()));
    this.insertMarkup(this.itemsContainer, 'afterbegin', markup);

    this.items.forEach((item) => {
      if (!this.hasClass(item.inputTitle, 'hidden')) {
        this.hideAndShowEls(item.inputTitle, item.titleEl);
      }
      item.initListeners();
    });

    // If Checklists: initialize list item listeners
    if (this.checklists.length) {
      this.checklists.forEach((cl) => {
        if (cl.items.length)
          cl.items.forEach((li) => {
            li.initListeners();
          });
      });
    }

    // If Notes: initialize Quill
    if (this.notes.length) {
      this.notes.forEach((note) => note.initQuill());
    }
  }
  findById(id, type) {
    return this[`${type}s`].find((item) => item.id === id);
  }
  removeItemById(id, item) {
    // Filters out item from array
    this[`${item}s`] = this[`${item}s`].filter((item) => item.id !== id);
  }

  //___I T E M S :  S O R T___________________________________________//
  updateSortOrder(sel) {
    // Update sort property
    this.sort = sel.dataset.sort;
    this.sortSelectionText.textContent = this.sort;

    // Re-render items
    this.renderItems();
  }
  sortTaskItems() {
    // Sort: Creation date
    if (this.sort === 'Creation date') {
      this.items.sort((a, b) => b.created.getTime() - a.created.getTime());
    }
    // Sort: Alphabetical
    if (this.sort === 'Alphabetically') {
      this.items.sort((a, b) => a.title.localeCompare(b.title));
    }
    // Sort: Item type
    if (this.sort === 'Item type') {
      this.items.sort((a, b) => {
        // If same Class name, use creation date as fallback
        a.sortKey.localeCompare(b.sortKey) || b.created.getTime() - a.created.getTime();
      });
    }

    // Check if reverse
    if (this.reverseSort) this.items.reverse();
  }
  reverseSortOrder() {
    this.reverseSort = !this.reverseSort;
    this.renderItems();
  }
  showDropdown() {
    // Avoid duplicate dropdown elements
    if (this.dropdown) return this.dropdown.remove();

    // Insert & position dropdown
    this.insertMarkup(this.sortBar, 'beforeend', dropdownMarkup);
    this.positionDropdown();
    this.scaleUp(this.dropdown, 'top');
    this.dropdown.addEventListener(
      'animationend',
      () => {
        this.dropdown.style.opacity = '1';
      },
      { once: true }
    );

    this.initDropdownListeners();
  }
  positionDropdown() {
    const parentRect = this.sortBar.getBoundingClientRect();
    const btnRect = this.sortSelection.getBoundingClientRect();

    this.dropdown.style.top = `${parentRect.height}px`;
    this.dropdown.style.right = `${parentRect.right - btnRect.right}px`;
  }
  animateRemove() {
    this.scaleDown(this.dropdown, 'top');
    this.dropdown.addEventListener('animationend', () => this.dropdown.remove(), { once: true });
  }
}
