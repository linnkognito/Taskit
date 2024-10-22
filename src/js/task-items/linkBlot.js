import Quill from 'quill';

const Inline = Quill.import('blots/inline');

class LinkBlot extends Inline {
  static blotName = 'link';
  static tagName = 'a';

  static create(url) {
    let node = super.create();
    node.setAttribute('href', url);
    node.setAttribute('targt', '_blank');
    return node;
  }

  static formats(node) {
    return node.getAttribute('href');
  }
}

Quill.register(LinkBlot);
