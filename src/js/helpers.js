// helpers.js

export class Helper {
  constructor() {
    this.hideAndShowEls = this.hideAndShowEls.bind(this);
  }

  //-- CLASS MANIPULATION ------------------------------//

  // HIDE & SHOW //
  showElement(el) {
    return el.classList.remove('hidden');
  }
  hideElement(el) {
    return el.classList.add('hidden');
  }
  toggleElement(el) {
    return el.classList.toggle('hidden');
  }
  hideAndShowEls(el1, el2) {
    this.hideElement(el1);
    this.showElement(el2);
  }

  // ADD & REMOVE
  addClass(el, cls) {
    return el.classList.add(cls);
  }
  removeClass(el, cls) {
    return el.classList.remove(cls);
  }

  // CHECK FOR CLASS //
  hasClass(el, cls) {
    return el.classList.contains(cls);
  }

  // EFFECTS & ANIMATIONS //
  scaleUp(el, startPos) {
    return requestAnimationFrame(() => {
      el.classList.add(`scale-up-${startPos}`);
    });
  }
  moveDown(el, h) {
    return (el.transform = `translateY(${h})`);
  }

  //-- DOM ---------------------------------------------//
  getClosest(el, cls) {
    return el.closest(cls);
  }

  //-- VALUES ------------------------------------------//
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  //-- MARKUP ------------------------------------------//
  clear = (el) => (el.innerHTML = '');
  insertMarkupAdj = (el, pos, markup) => el.insertAdjacentHTML(pos, markup);
  insertMarkupInner = (el, pos, markup) => el.innerHTML(pos, markup);
}
