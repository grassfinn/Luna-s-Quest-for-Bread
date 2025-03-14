export function checkRange(number, min, max) {
  return number >= min && number <= max;
}

export function findItem(itemName, arr) {
  let index = arr.findIndex((item) => itemName === item.name);
  return index;
}

export function removeItem(index, arr) {
  arr.splice(index, 1);
  return arr;
}

export function getMouseCoords(event, element) {
  // Need to account padding,margin,etc for the canvases X and Y
  const { x, y } = event;
  const bounding = element.getBoundingClientRect();
  const canvasX = x - bounding.left;
  const canvasY = y - bounding.top;
  return { canvasX, canvasY };
}
