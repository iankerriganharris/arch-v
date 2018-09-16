import React, { Component } from 'react';
import './App.css';
import {Container, Row, Col} from 'reactstrap';
import Machine from './helpers/Machine';
import Classifier from './components/Classifier';
import Dropzone from './components/Dropzone';
import UploadButton from './components/UploadButton';

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

  uploadHandler = (upload) => {
    this.setState({currentUpload: upload})
  }

  imageReadyHandler = () => {
    this.setState({imageElement: document.getElementById('inputImage')})
  }

  render() {
    const { imageElement, numAnalyzed, currentUpload } = this.state
    return (
      <div className="App">
        <Container className='bg-light primary-container'>
          <Dropzone 
            id='archDropzone' 
            dragActiveClassName='striped'
            destinationHandler={this.uploadHandler}
            dragActiveText='Drop here'
          >
          <Row>
            <Col>
              <div className='img-container'>
                <img id='inputImage' src={currentUpload} onLoad={this.imageReadyHandler}/>
              </div>
              <UploadButton 
                destinationHandler={this.uploadHandler}
              />
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
          <Row>
            <Col>
            </Col>
          </Row>
          </Dropzone>
        </Container>
      </div>
    );
  }
}

export default App;
