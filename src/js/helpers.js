// helpers.js

export class Helper {
  //-- CLASS MANIPULATION -----------------------------------//
  showElement(el) {
    el.classList.remove('hidden');
  }
  hideElement(el) {
    el.classList.add('hidden');
  }
  containsClass(el, cls) {
    el.classList.contains(cls);
  }

  //-- MARKUP -----------------------------------------------//
  clear = (el) => (el.innerHTML = '');
  insertMarkupAdj = (el, pos, markup) => el.insertAdjacentHTML(pos, markup);
  insertMarkupInner = (el, pos, markup) => el.innerHTML(pos, markup);

  fetchMarkup = async function (url) {
    try {
      const res = await fetch(url);
      // console.log('res:', res);
      if (!res.ok) throw new Error(`Failed to fetch HTML: ${res.status}`);

      const markup = res.text();
      console.log('markup.text()', markup);
      return markup;
    } catch (err) {
      console.log(`Failed to fetch HTML. ${err}`);
    }
  };
}
