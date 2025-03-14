// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
import Inventory from './Inventory.js';
import Item from './Item.js';
import Level from './Level.js';
import { resources } from './Resources.js';
import { findItem, getMouseCoords, removeItem } from './utils.js';
const assets = await resources.loadImages();
// TODO

// HTML Elements
const inventoryEle = document.querySelector('#inventory');
const dialogElement = document.querySelector('dialog');
const puzzleElement = document.querySelector('#lock');
const canvas = document.querySelector('#background');
const items = document.querySelector('#items');

// Classes
const inventory = new Inventory();
const width = 1200;
const height = 800;
items.width = width;
items.height = height;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
const itemsCtx = items.getContext('2d');

resources.sounds.win.volume = 0.55;

// etc
let msgInterval;

// Assets
const bedroom = new Level(assets.bedroom, itemsCtx);
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
bedroom.draw(ctx);
//! Event Listeners

items.addEventListener('click', (e) => handleMouseClick(e, items));
// Debugger
items.addEventListener('mousemove', (e) => handleMouseMove(e, items));
//! Global Event Listeners
window.addEventListener('click', (e) => handleGlobalClick(e));

window.addEventListener('keydown', handleKeyDown);

// Functions
function createImg(item) {
  const element = document.createElement('img');
  element.src = item.resource.image.src;
  element.width = item.dimensions.w;
  element.height = item.dimensions.h;
  element.dataset.additionInfo = `X:${item.dimensions.x},Y:${item.dimensions.y}`;
  element.dataset.name = item.name;
  element.alt = item.desc;
  element.className = 'item';
  return element;
}

function displayMsg(msg) {
  clearInterval(msgInterval);
  const msgElement = document.querySelector('#msg');
  msgElement.style.visibility = ' visible'
  msgElement.textContent = msg;

  msgInterval = setTimeout(() => {
    msgElement.style.visibility = 'hidden'
    msgElement.textContent = '';
  }, 2000);
}

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

  if (currentElement.localName === 'img' && dialogElement.open) {
    handlePuzzleInteraction(currentElement);
    return;
  }

  if (currentElement.localName === 'img') {
    return displayMsg(currentElement.alt);
  }
}

function handleWin() {
  if (bedroom.checkPuzzle() === 'bread') {
    resources.sounds.win.currentTime = 6;
    resources.sounds.win.play();
  }
}

function handlePuzzleInteraction(imgElement) {
  const indexOfItem = findItem(imgElement.dataset.name, inventory.items);
  const currentItem = inventory.items[indexOfItem];
  if (!currentItem) return;
  bedroom.puzzle.push(currentItem);
  puzzleElement.append(imgElement);
  inventory.removeItem(indexOfItem);
}

function handleKeyDown(e) {
  if (e.key === 'b') {
    resources.sounds.bark.play();
  }
  resources.sounds.bark.currentTime = 0;
}

function handleMouseClick(event, element) {
  const { canvasX, canvasY } = getMouseCoords(event, element);
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
        dialogElement.show();
        return;
      }

      // check if it can't be picked up
      if (!bedroom.removeItem(clickedItem)) {
        displayMsg(item.desc);
        return;
      }

      // can pick up
      itemsCtx.clearRect(x, y, w, h);
      bedroom.removeItem(clickedItem);

      // Place in inventory
      inventory.addItem(clickedItem);
      inventoryEle.append(createImg(clickedItem));
      console.log(bedroom.items);
    }
  });
}
