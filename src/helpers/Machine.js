
import * as tf from '@tensorflow/tfjs';
import {loadFrozenModel} from '@tensorflow/tfjs-converter';

const INPUT_WIDTH = 224;
const INPUT_HEIGHT = 224;
const INPUT_NODE_NAME = 'Placeholder';
const OUTPUT_NODE_NAME = 'final_result';
const PREPROCESS_DIVISOR = tf.scalar(255 / 2);
const MODEL_URL = 'tfjs-models/mobilenet_v2_classification/tensorflowjs_model.pb';
const WEIGHTS_URL = 'tfjs-models/mobilenet_v2_classification/weights_manifest.json';
const LABELS_URL = 'style_labels.txt';

export default class Machine {

  loadModel = async () => {
    this.model = await loadFrozenModel(MODEL_URL, WEIGHTS_URL)
  }

  loadLabels = async () => {
    const labelsFile = await fetch(LABELS_URL)
    const labelsText = await labelsFile.text()
    this.labelsList = labelsText.split('\n')

  }

  getImageTensor = (imageElement) => {
    return tf.fromPixels(imageElement)
  }

  prepInput = (imageElement) => {
    const tfImage = tf.fromPixels(imageElement)
    const smallImage = tf.image.resizeBilinear(tfImage, [INPUT_WIDTH, INPUT_HEIGHT])
    const preprocessedImage = tf.div(
      tf.sub(smallImage.asType('float32'), PREPROCESS_DIVISOR),
      PREPROCESS_DIVISOR);
    const reshapedInput =
      preprocessedImage.reshape([-1, ...preprocessedImage.shape]);
    this.preppedInput = reshapedInput
    return reshapedInput
  }
  
  getPredictionValues = (input) => {
    console.log(this.model)
    // Get logits from prepped input
    const logits = this.model.execute(
      {[INPUT_NODE_NAME]: input}, OUTPUT_NODE_NAME);
    // Make predictions from logits
    const predictions = tf.tidy(() => {
      return tf.softmax(logits);
    });
    const values = predictions.dataSync();
    predictions.dispose();
    this.predictionValues = values
  }
  
  getTopKValues = (k) => {
    let predictionList = [];
    for (let i = 0; i < this.predictionValues.length; i++) {
      predictionList.push({value: this.predictionValues[i], index: i});
    }
    this.predictionList = predictionList
      .sort((a, b) => {
        return b.value - a.value;
      })
      .slice(0, k);
  }
  
  labelValues = () => {
    return this.predictionList.map(x => ({label: this.labelsList[x.index], value: x.value}))
  }

}

