// Vendor Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Project Imports

// Component Imports

class StatRow extends Component {
  render() {
    const {
      props: { title, content, vertical }
    } = this;
    const classes = classNames({
      StatRow: !vertical,
      'StatRow-Vertical': vertical
    });
    return (
      <li className={classes}>
        <p className="StatTitle">{title}</p>
        <p className="StatContent">{content}</p>
      </li>
    );
  }
}
StatRow.proptypes = {
  title: PropTypes.string,
  content: PropTypes.string
};
export default StatRow;
