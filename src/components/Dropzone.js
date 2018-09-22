import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Dropzone extends Component {
  state = {
    dragActive: false
  }

  handleDragOver = (e) => {
    e.preventDefault();
    this.setState({dragActive: true})
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    this.setState({dragActive: false})
  }

  handleDropFile = (e, destinationHandler) => {
    e.preventDefault();
    if(e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.setState({dragActive: false}, () => {
          destinationHandler(readerEvent.target.result)
        })
      }
      reader.readAsDataURL(e.dataTransfer.files[0])
    }
  }

  render() {
    const { dragActiveClassName, id } = this.props
    const { dragActive } = this.state
    return(
      <div
        id={id}
        className={dragActive ? dragActiveClassName : ''}
        onDrop={(e) => this.handleDropFile(e, this.props.destinationHandler)}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
      >
        {dragActive ? <span>Drop now to upload!</span> : null}
        {this.props.children}
      </div>
    )
  }
}

Dropzone.propTypes = {
  destinationHandler: PropTypes.func.isRequired
}

export default Dropzone;