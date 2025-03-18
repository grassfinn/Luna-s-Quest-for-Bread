import Level from '../Classes/Level.js';
import { resources } from '../Classes/Resources.js';
import { ui } from '../Classes/UI.js';
import Item from '../Classes/Item.js';

// No sure if this is the best way to approach this? will this load the images each time?
const assets = !resources.loaded ? await resources.loadImages() : null;
console.log(resources);

class Bedroom extends Level {
  constructor(resource, itemsLayerCtx) {
    super(resource, itemsLayerCtx);
    this.puzzle = [];
  }
  draw(ctx) {
    // this is calling the draw function from the class it is inheriting
    super.draw(ctx);
    // additional logic
  }

  addItem(item) {
    // Still need to make sure to return because this class is returning a value as well
    return super.addItem(item);
  }

  removeItem(item) {
    return super.removeItem(item);
  }

  checkPuzzle() {
    const word = this.puzzle.reduce((acc, cur) => {
      return acc + cur.name[0];
    }, '');
    if (word === 'bread') return true;
    return false;
  }
}

// etc
// Assets
const bread = new Item(
  'bread',
  assets.bread,
  { x: 625, y: 450, w: 50, h: 50 },
  'BREAD!',
  false
);

const bloodstone = new Item(
  assets.bloodstone.name,
  assets.bloodstone,
  { x: 1050, y: 490, w: 25, h: 25 },
  'Looks like blood!',
  true
);
const ruby = new Item(
  assets.ruby.name,
  assets.ruby,
  { x: 342, y: 485, w: 25, h: 25 },
  'A red rock?',
  true
);
const emerald = new Item(
  assets.emerald.name,
  assets.emerald,
  { x: 1090, y: 290, w: 15, h: 15 },
  'green rock?',
  true
);
const amethyst = new Item(
  assets.amethyst.name,
  assets.amethyst,
  { x: 305, y: 640, w: 30, h: 30 },
  'Purple rock?',
  true
);
const diamond = new Item(
  assets.diamond.name,
  assets.diamond,
  { x: 258, y: 32, w: 20, h: 20 },
  'fancy rock?',
  true
);
export const bedroom = new Bedroom(assets.bedroom, ui.itemsLayerCtx);

bedroom.addItem(bloodstone);
bedroom.addItem(ruby);
bedroom.addItem(emerald);
bedroom.addItem(amethyst);
bedroom.addItem(diamond);
bedroom.addItem(bread);
