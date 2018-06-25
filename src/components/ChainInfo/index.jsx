// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Project imports
import StatRow from '../StatRow';
// Component imports
import strings from './strings.js';

class ChainInfo extends Component {
  render() {
    const {
      props: { title, homeName, homeBalance, sideName, sideBalance }
    } = this;
    return (
      <div className="ChainInfo">
        <div className="ChainInfo-Title">
          <h3>{title}</h3>
        </div>
        <div className="ChainInfo-Content">
          <p>{strings.balances}</p>
          <ul>
            <StatRow
              vertical
              title={homeName}
              content={`${homeBalance}${strings.nectar}`}
            />
            <StatRow
              vertical
              title={sideName}
              content={`${sideBalance}${strings.nectar}`}
            />
          </ul>
        </div>
      </div>
    );
  }
}

ChainInfo.proptypes = {
  title: PropTypes.string,
  homeName: PropTypes.string,
  homeBalance: PropTypes.string,
  sideName: PropTypes.string,
  sideBalance: PropTypes.string
};
export default ChainInfo;
