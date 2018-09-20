import React, { Component } from 'react';
import {Progress} from 'reactstrap';
import MachineWorker from '../helpers/Machine.worker.js';
import Machine from '../helpers/Machine';

const HIGH_CONFIDENCE_THRESHOLD = 0.075
const MEDIUM_CONFIDENCE_THRESHOLD = 0.06
const LOW_CONFIDENCE_THRESHOLD = 0.05

class Classifier extends Component {
  constructor(props) {
    super(props);
    this.state = { predictions: null };
  }

  componentDidMount() {
    this.callWorker(this.props.imageData)
  }

  componentDidUpdate(prevProps) {
    if(this.props.imageData !== prevProps.imageData) {
      this.callWorker(this.props.imageData)
    }
  }

  callWorker = (imageData) => {
    const worker = new MachineWorker()
    this.setState({ currentProgress: {value: 5}})
    worker.onmessage = (message) => {
      switch(message.data.text) {
        case('Loaded'):
          this.setState({ currentProgress: {value: 25}})
          break;
        case('Prepped'):
          this.setState({ currentProgress: {value: 50}})
          break;
        case('Predicted'):
          this.setState({ currentProgress: {value: 85}})
          break;
        case('Complete'):
          this.setState({ currentProgress: {value: 100}, predictions: message.data.labels})
          break;
      }
    }
    worker.postMessage({message: 'Analyze', input: imageData})
  }

  render() {
    const { predictions, currentProgress } = this.state
    const contextualized = predictions ? predictions.map((p, i, arr) =>
      {
        let confidence_level
        if (p.value > HIGH_CONFIDENCE_THRESHOLD) {
          confidence_level = 'text-success'
        } else if (p.value > MEDIUM_CONFIDENCE_THRESHOLD) {
          confidence_level = 'text-info'
        } else if (p.value > LOW_CONFIDENCE_THRESHOLD) {
          confidence_level = 'text-warning'
        } else {
          confidence_level = 'text-danger'
        }
        return <p className={confidence_level} key={i}>{p.label}</p>
      }
    ) : null
    return (
      <div>
        { currentProgress ? <Progress {...currentProgress} /> : null}
        { contextualized ? contextualized.map((tags) => tags) : null}
      </div>
    );
  }
}

export default Classifier;
