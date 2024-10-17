// helpers.js

export class Helper {
  //-- CLASS MANIPULATION -----------------------------------//
  showElement(el) {
    return el.classList.remove('hidden');
  }
  hideElement(el) {
    return el.classList.add('hidden');
  }
  containsClass(el, cls) {
    return el.classList.contains(cls);
  }

  //-- MARKUP -----------------------------------------------//
  clear = (el) => (el.innerHTML = '');
  insertMarkupAdj = (el, pos, markup) => el.insertAdjacentHTML(pos, markup);
  insertMarkupInner = (el, pos, markup) => el.innerHTML(pos, markup);
}

// toAMPM(t) {
//   const [h24, m] = t.split(':');
//   let h12 = h24 % 12 || 12;
//   const per = h24 >= 12 ? 'PM' : 'AM';

//   return `${h12}:${m} ${per}`;
// }
