// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
import AddressField from '../AddressField';
import Button from '../Button';
// Component imports
import strings from  './strings.js';
import './styles.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
        address: '',
        error: false,
        hide: false,
    };

    this.onAddressChanged = this.onAddressChanged.bind(this);
  }

  render() {
    const {state: {error, address} } = this;
    return(
        <div className='Landing'>
          <div className='Landing-Background'/>
          <div className='Landing-Content'>
            <h1>{strings.title}</h1>
            <div className='Landing-Address'>
                <AddressField onChange={this.onAddressChanged} />
                <Button
                  disabled={error || address.length == 0}
                  onClick={this.onButtonClick} >
                  {strings.go}
                </Button>
            </div>
          </div>
        </div>
    );
  }

  onAddressChanged(address, valid) {
    this.setState({address: address, error: !valid});
  }

}
Landing.proptypes = {

}
export default Landing;