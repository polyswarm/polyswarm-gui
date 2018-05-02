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

    this.onAddressChange = this.onAddressChange.bind(this);
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

  onAddressChange(address) {
    this.setState({address: address});
  }
}

export default App;
