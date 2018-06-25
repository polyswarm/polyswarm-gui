// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
// Component imports
class Dropdown extends Component {
  render() {
    const {
      props: { children, light }
    } = this;
    const iconPath = light
      ? '../public/img/menu_light.svg'
      : '../public/img/menu.svg';
    return (
      <div className="Dropdown">
        <img
          className="Dropdown-Icon"
          src={iconPath}
          width="7px"
          height="24px"
          alt="menu"
        />
        <div className="Dropdown-Choices">{children}</div>
      </div>
    );
  }
}
Dropdown.proptypes = {
  light: PropTypes.bool
};
export default Dropdown;
