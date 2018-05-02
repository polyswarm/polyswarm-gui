// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
import Header from '../Header';
import AddressField from '../AddressField';
import ChainInfo from '../ChainInfo';
import TransferForm from '../TransferForm';
// Component imports
import './styles.css';

class Transfer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {props: {address}} = this;
    return(
        <div className='Transfer'>
          <Header />
          <div className='Transfer-Content'>
            <AddressField
              onChange={this.onAddressChange}
              address={address}/>
            <div >
              <ChainInfo />
              <ChainInfo />
            </div>
            <TransferForm />
          </div>
        </div>
    );
  }

}
Transfer.proptypes = {
  address: PropTypes.string
}
export default Transfer;