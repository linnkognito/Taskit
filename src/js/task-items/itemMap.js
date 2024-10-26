// itemMap.js
import checklistFormMarkup from '../../components/tasks/items/checklist-form.html';
import noteFormMarkup from '../../components/tasks/items/note-form.html';
import { Checklist } from './checklist';
import { Note } from './note';

const itemMap = {
  checklist: {
    type: 'checklist',
    markup: checklistFormMarkup,
    createInstance: (id, context) => new Checklist(id, context),
    formEl: (context) => context.checklistForm,
    array: (context) => context.checklists,
  },
  note: {
    type: 'note',
    markup: noteFormMarkup,
    createInstance: (id, context) => new Note(id, context),
    formEl: (context) => context.noteForm,
    array: (context) => context.notes,
  },
};

export default itemMap;

// const itemMap = {
//   checklist: {
//     markup: this.getPopulatedMarkup(checklistFormMarkup, 'checklist', id),
//     createInstance: () => new Checklist(id, this),
//     formEl: this.checklistForm,
//     array: this.checklists,
//   },
//   note: {
//     markup: this.getPopulatedMarkup(noteFormMarkup, 'note', id),
//     createInstance: () => new Note(id, this),
//     formEl: this.noteForm,
//     array: this.notes,
//   },
// };
