import React, { Component } from 'react';
import {Progress, Fade, Alert} from 'reactstrap';
import MachineWorker from '../helpers/Machine.worker.js';

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
      this.props.setActiveLabel(null)
      this.callWorker(this.props.imageData)
    }
  }

  callWorker = (imageData) => {
    const worker = new MachineWorker()
    this.setState({ currentProgress: {animated: true, value: 5}, error: null})
    worker.onmessage = (message) => {
      switch(message.data.text) {
        case('Error'):
          worker.terminate();
          this.setState({
            currentProgress: null,
            error: true
          })
          break;
        case('Loaded'):
          this.setState({ currentProgress: {...this.state.currentProgress, value: 25}})
          break;
        case('Prepped'):
          this.setState({ currentProgress: {...this.state.currentProgress, value: 60}})
          break;
        case('Predicted'):
          this.setState({ currentProgress: {...this.state.currentProgress, value: 85}})
          break;
        case('Complete'):
          this.setState({
            currentProgress: {...this.state.currentProgress, value: 100}
          }, () => setTimeout(() => this.setState({
              currentProgress: null,  
              predictions: message.data.labels
            }, () => this.props.setActiveLabel(this.state.predictions[0].label)
            ), 500)
          )
          break;
        default:
          worker.terminate();
          this.setState({
            currentProgress: null,
            error: true
          })
          break;
      }
    }
    worker.postMessage({message: 'Analyze', input: imageData})
  }

  handleResultClick = (e, label) => {
    const selectedEl = document.getElementById(e.currentTarget.id);
    const activeResult = document.getElementsByClassName('active-result')[0];
    activeResult.classList.remove('active-result');
    selectedEl.classList.add('active-result');
    this.props.setActiveLabel(label)
  }

  render() {
    const { predictions, currentProgress, error } = this.state
    const haveProgress = currentProgress ? true : false;
    const contextualized = predictions ? predictions.map((p, i, arr) =>
      {
        let confidence_level
        if (p.value > HIGH_CONFIDENCE_THRESHOLD) {
          confidence_level = 'success'
        } else if (p.value > MEDIUM_CONFIDENCE_THRESHOLD) {
          confidence_level = 'info'
        } else if (p.value > LOW_CONFIDENCE_THRESHOLD) {
          confidence_level = 'warning'
        } else {
          confidence_level = 'danger'
        }
        return (
          <div
            onClick={(e) => this.handleResultClick(e, p.label)}
            className={`result mb-3 ${i === 0 ? 'active-result' : '' }`} 
            key={i}
            id={`result${i}`}
            >
            <div className='p-3'>
              <div className={`text-${confidence_level} w-50 pr-3 d-inline-block text-right`}>
                {p.label}
              </div>
              <div className={`w-50 pr-3 d-inline-block`}>
                <Progress color={confidence_level} value={p.value * 1000}></Progress>
              </div>
            </div>
          </div>
        )
      }
    ) : null
    const haveTags = contextualized ? true : false;
    return (
      <div>
        { currentProgress ? 
          <Fade in={haveProgress}>
            <Progress {...currentProgress} />
          </Fade> 
          : null
          }
        { contextualized ? 
          <Fade in={haveTags && !haveProgress}>
            { contextualized.map((tags) => tags) }
          </Fade>
          : null
          }
        { error ?
          <Alert color='danger'>arch-v couldn't make a prediction</Alert>
          : null
          }
      </div>
    );
  }
}

export default Classifier;
