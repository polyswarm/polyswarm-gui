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
        hide: false,
    };

    this.onAddressChanged = this.onAddressChanged.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  render() {
    const {state: {error, address, hide} } = this;
    return(
      <div className='Landing'>
        <CSSTransition
          in={!hide}
          classNames='fade'
          unmountOnExit
          timeout={300}>
          {() => (
              <div className='Landing-Background'/>
          )}
        </CSSTransition>
        <div className='Landing-Content'>
          <CSSTransition
            in={!hide}
            classNames='fade'
            unmountOnExit
            timeout={300}>
            {() => (
              <h1>{strings.title}</h1>
            )}
          </CSSTransition>
          <div className='Landing-Address'>
            <CSSTransition
              in={!hide}
              classNames='translate'
              unmountOnExit
              timeout={500}>
              {() => (
                <AddressField onChange={this.onAddressChanged} />
              )}
            </CSSTransition>
            <CSSTransition
              in={!hide}
              classNames='fade'
              unmountOnExit
              timeout={300}>
              {() => (
                <Button
                  disabled={error || address.length == 0}
                  onClick={this.onButtonClick} >
                  {strings.go}
                </Button>
              )}
            </CSSTransition>
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

}
export default Landing;