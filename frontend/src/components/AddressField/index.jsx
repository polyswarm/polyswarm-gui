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
      focused: false,
      error: false,
      first: true,
    }

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.getAddress = this.getAddress.bind(this);
  }

  componentDidMount() {
    this.setState({first: false});
  }

  render() {
    const {state: {error, focused} } = this;
    const address = this.getAddress();
    const inputClass = classNames('AddressField-Input', {error: error});
    return (
        <div className='AddressField'>
          <CSSTransition
            in={(address && address.length > 0) || focused}
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
    this.setState({error: !valid});
  }

  onFocus() {
    this.setState({focused: true});
  }

  /**
   * This triggers a redraw of the element so we get CSSTransition to animate
   * when the address is set as a prop for the first draw.
   */
  getAddress() {
    const { state: {first}, props: {address}} = this;
    if (first) {
      return '';
    } else {
      return address;
    }
  }

  validateAddress(address) {
    return address.length == 0 || address.length > 14;
  }
}
AddressField.proptypes = {
  onChange: PropTypes.func,
  address: PropTypes.string
}
export default AddressField;