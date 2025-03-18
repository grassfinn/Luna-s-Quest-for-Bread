import Item from './Item.js';
export default class Level {
  constructor(resource, itemsLayer) {
    this.resource = resource;
    this.items = [];
    this.itemsLayer = itemsLayer;
  }

  draw(ctx) {
    if (this.resource.isLoaded) {
      ctx.drawImage(
        this.resource.image,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      this.items.forEach((item) => {
        item.draw(this.itemsLayer);
      });
    } else {
      console.error('Image is not loaded');
    }
  }
  addItem(obj) {
    const { name, resource, dimensions, desc, obtainable } = obj;
    this.items.push(new Item(name, resource, dimensions, desc, obtainable));
  }

  removeItem(item) {
    if (!item.obtainable) {
      console.log('I cannot pick that up');
      return false;
    }
    if (this.items.includes(item)) {
      const itemIndex = this.items.indexOf(item);
      this.items.splice(itemIndex, 1);
      return this.items;
    }
  }

  clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
