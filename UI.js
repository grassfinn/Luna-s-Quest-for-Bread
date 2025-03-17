export default class UI {
  inventory = document.querySelector('#inventory');
  //   Debugger is a reserved word
  debugger = document.querySelector('#debugger');
  debuggerText = document.querySelector('#debug-text');
  // Canvases
  //* Interactables Canvas
  //* Item Canvas
  itemsLayer = document.querySelector('#items');
  //* Main/background Canvas
  backgroundLayer = document.querySelector('#background');

  msg = document.querySelector('#msg');
  dialog = document.querySelector('dialog');
  puzzle = document.querySelector('#lock');
  barkBtn = document.querySelector('#bark');
  inventoryBtn = document.querySelector('#inventory-btn');
  msgInterval = null;
  constructor(w, h, context) {
    this.backgroundLayer.width = w;
    this.itemsLayer.width = w;
    this.backgroundLayer.height = h;
    this.itemsLayer.height = h;
    this.backgroundLayerCtx = this.backgroundLayer.getContext(context);
    this.itemsLayerCtx = this.itemsLayer.getContext(context);
  }

  createImage(item) {
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

  displayMsg(msg) {
    if (this.msgInterval) clearInterval(this.msgInterval);
    this.msg.style.visibility = ' visible';
    this.msg.textContent = msg;

    this.msgInterval = setTimeout(() => {
      this.msg.style.visibility = 'hidden';
      this.msg.textContent = '';
    }, 2000);
  }
}
