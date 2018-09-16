import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Uploader extends Component {
  constructor(props) {
    super(props);
    this.state = { dragActive: false };
  }

  // Standard file input handlers

  handleClick = () => {
    document.getElementById('hiddenInput').click()
  }

  handleInputFile = (e) => {
    if(e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({upload: e.target.result})
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Drag and drop handlers

  handleDragOver = (e) => {
    e.preventDefault();
    this.setState({dragActive: true})
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    this.setState({dragActive: false})
  }

  handleDropFile = (e) => {
    e.preventDefault();
    if(e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.setState({upload: readerEvent.target.result, dragActive: false})
      }
      reader.readAsDataURL(e.dataTransfer.files[0])
    }
  }
  
  render() {
    const dragActive = this.state.dragActive
    const upload = this.state.upload
    const uploadHandler = this.props.uploadHandler
    return (
      <div
        className={'dropzone' + (dragActive ? ' striped' : '')} 
        onDrop={this.handleDropFile}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
      >
        {this.props.children}
        <div className='img-container'>
          <img id='inputImage' src={upload} alt='' onLoad={uploadHandler}/>
        </div>
        <input type="file" id='hiddenInput' className='hidden' onChange={this.handleInputFile}/>
        <Button color='primary' active={false} onClick={this.handleClick}>Upload</Button>
      </div>
    );
  }
}

export default Uploader;
