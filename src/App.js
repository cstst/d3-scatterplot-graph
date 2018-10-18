import React, { Component } from 'react';
import Graph from './components/Graph';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div id="display">
        <Graph />
      </div>
    );
  }
}

export default App;
