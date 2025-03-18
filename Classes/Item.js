import { checkRange } from '../utils.js';

export default class Item {
  constructor(name, resource, dimensions, desc, obtainable) {
    this.name = name;
    this.resource = resource;
    this.dimensions = dimensions;
    this.desc = desc;
    this.obtainable = obtainable;
  }

  isClicked(x, y) {
    if (
      checkRange(x, this.dimensions.x, this.dimensions.x + this.dimensions.w) &&
      checkRange(y, this.dimensions.y, this.dimensions.y + this.dimensions.h)
    ) {
      return this;
    }
  }

  get info() {
    console.log(this);
  }

  draw(ctx) {
    if (this.resource.isLoaded) {
      const { x, y, w, h } = this.dimensions;
      const { image } = this.resource;

      ctx.drawImage(image, x, y, w, h);
    } else {
      console.error('Image is not loaded');
    }
  }
}
