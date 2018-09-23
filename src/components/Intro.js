import React, {Component} from 'react';
import {Fade} from 'reactstrap';

const EXAMPLE_URL = 'img/example.jpg';

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      shouldFade: false,
    }
  }

  componentDidMount() {
    this.startTutorial()
  }

  startTutorial = () => {
    this.setState({message: 'Welcome'}, () => 
      // Fade out
      setTimeout(() => this.toggleFade(), 1500)
    )
    // Initial fade in
    this.toggleFade()

    setTimeout(() => {
      this.setState({
        message: 'Click to upload an image of a building, or drag and drop.'
      }, () =>
        // Fade out
        setTimeout(() => this.toggleFade(), 3000)
      )
      // Fade in
      this.toggleFade()
    }, 2000)

    setTimeout(() => {
      this.props.destinationHandler(EXAMPLE_URL)
    }, 3500)

    setTimeout(() => {
      document.getElementById('currentProgress').scrollIntoView({behavior: 'smooth'})
      this.setState({
        message: 'Arch-V will attempt to determine the building\'s architectural style.'
      }, () => 
        // Fade out
        setTimeout(() => this.toggleFade(), 4000)
      )
      // Fade in
      this.toggleFade()
    }, 6000)

    setTimeout(() => {
      document.getElementById('result0').scrollIntoView({behavior: 'smooth'})
      this.setState({
        message: 'Results are ranked and color-coded by confidence.'
      }, () => 
        // Fade out
        setTimeout(() => this.toggleFade(), 4000)
      )
      // Fade in
      this.toggleFade()
    }, 11000)

    setTimeout(() => {
      document.getElementById('relatedImages').scrollIntoView({behavior: 'smooth'})
      this.setState({
        message: 'Images of related buildings are shown below.'
      }, () => 
        // Fade out
        setTimeout(() => this.toggleFade(), 4000)
      )
      // Fade in
      this.toggleFade()
    }, 16000)

    setTimeout(() => {
      document.getElementById('navHeader').scrollIntoView({behavior: 'smooth'});
      this.props.setVisit();
    }, 20500)
  }

  toggleFade = () => {
    this.setState({shouldFade: !this.state.shouldFade})
  }

  render() {
    const { message, shouldFade } = this.state;
    return(
      <div className='overlay'>
        <Fade in={shouldFade}>
        <div className='overlay-text'>
          {message}
        </div>
        </Fade>
      </div>
    )
  }
}

export default Intro;