export default class Inventory {
  items = [];

  get allItems() {
    console.log(this.items);
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(index) {
    this.items.splice(index, 1);
  }

  
}
