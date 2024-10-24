// helpers.js

export class Helper {
  //-- CLASS MANIPULATION -----------------------------------//
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
  containsClass(el, cls) {
    return el.classList.contains(cls);
  }
  hasClass(el, cls) {
    return el.classList.contains(cls);
  }
  addClass(el, cls) {
    return el.classList.add(cls);
  }
  scaleUp(el, startPos) {
    return requestAnimationFrame(() => {
      el.classList.add(`scale-up-${startPos}`);
    });
  }
  moveDown(el, h) {
    return (el.transform = `translateY(${h})`);
  }

  //-- MARKUP -----------------------------------------------//
  clear = (el) => (el.innerHTML = '');
  insertMarkupAdj = (el, pos, markup) => el.insertAdjacentHTML(pos, markup);
  insertMarkupInner = (el, pos, markup) => el.innerHTML(pos, markup);
}
