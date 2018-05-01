// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
// Component imports
import strings from './strings';

class AddressField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
    }

    this.onChange = this.onChange.bind(this);
  }

  render() {
    const {state: {address} } = this;
    return (
        <form>
          <label htmlFor='address'>
            {strings.address}
          </label>
          <input
            id='address'
            type='text'
            value={address}
            onChange={this.onChange}/>
        </form>
    );
  }

  onChange(e) {
    const {props: {onChange}} = this;
    if (onChange) {
      onChange(e.target.value);
    }
  }
}
AddressField.proptypes = {
  onChange: PropTypes.func,
}
export default AddressField;