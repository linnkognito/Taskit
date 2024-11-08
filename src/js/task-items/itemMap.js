// itemMap.js

import { Checklist } from './checklist';
import { Note } from './note';

const defaultColor = 'rgba(213, 207, 204, 0.7)';

const itemMap = {
  description: {
    type: 'description',
    default: 'Click to add a description',
  },
  checklist: {
    type: 'checklist',
    element: '.checklist',
    createInstance: (id, context) => new Checklist(id, context),
    array: (context) => context.checklists,
  },
  note: {
    type: 'note',
    element: '.note',
    createInstance: (id, context) => new Note(id, context),
    array: (context) => context.notes,
    default: `<p><em style="color: rgba(213, 207, 204, 0.7);">Click to add a note</em></p><p><br></p>`,
    // default: `<p style="color: ${defaultColor}; font-style: italic;">Click to add a note</p>`,
  },
};

export default itemMap;
