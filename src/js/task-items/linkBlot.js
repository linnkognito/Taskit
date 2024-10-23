import Quill from 'quill';

const Inline = Quill.import('blots/inline');

class LinkBlot extends Inline {
  static blotName = 'link';
  static tagName = 'a';

  static create(url) {
    let node = super.create();
    node.setAttribute('href', url);
    node.setAttribute('target', '_blank');
    node.setAttribute('title', url);
    node.classList.add('ql-editor--link');
    return node;
  }

  static formats(node) {
    return node.getAttribute('href');
  }
}

Quill.register(LinkBlot);
