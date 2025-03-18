import Level from '../Level.js';
import { resources } from '../Resources.js';
import { ui } from '../UI.js';
const images = await resources.loadImages();
class Bedroom extends Level {
  constructor(resource, itemsLayerCtx) {
    super(resource, itemsLayerCtx);
    this.puzzle = [];
  }
  draw(ctx) {
    super.draw(ctx);
    // addtional logic
  }

  addItem(item) {
    return super.addItem(item);
  }

  removeItem(item) {
    return super.removeItem(item);
  }

  checkPuzzle() {
    return this.puzzle.reduce((acc, cur) => {
      return acc + cur.name[0];
    }, '');
  }
}

export const bedroom = new Bedroom(images.bedroom, ui.itemsLayerCtx);
