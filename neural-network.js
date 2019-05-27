const DEFAULT_CONFIG = {
  activation: 'sigmoid',
  loss: 'meanSquaredError',
  optimizer: 'sgd',
  hiddenLayerUnits: 4,
  outputLayerUnits: 1,
  trainingShuffle: true,
  trainingEpochs: 4,
  trainingBatchSize: 32,
  trainingXs: null,
  trainingYs: null,
};

const CONSOLE_STYLES = 'font-family: monospace; font-size: x-large';

const MODEL_STORED_NAME = 'tf-model-xor';

export default class NeuralNetwork {
  constructor(config) {
    this._config = Object.assign({}, DEFAULT_CONFIG, config);

    if (!this._config.trainingXs ||
        !this._config.trainingYs ||
        this._config.trainingXs.length === 0 ||
        this._config.trainingXs.length !== this._config.trainingYs.length) {
      console.error('trainingXs and Ys not provided or with incorrect format');
    }

    this._trainingXs = tf.tensor(this._config.trainingXs);
    this._trainingYs = tf.tensor(this._config.trainingYs);
  }

  createModel() {
    this._model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [this._config.trainingXs[0].length],
          units: this._config.hiddenLayerUnits,
          activation: this._config.activation,
        }),
        tf.layers.dense({
          units: this._config.outputLayerUnits,
          activation: this._config.activation,
        }),
      ],
    });

    console.log('%c\nModel successfully created', CONSOLE_STYLES);

    this._model.summary();
  }

  compileModel() {
    this._model.compile({
      optimizer: this._config.optimizer,
      loss: this._config.loss
    });

    console.log('%c\nModel successfully compiled', CONSOLE_STYLES);
  }

  trainModel() {
    return this._model.fit(this._trainingXs, this._trainingYs, {
      batchSize: this._config.trainingBatchSize,
      epochs: this._config.trainingEpochs,
      shuffle: this._config.trainingShuffle,
      verbose: 2,
    });
  }

  predict(input) {
    return tf.tidy(() => this._model.predict(tf.tensor(input)).dataSync());
  }

  async saveModel() {
    const saveResult = await this._model.save(`localstorage://${MODEL_STORED_NAME}`);
    console.log(saveResult);
  }

  async loadModel() {
    this._model = await tf.loadModel(`localstorage://${MODEL_STORED_NAME}`);
  }
}
