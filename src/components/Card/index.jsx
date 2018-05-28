// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Project Imports

class Card extends Component {

  render() {
    const {props: {onClick, children}} = this;
    return (
      <li onClick={onClick}>
        <div className='Card'>
          {children}
        </div>
      </li>
    );
  }
}
Card.proptypes = {
  onClick: PropTypes.func,
};
export default Card;