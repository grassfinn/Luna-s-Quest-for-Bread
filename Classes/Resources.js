class Resources {
  constructor() {
    this.toLoad = {
      bedroom: './assets/images/bedroom.jpg',
      bread: './assets/images/bread.png',
      bloodstone: './assets/images/bloodstone.png',
      ruby: './assets/images/ruby.png',
      emerald: './assets/images/emerald.png',
      amethyst: './assets/images/amethyst.png',
      diamond: './assets/images/diamond.png',
    };
    this.images = {};
    // Might have to do the same for audio?
    this.sounds = {
      win: new Audio('./assets/sounds/Hank C Burnette -Rockin The Dog.mp3'),
      bark: new Audio('./assets/sounds/bark.mp3'),
    };
    this.loaded = false;
  }

  // Load each Image using promises to prevent images not loading in
  async loadImages() {
    try {
      const images = Object.keys(this.toLoad).map((key) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = this.toLoad[key];
          this.images[key] = {
            name: key,
            image: img,
            isLoaded: false,
          };

          img.onload = () => {
            this.images[key].isLoaded = true;

            resolve(this.images[key]);
          };

          img.onerror = () => {
            reject(new Error(`failed to load ${key}`));
          };
        });
      });

      const allPromises = await Promise.all(images);
      // need to map so it will be one object to use for the image rendering
      const resourcesObj = allPromises.reduce((acc, cur) => {
        if (!acc[cur]) {
          acc[cur.name] = cur;
        }

        return acc;
      }, {});
      this.loaded = true;
      return await resourcesObj;
    } catch (e) {
      console.error(e.message);
    }
  }
}
// instance for whole app to use
export const resources = new Resources();
