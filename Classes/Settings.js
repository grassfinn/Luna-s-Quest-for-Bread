class Settings {
  element = document.querySelector('#settings-content');
  formInputs = [...this.element.elements];
  difficulty = 'Normal';
  volumeSlider = document.querySelector('#volume-slider');
  volume = Number(this.volumeSlider.value / 10);

  set setVolume(volume) {
    this.volume = volume;
  }

  //   Check this?
  
}


export const settings = new Settings();
