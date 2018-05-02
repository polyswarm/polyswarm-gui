// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
// Component imports

class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {props: {children}} = this;
    return (
        <button {...this.props} >
          {children}
        </button>
    );
  }
}
Button.proptypes = {
  disable: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.string
}
export default Button;