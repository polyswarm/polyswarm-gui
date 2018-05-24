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
    const { props: { disabled, children, cancel, flat, header } } = this;
    const computedClass = classNames('Button', {
      'header': header,
      'header-cancel': header && cancel,
      'cancel': !flat && cancel && !header,
      'flat': flat && !cancel && !header,
      'flat-cancel': flat && cancel && !header,
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
  flat: PropTypes.bool,
  header: PropTypes.bool,
};

export default Button;
