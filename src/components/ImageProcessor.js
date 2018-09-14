import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import {loadFrozenModel} from '@tensorflow/tfjs-converter';
import MODEL_URL from 'tfjs-models/mobilenet_v2/tensorflowjs_model.pb';
import WEIGHTS_URL from 'tfjs-models/mobilenet_v2/weights_manifest.json';
import LABELS_URL from 'style_labels.txt';

const INPUT_NODE_NAME = 'Placeholder';
const OUTPUT_NODE_NAME = 'final_result';
const PREPROCESS_DIVISOR = tf.scalar(255 / 2);

class ImageProcessor extends Component {
  constructor(props) {
    super(props);
    this.state = { prediction: null };
  }
  async componentDidMount() {
    const model = await loadFrozenModel(MODEL_URL, WEIGHTS_URL)
    const labelsFile = await fetch(LABELS_URL)
    const labelsText = await labelsFile.text()
    const labelsList = labelsText.split('\n')
    this.setState({model: model, labelsList: labelsList})
  }

  handleProcess = async () => {

    const imgElement = document.getElementById('test')
    console.log(imgElement)
    const tfImg = tf.fromPixels(imgElement)
    const smallImg = tf.image.resizeBilinear(tfImg, [224, 224])
    const preprocessedImg = tf.div(
      tf.sub(smallImg.asType('float32'), PREPROCESS_DIVISOR),
      PREPROCESS_DIVISOR);
    const reshapedInput =
      preprocessedImg.reshape([-1, ...preprocessedImg.shape]);

    const logits = this.state.model.execute(
      {[INPUT_NODE_NAME]: reshapedInput}, OUTPUT_NODE_NAME);

    const predictions = tf.tidy(() => {
      return tf.softmax(logits);
    });

    const values = predictions.dataSync();
    predictions.dispose();

    const topK = 10;
    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList
      .sort((a, b) => {
        return b.value - a.value;
      })
      .slice(0, topK);

    const labelsList = this.state.labelsList;
    const labeledPredictions = predictionList.map(x => ({label: labelsList[x.index], value: x.value}))
    this.setState({prediction: labeledPredictions[0]})

  }

  setImage = (e) => {
    if(e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({imgUpload: e.target.result, prediction: null})
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  handleDragOver = (e) => {
    e.preventDefault();
  }

  handleDrop = (e) => {
    e.preventDefault();
    if(e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (reader_ev) => {
        this.setState({imgUpload: reader_ev.target.result, prediction: null})
      }
      reader.readAsDataURL(e.dataTransfer.files[0])
    }
  }

  render() {
    const prediction = this.state.prediction
    const imgUpload = this.state.imgUpload
    return(
      <div id="dropzone" onDrop={this.handleDrop} onDragOver={this.handleDragOver}>
        <div>
          <h3>Upload an image of a building (jpg or png)</h3>
          <p>Drag and drop anywhere to upload or <input type="file" onChange={this.setImage}/></p>
        </div>
        { imgUpload ?
        <div>
          <div className="center-button">
            { prediction ? 
            <p>{prediction.label}</p>
              : <p>&#x1F914;</p>
            }
          </div>
          <img id='test' src={imgUpload} onLoad={this.handleProcess} />
        </div>
          : null
        }
      </div>
    )
  }
}

export default ImageProcessor;
