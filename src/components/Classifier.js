import React, { Component } from 'react';

const HIGH_CONFIDENCE_THRESHOLD = 0.075
const MEDIUM_CONFIDENCE_THRESHOLD = 0.06
const LOW_CONFIDENCE_THRESHOLD = 0.05

class Classifier extends Component {
  constructor(props) {
    super(props);
    this.state = { predictions: null };
  }

  componentDidMount() {
    this.setState({ analysing: true })
    this.doAnalysis()
  }

  componentDidUpdate(prevProps) {
    if(this.props.numAnalyzed !== prevProps.numAnalyzed) {
      this.doAnalysis()
    }
  }

  doAnalysis = () => {
    const { machine, imageElement } = this.props
    machine.prepInput(imageElement)
    machine.getPredictionValues()
    machine.getTopKValues(5)
    const labels = machine.labelValues()
    this.setState({predictions: labels})
  }

  render() {
    const { predictions } = this.state
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
      <div className="center">
        { contextualized ? contextualized.map((tags) => tags) : null}
      </div>
    );
  }
}

export default Classifier;
