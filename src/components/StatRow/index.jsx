// Vendor Imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// Bounty Management Imports

// Component Imports

class StatRow extends Component {
  render() {
    const {props: {title, content}} = this;
    return (
      <li className='StatRow'>
        <p className='StatTitle'>{title}</p>
        <p className='StatContent'>{content}</p>
      </li>
    );
  }
}
StatRow.proptypes = {
  title: PropTypes.string,
  content: PropTypes.string,
}
export default StatRow;