import Canvas from './canvas.js';
import NeuralNetwork from './neural-network.js';

const LOSS_LABEL_ID = 'loss';

const NN_CONFIG = {
  trainingXs: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  trainingYs: [
    [1],
    [0],
    [0],
    [1],
  ],
  optimizer: tf.train.momentum(0.2, 1),
  // optimizer: tf.train.adam(0.2),
  // optimizer: tf.train.sgd(0.4),
  hiddenLayerUnits: 4,
  trainingEpochs: 10,
};

const CANVAS_CONFIG = {
  elementId: 'canvas',
  size: 800,
};

class Main {
  constructor() {
    // Create stuff
    this._nn = new NeuralNetwork(NN_CONFIG);
    this._c = new Canvas(CANVAS_CONFIG);
    this._lossLabel = document.getElementById(LOSS_LABEL_ID);

    this._loss = -1;

    this._nn.createModel();
    this._nn.compileModel();

    this._predictionInput = [];
    for (let x = 0; x < this._c.numCols; x += 1) {
      for (let y = 0; y < this._c.numRows; y += 1) {
        this._predictionInput.push([
          x / this._c.numCols,
          y / this._c.numRows,
        ]);
      }
    }

    // Bind functions.
    this.renderLoop = this.renderLoop.bind(this);
    this.trainLoop = this.trainLoop.bind(this);
    this.toggleTraining = this.toggleTraining.bind(this);

    // Final prep
    this.isTraining = false;

    document.getElementById('train-button')
      .addEventListener('click', this.toggleTraining);

    document.getElementById('save-button')
      .addEventListener('click', () => this.saveModel());

    document.getElementById('load-button')
      .addEventListener('click', () => this.loadModel());

    // Ready to start rendering to screen
    requestAnimationFrame(this.renderLoop);
    // this.trainLoop();
  }

  toggleTraining(e) {
    if (this.isTraining === false) {
      this.isTraining = true;
      e.target.textContent = 'Stop training';
      this.trainLoop();

    } else {
      this.isTraining = false;
      e.target.textContent = 'Start training';
    }
  }

  trainLoop() {
    this._nn.trainModel().then(({history}) => {
      this._loss = history.loss[0];

      if (this.isTraining === true) {
        setTimeout(this.trainLoop);
      }
    });
  }

  saveModel() {
    this._nn.saveModel();
  }

  loadModel() {
    this._nn.loadModel();
  }

  renderLoop() {
    requestAnimationFrame(this.renderLoop);

    // Update canvas
    const predictionOutput = this._nn.predict(this._predictionInput);
    this._c.draw(predictionOutput);

    // Update loss
    this._lossLabel.textContent = this._loss;
  }
}


function start() {
  new Main();
}

start();
