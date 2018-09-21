import React, { Component } from 'react';
import './App.css';
import {Container, Row, Col} from 'reactstrap';
import Classifier from './components/Classifier';
import Dropzone from './components/Dropzone';
import UploadButton from './components/UploadButton';
import NavHeader from './components/NavHeader';

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
        <NavHeader/>
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
                <img id='inputImage' alt='' src={currentUpload} onLoad={this.imageReadyHandler}/>
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
        <footer className='footer'>
            <Container>
              <span>
                Tensorflow model trained using the dataset from&nbsp;
                <a 
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://link.springer.com/chapter/10.1007/978-3-319-10590-1_39'
                >
                "Architectural Style Classification using Multinomial Latent Logistic Regression" (ECCV2014)
                </a>.&nbsp;
                For more information about the dataset, contact&nbsp;
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://sites.google.com/site/zhexuutssjtu/home'
                >
                Zhe Xu
                </a>.
              </span>
            </Container>
        </footer>
      </div>
    );
  }
}

export default App;
