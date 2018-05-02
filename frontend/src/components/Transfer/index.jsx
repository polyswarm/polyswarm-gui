// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
import Header from '../Header';
import AddressField from '../AddressField';
import ChainInfo from '../ChainInfo';
import TransferForm from '../TransferForm';
// Component imports

class Transfer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div>
          <Header />  
          <AddressField onChange={this.onAddressChange} />
          <div >
            <ChainInfo />
            <ChainInfo />
          </div>
          <TransferForm />
        </div>
    );
  }

}
Transfer.proptypes = {

}
export default Transfer;