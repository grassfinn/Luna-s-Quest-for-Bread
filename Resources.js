class Resources {
  constructor() {
    this.toLoad = {
      bedroom: './images/bedroom.jpg',
      bread: './images/bread.png',
      stapler: './images/test.png',
      bloodstone: './images/bloodstone.png',
      ruby: './images/ruby.png',
      emerald: './images/emerald.png',
      amethyst: './images/amethyst.png',
      diamond: './images/diamond.png',
    };
    this.images = {};
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

      return resourcesObj;
    } catch (e) {
      console.error(e.message);
    }
  }
}
// instance for whole app to use
export const resources = new Resources();
