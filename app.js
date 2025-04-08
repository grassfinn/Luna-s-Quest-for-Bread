// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
import Inventory from './Classes/Inventory.js';
import { ui } from './Classes/UI.js';
import { resources } from './Classes/Resources.js';
import { findItem, getMouseCoords, removeItem } from './utils.js';
import { bedroom } from './levels/Bedroom.js';
import { settings } from './Classes/Settings.js';
// export const assets = await resources.loadImages();

// TODO
// all sounds have current time to 0
// Tutorial/Cutscene?
// Hints based on how many items are in inventory
// Interactable Canvas/ items hidden under a different layer
// Controls
// Attempt Level Builder (in progress)

//? Things to look into
// canvas to draw opacity/Alpha Channel

// Classes
const map = [bedroom];
const currentLevel = map[0];
const inventory = new Inventory();
// Maybe better way to do this?
settings.formInputs.forEach((input) =>
  input.addEventListener('change', handleSettingsChange)
);
// Sounds
resources.sounds.win.volume = 0.55;
resources.sounds.win.currentTime = 6;
resources.sounds.bark.volume = settings.volume;
resources.sounds.bite.volume = settings.volume;

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
  // Close Modal
  if (currentElement.textContent === 'X') {
    resources.sounds.incorrect.play();
    resources.sounds.incorrect.currentTime = 0;
    ui.currentModal.close();
  }
  // Paw Buttons
  if (currentElement.id === 'menu') {
    resources.sounds.settings.play();
    resources.sounds.settings.currentTime = 0;
    ui.setCurrentModal = 'settings';
    ui.currentModal.showModal();
  }

  if (currentElement.id === 'hint') {
    // showHint()
    if (!bedroom.hints.length) return;
    resources.sounds.bark.play();
    ui.displayMsg(bedroom.hints[0], 5000);
    bedroom.hints.shift();
  }

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

  // Might Cause Issues
  // Was set on UI Dialog
  if (ui.currentModal.open) {
    handlePuzzleInteraction(currentElement);
    return;
  }
  // if dialog is open and puzzle has length,
  // put item back into the inventory
  if (currentElement.alt) {
    return ui.displayMsg(currentElement.alt);
  }
}
// Better way to do this?
function handleWin(bool) {
  if (bool) {
    resources.sounds.backgroundMusic.pause();
    resources.sounds.bite.play();
    ui.setCurrentModal = 'win-screen';
    resources.sounds.win.play();
    ui.currentModal.showModal();
    return;
  }
  if (bedroom.checkPuzzle()) {
    resources.sounds.backgroundMusic.pause();
    resources.sounds.win.play();
    ui.currentModal.close();
    ui.setCurrentModal = 'win-screen';
    ui.currentModal.showModal();
    return;
  }
  resources.sounds.incorrect.play();
  resources.sounds.incorrect.currentTime = 0;
}
function handlePuzzleInteraction(imgElement) {
  console.log(imgElement);

  // add into item class the zone it is in
  const zone =
    imgElement.parentElement.id || imgElement.parentElement.classList[1];
  // If that slot has a child then don't try to put an item in that slot
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

  // fixed inventory
  // Not going into the correct spot since the slot addition
  if (zone === 'lock') {
    inventory.items.push(currentItem);
    ui.inventory.append(imgElement);
    // Fix This?
    bedroom.puzzle = removeItem(indexOfItem, bedroom.puzzle);
    return;
  }

  // Add item based on the open spot
  bedroom.puzzle.push(currentItem);
  bedroom.placeInEmptySlot(imgElement);
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
  resources.sounds.openInventory.play();
  resources.sounds.openInventory.currentTime = 0;
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

      if (clickedItem.name === 'birthStonePictureFrame') {
        resources.sounds.openInventory.play();
        resources.sounds.openInventory.currentTime = 0;
        ui.setCurrentModal = 'birthstones-modal';
        ui.currentModal.showModal();
        return;
      }

      // Win Condition
      if (clickedItem.name === 'bread') {
        if (settings.difficulty === 'dog') return handleWin(true);
        // Might Cause Issues
        // Was set on UI Dialog
        ui.setCurrentModal = 'lock-modal';
        //! Show modal prevents content from being clicked on
        // dialogElement.showModal();
        //! Show allows other elements to be clicked
        ui.currentModal.show();
        resources.sounds.openInventory.play();
        resources.sounds.openInventory.currentTime = 0;
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
      resources.sounds.itemPickup.play();
      resources.sounds.itemPickup.currentTime = 0;

      // Place in inventory
      inventory.addItem(clickedItem);
      ui.inventory.append(createImage(clickedItem));
      console.log({ itemsLeft: bedroom.items });
    }
  });
}

function handleSettingsChange(input) {
  const { id, value } = input.target;
  if (id === 'difficulty') {
    settings.difficulty = value;
  }
  if (id === 'volume-slider') {
    settings.volume = Number(value / 10);
    resources.sounds.bark.volume = settings.volume;
  }
}

// Animations
const closeInventoryAnimation = [
  [{ scale: 0 }],
  {
    duration: 300,
  },
];
const openInventoryAnimation = [
  [{ scale: 1 }],
  {
    duration: 300,
  },
];
