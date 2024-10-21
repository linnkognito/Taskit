import { app, helper } from '../../index';

import listItem from '../../components/tasks/items/checklist-item.html';

export class Checklist {
  checklist = document.querySelector('.task-form__checklist');
  addItem = document.querySelector('.btn-add');

  constructor(id, task) {
    this.id = id;
    this.task = task;
    this.title = `Checklist ${this.id}`;
    this.checked = false;

    this.items = [];

    // document.addEventListener('click', (e) => {
    //   const listItem = e.target.closest('.task-form__checklist-item');
    //   if (!listItem) return;
    //   listItem.classList.add('checklist-item--hover');
    // });

    // ADD LIST ITEM
    this.checklist.addEventListener('click', (e) => {
      const btnAdd = e.target.closest('.btn-add');

      if (btnAdd) return this.addListItem();
    });
  }

  addListItem() {
    const list = this.checklist.querySelector('.task-form__checklist-body');

    const itemId = this.items.length + 1;
    listItem.replace('{%CHECKLIST_ID%}', itemId);
    helper.insertMarkupAdj(list, 'afterbegin', listItem);

    const newListItem = new ListItem(this.items.length + 1, this);

    const item = list.querySelector('.task-form__checklist-item');
    item.dataset.id = newListItem.id;
  }
}

class ListItem {
  constructor(id, checklist) {
    this.id = id;
    this.value = '';
    this.checked = false;
    this.checklist = checklist;
  }

  checkedItem() {
    this.checked = true;
  }
}
