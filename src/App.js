import React, { Component } from 'react';
import './App.css';
import {Container, Row, Col} from 'reactstrap';
import Machine from './helpers/Machine'
import Uploader from './components/Uploader';
import Classifier from './components/Classifier';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      imageElement: null,
      uploadDestination: 'inputImage',
      numAnalyzed: 0,
      inProgress: false
    };
  }

  componentDidMount() {
    this.appMachine = new Machine()
    this.appMachine.loadModel()
    this.appMachine.loadLabels()
  }

  uploadHandler = () => {
    const upload = document.getElementById(this.state.uploadDestination)
    this.setState({imageElement: upload, numAnalyzed: this.state.numAnalyzed + 1})
  }

  render() {
    const { imageElement, uploadDestination, numAnalyzed } = this.state
    return (
      <div className="App">
        <Container className='bg-light primary-container'>
          <Row>
            <Col>
              <Uploader uploadDestination={uploadDestination} uploadHandler={this.uploadHandler} />
            </Col>
            <Col>
            { imageElement ?
              <Classifier 
                machine={this.appMachine} 
                imageElement={imageElement} 
                numAnalyzed={numAnalyzed}
              />
            : null 
            }
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
