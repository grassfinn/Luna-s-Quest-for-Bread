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
