// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Project imports
// Component imports
import strings from './strings';
import './styles.css';

class AddressField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      error: false
    }

    this.onChange = this.onChange.bind(this);
  }

  render() {
    const {state: {address, error} } = this;
    const inputClass = classNames('AddressField-Input', {error: error});
    return (
        <div className='AddressField'>
          <label className='AddressField-Label'
            htmlFor='address'>
            {strings.address}
          </label>
          <input
            className={inputClass}
            id='address'
            type='text'
            value={address}
            onChange={this.onChange}/>
        </div>
    );
  }

  onChange(e) {
    const {props: {onChange}} = this;
    const address = e.target.value;
    if (onChange) {
      onChange(address);
    }
    this.setState({address: address, error: !this.validateAddress(address)});
  }

  validateAddress(address) {
    return address.length > 14;
  }
}
AddressField.proptypes = {
  onChange: PropTypes.func,
}
export default AddressField;