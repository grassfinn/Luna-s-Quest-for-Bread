// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
import Inventory from './Inventory.js';
import UI from './UI.js';
import Item from './Item.js';
import Level from './Level.js';
import { resources } from './Resources.js';
import { findItem, getMouseCoords, removeItem } from './utils.js';

const assets = await resources.loadImages();
// TODO
// Tutorial/Cutscene?
// Interactable Canvas
// Bark Button
// Inventory Fix
// Options
// Multiple Levels / Class Supers
// Attempt Level Builder

//? Things to look into
// canvas to draw opacity/Alpha Channel

// Classes
const ui = new UI(1200, 800, '2d');
const inventory = new Inventory();

resources.sounds.win.volume = 0.55;

// etc

// Assets
const bedroom = new Level(assets.bedroom, ui.itemsLayerCtx);
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

bedroom.addItem(bloodstone);
bedroom.addItem(ruby);
bedroom.addItem(emerald);
bedroom.addItem(amethyst);
bedroom.addItem(diamond);
bedroom.addItem(bread);
bedroom.draw(ui.backgroundLayerCtx);

//! Event Listeners
ui.itemsLayer.addEventListener('click', (e) =>
  handleMouseClick(e, ui.itemsLayer)
);
// Debugger
ui.itemsLayer.addEventListener('mousemove', (e) =>
  handleMouseMove(e, ui.itemsLayer)
);
//! Global Event Listeners
window.addEventListener('click', (e) => handleGlobalClick(e));

window.addEventListener('keydown', handleKeyDown);

// Functions

// Handler Functions
function handleMouseMove(e, element) {
  const { canvasX, canvasY } = getMouseCoords(e, element);
  document.querySelector(
    '#debug-text'
  ).textContent = `X:${canvasX} Y:${canvasY}`;
}

function handleGlobalClick(e) {
  const currentElement = e.target;
  const clickedItem = currentElement.dataset.name;

  if (currentElement.textContent === 'Check') {
    handleWin();
    return;
  }

  if (ui.dialog.open) {
    handlePuzzleInteraction(currentElement, currentElement.parentElement.id);
    return;
  }
  // if dialog is open and puzzle has length,
  // put item back into the inventory
  // if (ui.dialog.open && bedroom.puzzle.length) {
  // }

  if (currentElement.localName === 'img') {
    return ui.displayMsg(currentElement.alt);
  }
}

function handleWin() {
  if (bedroom.checkPuzzle() === 'bread') {
    resources.sounds.win.currentTime = 6;
    resources.sounds.win.play();
  }
}
function handlePuzzleInteraction(imgElement, zone) {
  // Switch items by the determining zone.
  const itemName = imgElement.dataset.name;
  const indexOfItem =
    zone === 'lock'
      ? findItem(itemName, bedroom.puzzle)
      : findItem(itemName, inventory.items);
  const currentItem =
    zone === 'lock'
      ? bedroom.puzzle[indexOfItem]
      : inventory.items[indexOfItem];

  if (!currentItem) return;

  if (zone === 'lock') {
    inventory.items.push(currentItem);
    ui.inventory.append(imgElement);
    // Fix This?
    bedroom.puzzle = removeItem(indexOfItem, bedroom.puzzle);
    return;
  }
  // Maybe Shift inside of push?
  bedroom.puzzle.push(currentItem);
  ui.puzzle.append(imgElement);
  // Fix This?
  inventory.removeItem(indexOfItem);
  return;
}

function handleKeyDown(e) {
  if (e.key === 'b') {
    resources.sounds.bark.play();
  }
  resources.sounds.bark.currentTime = 0;
}

function handleMouseClick(event, element) {
  const { canvasX, canvasY } = getMouseCoords(event, element);
  const { createImage } = ui;
  let clickedItem = '';
  // Check if it has been clicked
  bedroom.items.forEach((item) => {
    // if it is the one clicked, remove it then repaint
    if (item.isClicked(canvasX, canvasY)) {
      clickedItem = item.isClicked(canvasX, canvasY);
      let { dimensions } = clickedItem;
      let { x, y, w, h } = dimensions;

      // Win Condition
      if (clickedItem.name === 'bread') {
        //! Show modal prevents content from being clicked on
        // dialogElement.showModal();
        //! Show allows other elements to be clicked
        ui.dialog.show();
        return;
      }

      // check if it can't be picked up
      if (!bedroom.removeItem(clickedItem)) {
        ui.displayMsg(item.desc);
        return;
      }

      // can pick up
      ui.itemsLayerCtx.clearRect(x, y, w, h);
      bedroom.removeItem(clickedItem);

      // Place in inventory
      inventory.addItem(clickedItem);
      ui.inventory.append(createImage(clickedItem));
      console.log({ itemsLeft: bedroom.items });
    }
  });
}
