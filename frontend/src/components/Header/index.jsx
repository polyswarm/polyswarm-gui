// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
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
          <h2>{strings.title}</h2>
        </header>
    );
  }

}
Header.proptypes = {

};
export default Header;