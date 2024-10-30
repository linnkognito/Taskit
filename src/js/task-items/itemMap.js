// itemMap.js
import checklistMarkup from '../../components/tasks/items/checklist.html';
import noteFormMarkup from '../../components/tasks/items/note-form.html';
import { Checklist } from './checklist';
import { Note } from './note';

const itemMap = {
  description: {
    type: 'description',
    default: 'Click to add a description',
  },
  checklist: {
    type: 'checklist',
    markup: checklistMarkup,
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
