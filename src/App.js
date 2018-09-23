import React, { Component } from 'react';
import './App.css';
import {Container, Row, Col} from 'reactstrap';
import Classifier from './components/Classifier';
import Dropzone from './components/Dropzone';
import UploadButton from './components/UploadButton';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import RelatedImages from './components/RelatedImages';
import Intro from './components/Intro';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    const lastVisit = localStorage.getItem('lastVisit')
    if(lastVisit === undefined ) {
      this.setState({lastVisit: null})
    } else {
      this.setState({lastVisit: lastVisit})
    }
  }

  uploadHandler = (upload) => {
    this.setState({currentUpload: upload})
  }

  imageReadyHandler = () => {
    const imgEl = document.getElementById('inputImage')
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

  setActiveLabel = (label) => {
    this.setState({...this.state, activeLabel: label})
  }

  setVisit = () => {
    const now = Date.now();
    localStorage.setItem('lastVisit', now)
    this.setState({...this.state, lastVisit: now})
  }

  render() {
    const { currentUpload, imageData, activeLabel, lastVisit } = this.state
    return (
      <div className="App">
        <NavHeader/>
        {lastVisit === null ? 
        <Intro 
          destinationHandler={this.uploadHandler}
          setVisit={this.setVisit}
          /> 
        : null
        }
        <Container className='primary-container'>
          <Dropzone 
            id='archDropzone'
            dragActiveClassName='striped'
            destinationHandler={this.uploadHandler}
            dragActiveText='Drop here'
            >
          <Row>
            <Col sm={6} className='pb-3 pb-sm-0'>
              <div className='img-container'>
                <img 
                  id='inputImage' 
                  alt='' 
                  src={currentUpload} 
                  onLoad={this.imageReadyHandler}
                  />
              </div>
              <UploadButton 
                destinationHandler={this.uploadHandler}
              />
            </Col>
            <Col sm={6}>
            { imageData ?
              <Classifier
                imageData={imageData}
                setActiveLabel={this.setActiveLabel}
              />
            : null
            }
            </Col>
          </Row>
          </Dropzone>
        { activeLabel ? <hr/> : null }
        { activeLabel ?
          <RelatedImages activeLabel={activeLabel}/>
          : null
        }
        <Row>
            <canvas className='d-none' id='primaryCanvas'></canvas>
        </Row>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default App;
