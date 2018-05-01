import React, { Component } from 'react';
import Header from '../Header';
import AddressField from '../AddressField';
import ChainInfo from '../ChainInfo';
import TransferForm from '../TransferForm';
import Button from '../Button';
import './styles.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <AddressField />
        <div className="App-Chains">
          <ChainInfo />
          <ChainInfo />
        </div>
        <TransferForm />
      </div>
    );
  }
}

export default App;
