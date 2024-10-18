// helpers.js

export class Helper {
  //-- CLASS MANIPULATION -----------------------------------//
  showElement(el) {
    return el.classList.remove('hidden');
  }
  hideElement(el) {
    return el.classList.add('hidden');
  }
  hideAndShowEls(el1, el2) {
    this.hideElement(el1);
    this.showElement(el2);
  }
  containsClass(el, cls) {
    return el.classList.contains(cls);
  }
  hasClass(el, cls) {
    return el.classList.contain(cls);
  }

  //-- MARKUP -----------------------------------------------//
  clear = (el) => (el.innerHTML = '');
  insertMarkupAdj = (el, pos, markup) => el.insertAdjacentHTML(pos, markup);
  insertMarkupInner = (el, pos, markup) => el.innerHTML(pos, markup);
}
