// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CSSTransition} from 'react-transition-group';
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
        hide: false
    };

    this.onAddressChanged = this.onAddressChanged.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  render() {
    const {state: {error, address, hide, finished} } = this;
    return(
      <div className='Landing'>
        <div className='Landing-Background'/>
        <div className='Landing-Content'>
          <h1>{strings.title}</h1>
          <div className='Landing-Address'>
            <CSSTransition
              in={!hide}
              classNames='translate'
              onExited={() => {
                const {props: {onSetAddress}, state: {address}} = this;
                if (onSetAddress) {
                  onSetAddress(address);
                }
              }}
              timeout={300}>
              {() => (
                <AddressField onChange={this.onAddressChanged}
                  address={address} />
              )}
            </CSSTransition>
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

  onButtonClick() {
    this.setState({hide: true});
  }

}
Landing.proptypes = {
  onSetAddress: PropTypes.func
}
export default Landing;