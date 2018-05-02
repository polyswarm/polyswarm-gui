// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Project imports
// Component Imports
import './styles.css';

class Button extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render () {
    const { props: { disabled, children, cancel, flat } } = this;
    const classes = classNames('Button', {
      'flat-cancel': cancel && flat,
      'flat': !cancel && flat,
      'cancel': cancel && !flat
    });
    return (
      <button
        disabled={disabled}
        className={classes}
        onClick={this.onClickHandler}>
        {children}
      </button>
    );
  }

  onClickHandler() {
    const { props: { onClick } } = this;
    if (onClick) {
      onClick();
    }
  }
}

Button.proptypes = {
  onClick: PropTypes.func.isRequired,
  cancel: PropTypes.bool,
};

export default Button;
