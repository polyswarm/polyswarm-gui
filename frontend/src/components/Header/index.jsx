// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty Manager imports
// Component imports
import './styles.css';
import strings from './strings';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <header className="Header">
          {strings.title}
        </header>
    );
  }

}
Header.proptypes = {

};
export default Header;