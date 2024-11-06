//////////////_________________H E L P E R S_________________//////////////

export class Helper {
  constructor() {
    this.hideAndShowEls = this.hideAndShowEls.bind(this);
    // this.removeAndAddCls = this.removeAndAddCls.bind(this);
  }

  //////////////____C L A S S  M A N I P U L A T I O N____//////////////

  //___H I D E  &  S H O W___________________________________________//
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

  //___A D D  &  R E M O V E_________________________________________//
  addClass(el, cls) {
    return el.classList.add(cls);
  }
  removeClass(el, cls) {
    return el.classList.remove(cls);
  }
  removeAndAddCls(el, cls1, cls2) {
    this.removeClass(el, cls1);
    this.addClass(el, cls2);
  }

  //___C H E C K  F O R  C L A S S___________________________________//
  hasClass(el, cls) {
    return el.classList.contains(cls);
  }

  //////////////______________A N I M A T I O N S______________//////////////
  //////////////______________A N I M A T I O N S______________//////////////
  scaleUp(el, startPos) {
    return requestAnimationFrame(() => {
      el.classList.add(`scale-up-${startPos}`);
    });
  }
  scaleDown(el, startPos) {
    return requestAnimationFrame(() => {
      el.classList.add(`scale-down-${startPos}`);
      console.log('scale-down animation added');
    });
  }
  moveDown(el, h) {
    return (el.transform = `translateY(${h})`);
  }

  //////////////_____________________D O M_____________________//////////////
  getClosest(el, cls) {
    return el.closest(cls);
  }

  //////////////__________________V A L U E S__________________//////////////
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  checkValue(el) {
    return el.value.trim();
  }
  checkValidity(inputEl) {
    if (!inputEl.checkValidity()) return inputEl.reportValidity();
  }

  //////////////__________________M A R K U P__________________//////////////
  clear = (el) => (el.innerHTML = '');
  insertMarkupAdj = (el, pos, markup) => el.insertAdjacentHTML(pos, markup);
  insertMarkupInner = (el, pos, markup) => el.innerHTML(pos, markup);
}
