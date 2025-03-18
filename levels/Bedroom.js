import Level from '../Level.js';

class Bedroom extends Level {
  constructor(resource, itemsLayer) {
    super(resource, itemsLayer);
  }
}

export const testLevel = new Bedroom()