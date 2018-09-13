import React, { Component } from 'react';
import './App.css';
import ImageProcessor from './components/ImageProcessor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ImageProcessor />
      </div>
    );
  }
}

export default App;
