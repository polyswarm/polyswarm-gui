// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {CSSTransition} from 'react-transition-group';
// Project imports
// Component imports
import strings from './strings';
import './styles.css';

class AddressField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      focused: false,
      error: false
    }

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  render() {
    const {state: {address, error, focused} } = this;
    const inputClass = classNames('AddressField-Input', {error: error});
    return (
        <div className='AddressField'>
          <CSSTransition
            in={address.length > 0 || focused}
            timeout={300}
            classNames='label'> 
            {() => (
              <label className='AddressField-Label'
                htmlFor='address'>
                {strings.address}
              </label>
            )}
          </CSSTransition>
          <input
            className={inputClass}
            id='address'
            type='text'
            value={address}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}/>
        </div>
    );
  }

  onBlur() {
    this.setState({focused: false});
  }

  onChange(e) {
    const {props: {onChange}} = this;
    const address = e.target.value;
    const valid = this.validateAddress(address)
    if (onChange) {
      onChange(address, valid);
    }
    this.setState({address: address, error: !valid});
  }

  onFocus() {
    this.setState({focused: true});
  }

  validateAddress(address) {
    return address.length == 0 || address.length > 14;
  }
}
AddressField.proptypes = {
  onChange: PropTypes.func,
}
export default AddressField;