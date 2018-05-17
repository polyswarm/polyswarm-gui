// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
// Component imports
class Dropdown extends Component {
  render() {
    const {props: {children}} = this;
    return(
      <div className='Dropdown'>
        <img className='Dropdown-Icon'
          src='../public/img/menu.svg'
          width='7px'
          height='24px'
          alt='menu'/>
        <div className='Dropdown-Choices'>
            {children}
        </div>
      </div>
    );
  }
}
Dropdown.proptypes = {
}
export default Dropdown;