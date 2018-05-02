import React, { Component } from 'react';
import Header from '../Header';
import AddressField from '../AddressField';
import ChainInfo from '../ChainInfo';
import TransferForm from '../TransferForm';
import Button from '../Button';
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
    return (
      <div className="App">
        <Header />
        <div className="App-Contents">
          <AddressField onChange={this.onAddressChange} />
          <div className="App-Chains">
            <ChainInfo />
            <ChainInfo />
          </div>
          <TransferForm />
        </div>
      </div>
    );
  }

  onAddressChange(address) {
    this.setState({address: address});
  }
}

export default App;
