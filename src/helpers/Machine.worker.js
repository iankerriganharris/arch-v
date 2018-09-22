
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

onmessage = async (e) => {
  switch(e.data.message) {
    case('Analyze'):
      let predictionList = [];
      setTimeout(() => {
        if(!predictionList.length) postMessage({text: 'Error'})
      }, 10000)
      const img = e.data.input;
      const model = await loadFrozenModel(MODEL_URL, WEIGHTS_URL)
      const labelsFile = await fetch(LABELS_URL)
      const labelsText = await labelsFile.text()
      postMessage({text: 'Loaded'})
      const labelsList = labelsText.split('\n')
      const tfImg = tf.fromPixels(img)
      const smallImg = tf.image.resizeBilinear(tfImg, [INPUT_WIDTH, INPUT_HEIGHT])
      const preprocessedImg = tf.div(
        tf.sub(smallImg.asType('float32'), PREPROCESS_DIVISOR),
        PREPROCESS_DIVISOR);
      const reshapedInput =
        preprocessedImg.reshape([-1, ...preprocessedImg.shape]);
      postMessage({text: 'Prepped'})
      const logits = model.execute(
        {[INPUT_NODE_NAME]: reshapedInput}, OUTPUT_NODE_NAME);
      postMessage({text: 'Predicted'})
      const predictions = tf.tidy(() => {
        return tf.softmax(logits);
      });
      const values = predictions.dataSync();
      predictions.dispose();
      for (let i = 0; i < values.length; i++) {
        predictionList.push({value: values[i], index: i});
      }
      const topK = 5;
      predictionList = predictionList
        .sort((a, b) => {
          return b.value - a.value;
        })
        .slice(0, topK);
      const labels = predictionList.map(x => ({label: labelsList[x.index], value: x.value}))
      postMessage({text: 'Complete', labels: labels})
      break;
  }
};