class Checklist {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.checked = false;
    this.items = [];
  }

  getItems() {
    // store/display items
  }
}

class Item {
  constructor(id, value) {
    this.id = id;
    this.value = value;
    this.checked = false;
  }

  checkedItem() {
    this.checked = true;
  }
}
