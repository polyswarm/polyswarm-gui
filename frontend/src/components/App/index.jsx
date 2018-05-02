import React, { Component } from 'react';
import {CSSTransition} from 'react-transition-group';
import Landing from '../Landing';
import Transfer from '../Transfer';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
    }

    this.onSetAddress = this.onSetAddress.bind(this);
  }

  render() {
    const {state: {address}} = this;
    return (
      <div className="App">
        <CSSTransition
          in={!address}
          classNames='fade'
          unmountOnExit
          timeout={300}>
          {() => (
            <Landing onSetAddress={this.onSetAddress}/>
          )}
        </CSSTransition>
        <Transfer address={address}/>
      </div>
    );
  }

  onSetAddress(address) {
    this.setState({address: address});
  }
}

export default App;
