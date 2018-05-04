import React, { Component } from 'react';
import Landing from '../Landing';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '0x6322c188b4b353acb89c0db66672f0bac421c9e8',
      home: {
        name: 'Mainnet',
        networkId: 1,
        relayAddress: '0x5af8bcc6127afde967279dc04661f599a5c0cafa',
        balance: 1

      },
      side: {
        name: 'PolySwarm Sidechain',
        networkId: 39347,
        relayAddress: '0x7e7087c25df885f97aeacbfae84ea12016799eee',
        balance: 1
      }
    }
  }

  render() {
    const {state: {address, home, side}} = this;
    return (
      <div className="App">
        <Landing
          address={address}
          homechain={home}
          sidechain={side}
          onTransfer={this.onTransfer}/>
      </div>
    );
  }

  onTransfer(nectar, network) {
    // If metamask, create transfer event
  }
}

export default App;
