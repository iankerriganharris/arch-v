import React, { Component } from 'react';
import './App.css';
import {Container, Row, Col} from 'reactstrap';
import Classifier from './components/Classifier';
import Dropzone from './components/Dropzone';
import UploadButton from './components/UploadButton';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      imageElement: null
    };
  }

  uploadHandler = (upload) => {
    this.setState({currentUpload: upload})
  }

  imageReadyHandler = () => {
    const imgEl = document.getElementById('inputImage')
    this.setState({imageElement: imgEl})
    const c = document.getElementById('primaryCanvas');
    const ctx = c.getContext('2d');
    const nw = imgEl.naturalWidth;
    const nh = imgEl.naturalHeight;
    c.width = nw;
    c.height = nh;
    ctx.drawImage(imgEl, 0, 0, nw, nh);
    const imgData = ctx.getImageData(0,0,nw,nh)
    this.setState({imageData: imgData})
  }

  render() {
    const { currentUpload, imageData } = this.state
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
            { imageData ?
              <Classifier
                imageData={imageData}
              />
            : null 
            }
            </Col>
          </Row>
          <Row>
            <Col>
            </Col>
          </Row>
          <Row>
              <canvas className='d-none' id='primaryCanvas'></canvas>
          </Row>
          </Dropzone>
        </Container>
      </div>
    );
  }
}

export default App;
