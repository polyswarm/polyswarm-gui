// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import AssertionList from '../AssertionList';
import BountySummary from '../BountySummary';
import Header from '../Header';

class BountyInfo extends Component {

  render() {
    const { props: { bounty, requestsInProgress, onBackPressed, wallet,
      address } } = this;

    return (
      <div className='Bounty-Info'>
        <Header title={bounty.guid}
          requests={requestsInProgress}
          back={true}
          onBack={onBackPressed}
          address={address}
          wallet={wallet}/>
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
  onBackPressed: PropTypes.func,
  onRequestWalletChange: PropTypes.func,
  wallet: PropTypes.object,
  requestsInProgress: PropTypes.array,
  address: PropTypes.string,
};
export default BountyInfo;
