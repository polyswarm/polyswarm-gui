// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
// Component imports
import strings from './strings.js';
import './styles.css';

class ChainInfo extends Component {
  render() {
    const {props: {title, homeName, homeBalance, sideName, sideBalance}} = this;
    return (
        <div className='ChainInfo'>
          <div className='ChainInfo-Title'>
            <h2>{title}</h2>
          </div>
          <div className='ChainInfo-Content'>
            <p>{strings.balances}</p>
            <ul>
              <li><b>{homeName}</b>{': '}{homeBalance}</li>
              <li><b>{sideName}</b>{': '}{sideBalance}</li>
            </ul>
          </div>
        </div>
    )
  }
}

ChainInfo.proptypes = {
  title: PropTypes.string,
  homeName: PropTypes.string,
  homeBalance: PropTypes.string,
  sideName: PropTypes.string,
  sideBalance: PropTypes.string
}
export default ChainInfo;