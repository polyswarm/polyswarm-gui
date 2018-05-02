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
    };
  }

  render() {
    const {state: {error} } = this;
    return(
        <div className='Landing'>
          <div className='Landing-Background'/>
          <div className='Landing-Content'>
            <h1>{strings.title}</h1>
            <div className='Landing-Address'>
                <AddressField onChange={this.onAddressChange} />
                <Button
                  disabled={error}
                  onClick={this.onButtonClick} >
                  {strings.go}
                </Button>
            </div>
          </div>
        </div>
    );
  }

}
Landing.proptypes = {

}
export default Landing;