// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Button extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render () {
    const { props: { disabled, children, cancel, flat } } = this;
    const computedClass = classNames('Button', {
      'cancel': !flat && cancel,
      'flat': flat && !cancel,
      'flat-cancel': flat && cancel
    });
    return (
      <button
        disabled={disabled}
        className={computedClass}
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
