// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import AssertionList from '../AssertionList';
import BountySummary from '../BountySummary';

class BountyInfo extends Component {

  render() {
    const { props: { bounty } } = this;

    return (
      <div className='Bounty-Info'>
        <div className='Bounty-Info-Container'>
          <BountySummary bounty={bounty} />
          <AssertionList className='Bounty-Info-Assertions'
            bounty={bounty} />
        </div>
      </div>
    );
  }
}

BountyInfo.propTypes = {
  bounty: PropTypes.object.isRequired,
};
export default BountyInfo;
