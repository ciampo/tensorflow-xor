const DEFAULT_CONFIG = {
  elementId: 'c',
  size: 400,
  resolution: 20,
}

export default class Canvas {
  constructor(config) {
    this._config = Object.assign({}, DEFAULT_CONFIG, config);
    this._canvas = document.querySelector(`canvas#${this._config.elementId}`);

    if (!this._canvas) {
      console.error(`Couldn't find any canvas with id ${this._config.elementId}`)
      return;
    }

    this._ctx = this._canvas.getContext('2d');

    this._canvas.width = this._config.size;
    this._canvas.height = this._config.size;

    this.numCols = this.numRows =
        Math.floor(this._config.size / this._config.resolution);
  }

  draw(data) {
    let index = 0;
    for (let x = 0; x < this.numCols; x += 1) {
      for (let y = 0; y < this.numRows; y += 1) {
        this._drawIteration(x * this._config.resolution,
            y * this._config.resolution, data[index]);
        index += 1;
      }
    }

    this._ctx.beginPath();
    for (let x = 1; x < this.numCols; x += 1) {
      this._ctx.moveTo(x * this._config.resolution, 0);
      this._ctx.lineTo(x * this._config.resolution, this._config.size);
    }
    this._ctx.stroke();

    this._ctx.beginPath();
    for (let y = 1; y < this.numRows; y += 1) {
      this._ctx.moveTo(0, y * this._config.resolution, 0);
      this._ctx.lineTo(this._config.size, y * this._config.resolution);
    }
    this._ctx.stroke();
  }

  _percToRGBGrayscale(perc = 0.5) {
    return `rgb(${perc * 255}, ${perc * 255}, ${perc * 255})`;
  }

  _drawIteration(x, y, value) {
    this._ctx.fillStyle = this._percToRGBGrayscale(value);
    this._ctx.fillRect(x, y, this._config.resolution, this._config.resolution);
  }
}
