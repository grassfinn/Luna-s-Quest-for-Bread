// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
import Inventory from './Classes/Inventory.js';
import { ui } from './Classes/UI.js';
import { resources } from './Classes/Resources.js';
import { findItem, getMouseCoords, removeItem } from './utils.js';
import { bedroom } from './levels/Bedroom.js';
// export const assets = await resources.loadImages();

// TODO
// Tutorial/Cutscene?
// Interactable Canvas
// Options
// Multiple Levels / Class Supers
// Attempt Level Builder

//? Things to look into
// canvas to draw opacity/Alpha Channel

// Classes
const map = [bedroom];
const currentLevel = map[0];
const inventory = new Inventory();

resources.sounds.win.volume = 0.55;

currentLevel.draw(ui.backgroundLayerCtx);

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
window.addEventListener('keyup', handleKeyUp);

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

  if (currentElement.id === 'bark') {
    resources.sounds.bark.play();
    resources.sounds.bark.currentTime = 0;
  }

  if (currentElement.id === 'inventory-btn') {
    handleInventory();
    return;
  }

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
  if (currentElement.alt) {
    return ui.displayMsg(currentElement.alt);
  }
}

function handleWin() {
  if (bedroom.checkPuzzle()) {
    resources.sounds.win.currentTime = 6;
    resources.sounds.win.play();
  }
}
function handlePuzzleInteraction(imgElement, zone) {
  const slots = document.querySelectorAll('.slot');
  const children = [...slots].map((slot) =>
    slot.children.length ? true : false
  );
  console.log(children);
  // If that slot has a child then dont try to put an item in that slot

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
    ui.barkBtn.style.transform = 'scale(1.1)';
    resources.sounds.bark.play();
  }
  resources.sounds.bark.currentTime = 0;
}
function handleKeyUp(e) {
  if (e.key === 'b') {
    ui.barkBtn.style.transform = 'scale(1)';
  }
}

function handleInventory() {
  // Play sound
  // Open
  if (ui.inventory.className === 'open') {
    ui.inventory.animate(
      closeInventoryAnimation[0],
      closeInventoryAnimation[1]
    ).onfinish = () => {
      ui.inventory.style.scale = '0';
      ui.inventory.classList.toggle('open');
    };
    return;
  }
  ui.inventory.animate(
    openInventoryAnimation[0],
    openInventoryAnimation[1]
  ).onfinish = () => {
    ui.inventory.style.scale = '1';
    ui.inventory.classList.toggle('open');
  };
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

// Animations
const closeInventoryAnimation = [
  [{ scale: 0 }],
  {
    duration: 750,
  },
];
const openInventoryAnimation = [
  [{ scale: 1 }],
  {
    duration: 750,
  },
];
