import React, { Component } from 'react';
import Landing from '../Landing';
import Transfer from '../Transfer';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
    }
  }

  render() {
    const {state: {address}} = this;
    return (
      <div className="App">
        {!address && <Landing />}
        {address && <Transfer />}
      </div>
    );
  }
}

export default App;
