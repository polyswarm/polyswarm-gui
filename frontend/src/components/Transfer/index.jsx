// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
import Header from '../Header';
import NectarField from '../NectarField';
import ChainInfo from '../ChainInfo';
import TransferForm from '../TransferForm';
// Component imports
import './styles.css';

class Transfer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {props: {nectar}} = this;
    return(
        <div className='Transfer'>
          <Header />
          <div className='Transfer-Content'>
            <NectarField
              onChange={this.onNectarChange}
              nectar={nectar}/>
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
  nectar: PropTypes.string
}
export default Transfer;